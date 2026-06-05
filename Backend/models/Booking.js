const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    bikeModel: {
      type: String,
      required: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    mechanicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      default: null,
    },

    status: {
      type: String,
      enum: ["ASSIGNED", "WAITLISTED", "IN_PROGRESS", "COMPLETED"],
      default: "ASSIGNED",
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Booking", bookingSchema);