
import api from "./axiosInstance";

export const getUserProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const updateUserProfilePic = async (formData: FormData) => {
  const res = await api.post("/users/profile-pic/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};


