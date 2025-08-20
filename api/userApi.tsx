
import api from "./axiosInstance";

export const getUserProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};
