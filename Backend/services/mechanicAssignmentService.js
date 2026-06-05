const Mechanic = require("../models/Mechanic");
const Booking = require("../models/Booking");

const MAX_DAILY_BOOKINGS = 3;

const assignMechanic = async () => {
  // Get start and end of today (midnight to midnight)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const mechanics = await Mechanic.find();

  // For each mechanic, count only today's active (non-waitlisted, non-completed) bookings
  const mechanicsWithDailyCount = await Promise.all(
    mechanics.map(async (mechanic) => {
      const todayCount = await Booking.countDocuments({
        mechanicId: mechanic._id,
        status: { $in: ["ASSIGNED", "IN_PROGRESS"] },
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });

      return {
        mechanic,
        todayCount,
      };
    })
  );

  // Sort by today's count ascending — least busy first
  mechanicsWithDailyCount.sort(
    (a, b) => a.todayCount - b.todayCount
  );

  const leastBusy = mechanicsWithDailyCount[0];

  if (leastBusy && leastBusy.todayCount < MAX_DAILY_BOOKINGS) {
    return {
      mechanicId: leastBusy.mechanic._id,
      status: "ASSIGNED",
    };
  }

  // All mechanics at daily capacity
  return {
    mechanicId: null,
    status: "WAITLISTED",
  };
};

module.exports = assignMechanic;      