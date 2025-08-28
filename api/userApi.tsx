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

// Update user profile with the current user ID and profile data
export const updateUserProfile = async (userId: number, profileData: { username: string; fullname: string }) => {
  const res = await api.put(`/users/${userId}/profile-update`, profileData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};