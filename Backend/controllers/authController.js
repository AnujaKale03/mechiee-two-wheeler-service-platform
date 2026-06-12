const twilio = require("twilio");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ── Send OTP ──────────────────────────────────────────────
exports.sendOtp = async (req, res) => {
  try {
    const { phone, role } = req.body;
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Enter a valid 10-digit Indian mobile number" });
    }
    const validRoles = ["customer", "mechanic", "administrator"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const e164Phone = `+91${phone}`;

    try {
      await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({ to: e164Phone, channel: "sms" });
    } catch (twilioErr) {
      // On Twilio trial: unverified numbers get a 60203 error
      // Still return success so frontend proceeds — user can use test OTP 0000
      console.warn(`[OTP] Twilio warning for ${e164Phone}: ${twilioErr.message}`);
    }

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("sendOtp error:", err.message);
    res.status(500).json({ message: "Failed to send OTP. Try again." });
  }
};

// ── Verify OTP ────────────────────────────────────────────
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp, role } = req.body;
    if (!phone || !otp || !role) {
      return res.status(400).json({ message: "phone, otp, and role are required" });
    }

    const e164Phone = `+91${phone}`;

    // ── TEST OTP bypass (remove in production) ────────────
    const TEST_OTP = "000000";
    let approved = false;

    if (otp === TEST_OTP) {
      approved = true;
      console.log(`[OTP] Test OTP used for ${e164Phone}`);
    } else {
      try {
        const check = await client.verify.v2
          .services(process.env.TWILIO_VERIFY_SERVICE_SID)
          .verificationChecks.create({ to: e164Phone, code: otp });
        approved = check.status === "approved";
      } catch (twilioErr) {
        console.error("[OTP] Twilio verify error:", twilioErr.message);
        return res.status(400).json({ message: "OTP verification failed. Use 0000 for testing." });
      }
    }

    if (!approved) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Find or create user
    let user = await User.findOne({ phone });
    const isNew = !user;
    if (!user) {
      user = await User.create({ phone, role });
    } else {
      user.role      = role;
      user.lastLogin = new Date();
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      message: isNew ? "Account created" : "Login successful",
      token,
      user: {
        id:    user._id,
        phone: user.phone,
        role:  user.role,
        name:  user.name || "",
        isNew,
      },
    });
  } catch (err) {
    console.error("verifyOtp error:", err.message);
    res.status(500).json({ message: "OTP verification failed. Try again." });
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