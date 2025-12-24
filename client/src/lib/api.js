import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
const baseUrl = rawBaseUrl.replace(/\/$/, "");

export const api = axios.create({
  baseURL: `${baseUrl}/api`,
  withCredentials: true,
});
