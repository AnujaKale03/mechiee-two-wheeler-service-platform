const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  activeBookingCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Mechanic", mechanicSchema);