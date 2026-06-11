import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendOtp as apiSendOtp, verifyOtp as apiVerifyOtp } from "../utils/authApi";
import API from "./api";

const TOKEN_KEY   = "authToken";
const PROFILE_KEY = "customerProfile";

// ── OTP flow (customer / phone auth) ─────────────────────
export async function sendOtp(phone, role) {
  return apiSendOtp(phone, role);
}

export async function verifyOtpAndLogin(phone, otp, role) {
  const data = await apiVerifyOtp(phone, otp, role);
  await AsyncStorage.setItem(TOKEN_KEY, data.token);
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(data.user));
  return data;
}

// ── Mechanic login (name + PIN) ───────────────────────────
export async function mechanicLogin(name, pin) {
  return API.post("/mechanics/login", { name, pin });
}

// ── Admin login (password) ────────────────────────────────
export async function adminLogin(password) {
  return API.post("/admin/login", { password });
}

// ── Session helpers ───────────────────────────────────────
export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getProfile() {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function isLoggedIn() {
  const token = await getToken();
  return !!token;
}

export async function logout() {
  await AsyncStorage.multiRemove([TOKEN_KEY, PROFILE_KEY]);
}