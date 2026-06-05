const Mechanic = require("../models/Mechanic");
const Booking = require("../models/Booking");

const MAX_DAILY_BOOKINGS = 3;

const getMechanics = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const mechanics = await Mechanic.find();

    const mechanicsWithCount = await Promise.all(
      mechanics.map(async (mechanic) => {
        const todayBookingCount = await Booking.countDocuments({
          mechanicId: mechanic._id,
          status: { $in: ["ASSIGNED", "IN_PROGRESS"] },
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        });

        return {
          _id: mechanic._id,
          name: mechanic.name,
          todayBookingCount,
          maxCapacity: MAX_DAILY_BOOKINGS,
          isAvailable: todayBookingCount < MAX_DAILY_BOOKINGS,
        };
      })
    );

    res.status(200).json(mechanicsWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMechanics };