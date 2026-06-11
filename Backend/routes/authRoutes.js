const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.post("/send-otp",   sendOtp);
router.post("/verify-otp", verifyOtp);

// Protected
router.get("/me", protect, getMe);

module.exports = router;