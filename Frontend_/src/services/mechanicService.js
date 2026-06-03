import API from "./api";

export const getMechanics = () =>
  API.get("/mechanics");