import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
const baseUrl = rawBaseUrl.replace(/\/$/, "");

export const api = axios.create({
  baseURL: `${baseUrl}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  try {
    const token = window?.localStorage?.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // ignore (e.g. storage disabled)
  }
  return config;
});
