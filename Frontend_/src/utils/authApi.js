import API from "../services/api";

/**
 * Send OTP to phone number
 * @param {string} phone  - 10-digit Indian number (no +91)
 * @param {string} role   - 'customer' | 'mechanic' | 'administrator'
 */
export async function sendOtp(phone, role) {
  const res = await API.post("/auth/send-otp", { phone, role });
  return res.data;
}

/**
 * Verify OTP and get back JWT token + user info
 * @param {string} phone
 * @param {string} otp   - 4 or 6 digit code from SMS
 * @param {string} role
 */
export async function verifyOtp(phone, otp, role) {
  const res = await API.post("/auth/verify-otp", { phone, otp, role });
  return res.data; // { token, user, message }
}

/**
 * Fetch the current logged-in user profile
 */
export async function getMe() {
  const res = await API.get("/auth/me");
  return res.data;
}