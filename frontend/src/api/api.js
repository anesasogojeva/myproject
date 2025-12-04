import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
});

// If you need to include the JWT token in headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token"); // or wherever you store it
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
