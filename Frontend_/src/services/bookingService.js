import API from "./api";

export const createBooking = (data) =>
  API.post("/bookings", data);

export const getBookings = () =>
  API.get("/bookings");