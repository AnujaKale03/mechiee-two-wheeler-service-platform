import axios from "axios";

const API = axios.create({
  //baseURL: "http://localhost:5000/api",
  baseURL: "http://10.0.2.2:5000/api"
});

export default API;