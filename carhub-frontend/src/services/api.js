import axios from "axios";

const API = axios.create({
  baseURL: "https://project-carhub-main.onrender.com/api",
});

export default API;
