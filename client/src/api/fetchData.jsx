import axios from "axios";

const API_URL = "http://localhost:4080"; // Địa chỉ API của bạn

// Thêm tham số type vào hàm
export const fetchData = async (type) => {
  try {
    const response = await axios.get(`${API_URL}/${type}`); // Sử dụng type trong endpoint
    // console.log(response.data.result);

    return response.data.result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
  }
};
