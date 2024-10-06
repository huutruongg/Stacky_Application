import axiosInstance from "../lib/authorizedAxios";

// Hàm logout
export const handleLogoutAPI = async () => {
  // TH1: Trường hợp dùng localStorage > Xóa thông tin user khỏi localStorage phía FE
  // localStorage.removeItem("accessToken")
  // localStorage.removeItem("refreshToken")
  localStorage.removeItem("userInfo"); // Ở cả 2 TH đều phải xóa thông tin user khỏi localStorage

  // TH2: Trường hợp dùng HTTP Only Cookie > Gửi request (Gọi API) lên server để xử lý remove Cookies
  return await axiosInstance.delete("/auth/signup/recruiter");
};

// Hàm refresh token
export const refreshTokenAPI = async (refreshToken) => {
  // Đây trường hợp dùng localStorage, lấy refreshToken từ localStorage
  // TH dùng cookie không cần truyền tham số đầu vào
  return await axiosInstance.put("/users/refresh_token", { refreshToken });
};
