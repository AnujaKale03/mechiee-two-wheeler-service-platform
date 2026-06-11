const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "" },
  durationMins: { type: Number, default: 60 },
});

module.exports = mongoose.model("Service", serviceSchema);