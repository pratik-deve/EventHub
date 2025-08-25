import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true, // Important to send cookies
});

api.interceptors.request.use((config) => config);

export default api;
