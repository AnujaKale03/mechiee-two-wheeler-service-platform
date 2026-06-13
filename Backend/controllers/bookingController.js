const Booking  = require("../models/Booking");
const Service  = require("../models/Service");
const Mechanic = require("../models/Mechanic");
const { assignMechanic, reassignWaitlisted } = require("../services/mechanicAssignmentService");
const { sendPushNotification } = require("../services/notificationService");
const { createOrder, verifyPayment } = require("../services/paymentService");

// ── POST /bookings ────────────────────────────────────────
const createBooking = async (req, res) => {
  try {
    console.log("BOOKING BODY:", req.body);
    const { customerName, bikeModel, vehicleNumber, serviceId, customerExpoPushToken } = req.body;
    if (!customerName || !bikeModel || !vehicleNumber || !serviceId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });
    const assignment = await assignMechanic();
    const booking = await Booking.create({
      customerName, bikeModel, vehicleNumber, serviceId,
      mechanicId: assignment.mechanicId,
      status: assignment.status,
      customerExpoPushToken: customerExpoPushToken || null,
      paymentStatus: "PENDING",
    });
    if (assignment.mechanicId) {
      const mechanic = await Mechanic.findById(assignment.mechanicId);
      if (mechanic?.expoPushToken) {
        await sendPushNotification(mechanic.expoPushToken, "New Booking! 🔧", `${customerName}'s ${bikeModel} — ${service.name}`, { bookingId: booking._id });
      }
    }
    res.status(201).json({
      success: true, status: assignment.status,
      message: assignment.status === "WAITLISTED" ? "No mechanics available. Booking waitlisted." : "Booking created. Pay after service completion.",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /bookings ─────────────────────────────────────────
// Supports ?customerName=Rahul to show only that customer's bookings
const getBookings = async (req, res) => {
  try {
    // No customerName = return empty (prevents new users seeing all bookings)
    if (!req.query.customerName || !req.query.customerName.trim()) {
      return res.status(200).json([]);
    }
    const filter = {
      customerName: { $regex: new RegExp(`^${req.query.customerName.trim()}$`, "i") }
    };
    const bookings = await Booking.find(filter)
      .populate("serviceId")
      .populate("mechanicId", "name avgRating")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── PATCH /bookings/:id/status ────────────────────────────
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, eta } = req.body;
    const allowed = ["IN_PROGRESS", "COMPLETED", "ASSIGNED"];
    if (!allowed.includes(status)) return res.status(400).json({ message: `Invalid status` });
    const booking = await Booking.findById(id).populate("serviceId").populate("mechanicId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "WAITLISTED") return res.status(400).json({ message: "Cannot update a waitlisted booking" });
    if (booking.status === "CANCELLED")  return res.status(400).json({ message: "Cannot update a cancelled booking" });
    booking.status = status;
    if (eta) booking.eta = eta;
    if (status === "COMPLETED") {
      booking.completedAt = new Date();
      try {
        const paymentOrder = await createOrder(booking.serviceId.price, "INR", `booking_${booking._id}`);
        booking.paymentOrderId = paymentOrder.id;
        if (paymentOrder.isMock) {
          booking.paymentStatus = "PAID";
          booking.paymentId = `mock_pay_${Date.now()}`;
          console.log(`[Payment] Mock payment auto-verified for booking ${booking._id}`);
        } else {
          booking.paymentStatus = "AWAITING";
        }
      } catch (payErr) {
        console.error("[Payment] Order creation failed:", payErr.message);
        booking.paymentStatus = "FAILED";
      }
      await booking.save({ validateBeforeSave: false });
      if (booking.customerExpoPushToken) {
        await sendPushNotification(booking.customerExpoPushToken, "Service Completed! ✅", `Your ${booking.serviceId?.name} is done. Please rate your experience.`, { bookingId: booking._id, action: "RATE" });
      }
      await reassignWaitlisted(booking.mechanicId._id || booking.mechanicId);
    } else {
      await booking.save({ validateBeforeSave: false });
      if (status === "IN_PROGRESS" && booking.customerExpoPushToken) {
        const etaText = eta ? ` ETA: ${eta}.` : "";
        await sendPushNotification(booking.customerExpoPushToken, "Mechanic On the Way! 🏍️", `${booking.mechanicId?.name} started on your ${booking.bikeModel}.${etaText}`, { bookingId: booking._id });
      }
    }
    const updated = await Booking.findById(id).populate("serviceId").populate("mechanicId");
    res.status(200).json({ success: true, message: "Booking status updated", booking: updated });
  } catch (error) {
    console.error("updateBookingStatus error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── PATCH /bookings/:id/cancel ────────────────────────────
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (!["ASSIGNED", "WAITLISTED"].includes(booking.status)) return res.status(400).json({ message: "Can only cancel ASSIGNED or WAITLISTED bookings" });
    booking.status = "CANCELLED";
    booking.cancelledAt = new Date();
    await booking.save({ validateBeforeSave: false });
    if (booking.mechanicId) await reassignWaitlisted(booking.mechanicId);
    res.status(200).json({ success: true, message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /bookings/:id/rate ───────────────────────────────
const rateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be 1–5" });
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "COMPLETED") return res.status(400).json({ message: "Can only rate completed bookings" });
    if (booking.rating) return res.status(400).json({ message: "Already rated" });
    booking.rating = rating;
    booking.ratingComment = comment || null;
    await booking.save({ validateBeforeSave: false });
    if (booking.mechanicId) {
      const mechanic = await Mechanic.findById(booking.mechanicId);
      if (mechanic) {
        const newTotal = mechanic.totalRatings + 1;
        mechanic.avgRating    = ((mechanic.avgRating * mechanic.totalRatings) + rating) / newTotal;
        mechanic.totalRatings = newTotal;
        await mechanic.save();
      }
    }
    res.status(200).json({ success: true, message: "Rating submitted", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /bookings/:id/payment/verify ────────────────────
const verifyBookingPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      booking.paymentStatus = "FAILED";
      await booking.save({ validateBeforeSave: false });
      return res.status(400).json({ message: "Payment verification failed" });
    }
    booking.paymentStatus = "PAID";
    booking.paymentId = razorpayPaymentId;
    await booking.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: "Payment verified", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── PATCH /bookings/:id/eta ───────────────────────────────
const updateETA = async (req, res) => {
  try {
    const { id } = req.params;
    const { eta } = req.body;
    if (!eta) return res.status(400).json({ message: "ETA is required" });
    const booking = await Booking.findById(id).populate("serviceId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.eta = eta;
    await booking.save({ validateBeforeSave: false });
    if (booking.customerExpoPushToken) {
      await sendPushNotification(booking.customerExpoPushToken, "ETA Updated ⏱️", `Mechanic arrives in ${eta} for ${booking.serviceId?.name}`, { bookingId: booking._id });
    }
    res.status(200).json({ success: true, message: "ETA updated", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBookings, updateBookingStatus, cancelBooking, rateBooking, verifyBookingPayment, updateETA };