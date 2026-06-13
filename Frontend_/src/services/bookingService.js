import API from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getCustomerName = async () => {
  // Check all possible storage locations in priority order
  const direct = await AsyncStorage.getItem("customerName");
  if (direct && direct.trim()) return direct.trim();

  const raw = await AsyncStorage.getItem("customerProfile");
  if (raw) {
    const p = JSON.parse(raw);
    if (p.name && p.name.trim()) return p.name.trim();
  }
  return null;
};

// ── Customer booking actions ──────────────────────────────
export const createBooking = (data) => API.post("/bookings", data);

export const getBookings = async () => {
  const name = await getCustomerName();
  console.log("[getBookings] name:", name);
  if (!name) return { data: [] };
  return API.get("/bookings", { params: { customerName: name } });
};

export const cancelBooking    = (id)                  => API.patch(`/bookings/${id}/cancel`);
export const rateBooking      = (id, rating, comment) => API.post(`/bookings/${id}/rate`, { rating, comment });
export const verifyPayment    = (id, data)            => API.post(`/bookings/${id}/payment/verify`, data);

// ── Mechanic booking actions ──────────────────────────────
export const getMyBookings       = ()                => API.get("/mechanics/my-bookings");
export const updateBookingStatus = (id, status, eta) => API.patch(`/bookings/${id}/status`, { status, eta });
export const updateETA           = (id, eta)         => API.patch(`/bookings/${id}/eta`, { eta });