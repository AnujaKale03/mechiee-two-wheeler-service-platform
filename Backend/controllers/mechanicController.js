const Mechanic = require("../models/Mechanic");
const Booking  = require("../models/Booking");
const jwt      = require("jsonwebtoken");

const MAX_DAILY = 3;

const getDailyCount = async (mechanicId) => {
  const start = new Date(); start.setHours(0,0,0,0);
  const end   = new Date(); end.setHours(23,59,59,999);
  return Booking.countDocuments({
    mechanicId,
    status: { $in: ["ASSIGNED", "IN_PROGRESS"] },
    createdAt: { $gte: start, $lte: end },
  });
};

// POST /mechanics/login — PIN login
const login = async (req, res) => {
  try {
    const { name, pin } = req.body;
    if (!name || !pin) return res.status(400).json({ message: "Name and PIN are required" });

    const mechanic = await Mechanic.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (!mechanic) return res.status(404).json({ message: "Mechanic not found" });
    if (mechanic.pin !== pin) return res.status(401).json({ message: "Incorrect PIN" });

    const token = jwt.sign(
      { id: mechanic._id, name: mechanic.name, role: "mechanic" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      mechanic: {
        _id: mechanic._id,
        name: mechanic.name,
        phone: mechanic.phone,
        avgRating: mechanic.avgRating,
        totalRatings: mechanic.totalRatings,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /mechanics — list with today's count + availability
const getMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.find({ isActive: true });
    const result = await Promise.all(mechanics.map(async (m) => {
      const todayBookingCount = await getDailyCount(m._id);
      return {
        _id: m._id, name: m.name, phone: m.phone,
        avgRating: m.avgRating, totalRatings: m.totalRatings,
        todayBookingCount, maxCapacity: MAX_DAILY,
        isAvailable: todayBookingCount < MAX_DAILY,
      };
    }));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /mechanics/:id/profile — mechanic's own profile + stats
const getProfile = async (req, res) => {
  try {
    const mechanicId = req.mechanic.id;
    const mechanic   = await Mechanic.findById(mechanicId);
    if (!mechanic) return res.status(404).json({ message: "Mechanic not found" });

    const todayCount = await getDailyCount(mechanicId);

    const start = new Date(); start.setHours(0,0,0,0);
    const todayBookings = await Booking.find({
      mechanicId,
      createdAt: { $gte: start },
    }).populate("serviceId");

    const totalCompleted = await Booking.countDocuments({ mechanicId, status: "COMPLETED" });

    res.status(200).json({
      _id: mechanic._id, name: mechanic.name, phone: mechanic.phone,
      avgRating: mechanic.avgRating, totalRatings: mechanic.totalRatings,
      todayBookingCount: todayCount, maxCapacity: MAX_DAILY,
      totalCompleted, todayBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /mechanics/:id/push-token — save expo push token
const savePushToken = async (req, res) => {
  try {
    const { token } = req.body;
    await Mechanic.findByIdAndUpdate(req.mechanic.id, { expoPushToken: token });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /mechanics/:id/bookings — mechanic's own bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ mechanicId: req.mechanic.id })
      .populate("serviceId")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login, getMechanics, getProfile, savePushToken, getMyBookings };