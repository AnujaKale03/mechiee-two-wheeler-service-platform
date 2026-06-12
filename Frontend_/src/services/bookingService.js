import API from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper — get current customer name from storage
const getCustomerName = async () => {
  const raw = await AsyncStorage.getItem("customerProfile");
  if (!raw) return null;
  const p = JSON.parse(raw);
  return p.name || null;
};

// ── Customer booking actions ──────────────────────────────
export const createBooking    = (data)                => API.post("/bookings", data);

// Filters by logged-in customer name automatically
export const getBookings      = async () => {
  const name = await getCustomerName();
  return API.get("/bookings", { params: name ? { customerName: name } : {} });
};

export const cancelBooking    = (id)                  => API.patch(`/bookings/${id}/cancel`);
export const rateBooking      = (id, rating, comment) => API.post(`/bookings/${id}/rate`, { rating, comment });
export const verifyPayment    = (id, data)            => API.post(`/bookings/${id}/payment/verify`, data);

// ── Mechanic booking actions ──────────────────────────────
export const getMyBookings       = ()                    => API.get("/mechanics/my-bookings");
export const updateBookingStatus = (id, status, eta)     => API.patch(`/bookings/${id}/status`, { status, eta });
export const updateETA           = (id, eta)             => API.patch(`/bookings/${id}/eta`, { eta });