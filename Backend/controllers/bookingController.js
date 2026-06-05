const Booking = require("../models/Booking");
const Service = require("../models/Service");
const assignMechanic = require("../services/mechanicAssignmentService");

const createBooking = async (req, res) => {
  try {
    const { customerName, bikeModel, serviceId } = req.body;

    if (!customerName || !bikeModel || !serviceId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    const assignment = await assignMechanic();

    const booking = await Booking.create({
      customerName,
      bikeModel,
      serviceId,
      mechanicId: assignment.mechanicId,
      status: assignment.status,
    });

    res.status(201).json({
      success: true,
      status: assignment.status,
      message:
        assignment.status === "WAITLISTED"
          ? "No mechanics available today. Booking Waitlisted."
          : "Booking Created Successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("serviceId")
      .populate("mechanicId")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["IN_PROGRESS", "COMPLETED", "ASSIGNED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "WAITLISTED") {
      return res.status(400).json({
        message: "Cannot update status of a waitlisted booking",
      });
    }

    booking.status = status;
    await booking.save();

    const updated = await Booking.findById(id)
      .populate("serviceId")
      .populate("mechanicId");

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
};