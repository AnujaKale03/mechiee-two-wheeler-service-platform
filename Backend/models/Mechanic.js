const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pin: { type: String, required: true },         // 4-digit PIN (stored as string)
  phone: { type: String, default: "" },
  expoPushToken: { type: String, default: null }, // for push notifications
  avgRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Mechanic", mechanicSchema);