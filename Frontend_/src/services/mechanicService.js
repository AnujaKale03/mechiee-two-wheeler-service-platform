import API from "./api";
export const getMechanics   = ()      => API.get("/mechanics");
export const getMyProfile   = ()      => API.get("/mechanics/profile");
export const getMyBookings  = ()      => API.get("/mechanics/my-bookings");
export const savePushToken  = (token) => API.patch("/mechanics/push-token", { token });