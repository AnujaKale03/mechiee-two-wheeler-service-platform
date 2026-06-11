const Mechanic = require("../models/Mechanic");
const Booking = require("../models/Booking");
const { sendPushNotification } = require("./notificationService");

const MAX_DAILY_BOOKINGS = 3;

// Get today's active booking count for a mechanic
const getTodayCount = async (mechanicId) => {
  const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
  const endOfDay   = new Date(); endOfDay.setHours(23,59,59,999);
  return Booking.countDocuments({
    mechanicId,
    status: { $in: ["ASSIGNED", "IN_PROGRESS"] },
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });
};

// Assign to least-busy mechanic with daily capacity
const assignMechanic = async () => {
  const mechanics = await Mechanic.find({ isActive: true });

  const withCounts = await Promise.all(
    mechanics.map(async (m) => ({ mechanic: m, todayCount: await getTodayCount(m._id) }))
  );
  withCounts.sort((a, b) => a.todayCount - b.todayCount);

  const best = withCounts[0];
  if (best && best.todayCount < MAX_DAILY_BOOKINGS) {
    return { mechanicId: best.mechanic._id, status: "ASSIGNED" };
  }
  return { mechanicId: null, status: "WAITLISTED" };
};

// Called when a booking is COMPLETED — reassign oldest waitlisted booking to this mechanic
const reassignWaitlisted = async (completedMechanicId) => {
  const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
  const endOfDay   = new Date(); endOfDay.setHours(23,59,59,999);

  // Check if mechanic is still under daily cap after completion
  const todayCount = await getTodayCount(completedMechanicId);
  if (todayCount >= MAX_DAILY_BOOKINGS) return null;

  // Find oldest waitlisted booking
  const waitlisted = await Booking.findOne({ status: "WAITLISTED" })
    .sort({ createdAt: 1 })
    .populate("serviceId");

  if (!waitlisted) return null;

  const mechanic = await Mechanic.findById(completedMechanicId);

  waitlisted.mechanicId = completedMechanicId;
  waitlisted.status = "ASSIGNED";
  await waitlisted.save();

  // Notify mechanic about new assignment
  if (mechanic?.expoPushToken) {
    await sendPushNotification(
      mechanic.expoPushToken,
      "New Booking Assigned! 🔧",
      `You have a new ${waitlisted.serviceId?.name} booking from ${waitlisted.customerName}`,
      { bookingId: waitlisted._id }
    );
  }

  return waitlisted;
};

module.exports = { assignMechanic, reassignWaitlisted };