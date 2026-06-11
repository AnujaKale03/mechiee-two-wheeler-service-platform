const Booking  = require("../models/Booking");
const Mechanic = require("../models/Mechanic");
const Service  = require("../models/Service");
const jwt      = require("jsonwebtoken");

// POST /admin/login
const login = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "Password required" });
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jwt.sign(
      { role: "administrator", name: "Admin" },  // FIXED: was "admin"
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /admin/analytics
const getAnalytics = async (req, res) => {
  try {
    const start = new Date(); start.setHours(0,0,0,0);
    const end   = new Date(); end.setHours(23,59,59,999);

    const [
      totalBookings, todayBookings, completed, waitlisted,
      cancelled, inProgress, totalRevenue, mechanics,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      Booking.countDocuments({ status: "COMPLETED" }),
      Booking.countDocuments({ status: "WAITLISTED" }),
      Booking.countDocuments({ status: "CANCELLED" }),
      Booking.countDocuments({ status: "IN_PROGRESS" }),
      Booking.aggregate([
        { $match: { paymentStatus: "PAID" } },
        { $lookup: { from: "services", localField: "serviceId", foreignField: "_id", as: "service" } },
        { $unwind: "$service" },
        { $group: { _id: null, total: { $sum: "$service.price" } } },
      ]),
      Mechanic.find({ isActive: true }),
    ]);

    res.status(200).json({
      totalBookings, todayBookings, completed, waitlisted,
      cancelled, inProgress,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalMechanics: mechanics.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /admin/customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Booking.aggregate([
      {
        $group: {
          _id: "$customerName",
          vehicleNumbers: { $addToSet: "$vehicleNumber" },
          bikeModels:     { $addToSet: "$bikeModel" },
          totalBookings:  { $sum: 1 },
          lastBooking:    { $max: "$createdAt" },
          statuses:       { $push: "$status" },
        },
      },
      { $sort: { lastBooking: -1 } },
    ]);
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /admin/waitlisted
const getWaitlisted = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "WAITLISTED" })
      .populate("serviceId")
      .sort({ createdAt: 1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login, getAnalytics, getCustomers, getWaitlisted };