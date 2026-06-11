import API from "./api";

// ── Customer booking actions ──────────────────────────────
export const createBooking       = (data)                => API.post("/bookings", data);
export const getBookings         = ()                    => API.get("/bookings");
export const cancelBooking       = (id)                  => API.patch(`/bookings/${id}/cancel`);
export const rateBooking         = (id, rating, comment) => API.post(`/bookings/${id}/rate`, { rating, comment });
export const verifyPayment       = (id, data)            => API.post(`/bookings/${id}/payment/verify`, data);

// ── Mechanic booking actions ──────────────────────────────
export const getMyBookings       = ()                    => API.get("/mechanics/my-bookings");
export const updateBookingStatus = (id, status, eta)     => API.patch(`/bookings/${id}/status`, { status, eta });
export const updateETA           = (id, eta)             => API.patch(`/bookings/${id}/eta`, { eta });