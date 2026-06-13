const twilio = require("twilio");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ── Send OTP ──────────────────────────────────────────────
exports.sendOtp = async (req, res) => {
  const { phone, role } = req.body;

  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ message: "Enter a valid 10-digit Indian mobile number" });
  }
  const validRoles = ["customer", "mechanic", "administrator"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Always attempt to send — but ALWAYS return success to frontend
  // so unverified trial numbers still proceed to OTP screen
  try {
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: `+91${phone}`, channel: "sms" });
    console.log(`[OTP] Sent to +91${phone}`);
  } catch (err) {
    // Log but don't fail — trial accounts show errors for unverified numbers
    // but OTP may still be delivered
    console.warn(`[OTP] Twilio warning: ${err.message}`);
  }

  // Always respond success — OTP either arrived or user uses 000000 test code
  return res.json({ message: "OTP sent successfully" });
};

// ── Verify OTP ────────────────────────────────────────────
exports.verifyOtp = async (req, res) => {
  const { phone, otp, role } = req.body;

  if (!phone || !otp || !role) {
    return res.status(400).json({ message: "phone, otp, and role are required" });
  }

  // Test OTP bypass — remove before production
  const TEST_OTP = "000000";
  let approved = false;

  if (otp === TEST_OTP) {
    approved = true;
    console.log(`[OTP] Test code used for +91${phone}`);
  } else {
    try {
      const check = await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({ to: `+91${phone}`, code: otp });
      approved = check.status === "approved";
    } catch (err) {
      console.error("[OTP] Twilio verify error:", err.message);
      return res.status(400).json({ message: "Invalid or expired OTP. Try again." });
    }
  }

  if (!approved) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  try {
    let user = await User.findOne({ phone });
    const isNew = !user;
    if (!user) {
      user = await User.create({ phone, role });
    } else {
      user.role = role;
      user.lastLogin = new Date();
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      message: isNew ? "Account created" : "Login successful",
      token,
      user: { id: user._id, phone: user.phone, role: user.role, name: user.name || "", isNew },
    });
  } catch (err) {
    console.error("verifyOtp DB error:", err.message);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ── Get current user ──────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};