const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookings,
  updateBookingStatus,
  cancelBooking,
  rateBooking,
  verifyBookingPayment,
  updateETA,
} = require("../controllers/bookingController");

// Create booking
router.post("/", createBooking);

// Get all bookings
router.get("/", getBookings);

// Update booking status
router.patch("/:id/status", updateBookingStatus);

// Cancel booking
router.patch("/:id/cancel", cancelBooking);

// Rate booking
router.post("/:id/rate", rateBooking);

// Verify payment
router.post("/:id/payment/verify", verifyBookingPayment);

// Update ETA
router.patch("/:id/eta", updateETA);

module.exports = router;