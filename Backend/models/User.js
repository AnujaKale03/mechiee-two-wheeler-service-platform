const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"],
    },
    role: {
      type: String,
      enum: ["customer", "mechanic", "administrator"],
      required: true,
    },
    name:    { type: String, default: "" },
    email:   { type: String, default: "" },
    address: { type: String, default: "" },
    avatar:  { type: String, default: "" },

    // Mechanic specific
    mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "Mechanic", default: null },

    lastLogin: { type: Date, default: Date.now },
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);