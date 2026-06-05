import API from "./api";

export const createBooking = data =>
  API.post("/bookings", data);

export const getBookings = () =>
  API.get("/bookings");

  export const updateBookingStatus = (
   bookingId, 
   status
  ) =>
    API.patch(`/bookings/${bookingId}/status`, { status });