const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerName:  { type: String, required: true },
  bikeModel:     { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  serviceId:     { type: mongoose.Schema.Types.ObjectId, ref: "Service",  required: true },
  mechanicId:    { type: mongoose.Schema.Types.ObjectId, ref: "Mechanic", default: null },
  status: {
    type: String,
    enum: ["ASSIGNED", "WAITLISTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
    default: "ASSIGNED",
  },
  rating:        { type: Number, min: 1, max: 5, default: null },
  ratingComment: { type: String, default: null },
  eta:           { type: String, default: null },
  cancelledAt:   { type: Date,   default: null },
  completedAt:   { type: Date,   default: null },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "AWAITING", "PAID", "FAILED"],  // FIXED: added AWAITING
    default: "PENDING",
  },
  paymentOrderId:        { type: String, default: null },
  paymentId:             { type: String, default: null },
  customerExpoPushToken: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);