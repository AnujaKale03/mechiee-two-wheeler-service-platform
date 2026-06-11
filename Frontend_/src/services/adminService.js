import API from "./api";
export const getAnalytics  = () => API.get("/admin/analytics");
export const getCustomers  = () => API.get("/admin/customers");
export const getWaitlisted = () => API.get("/admin/waitlisted");