import axios from "axios";
import { handleLogoutAPI, refreshTokenAPI } from "@/api/index";
import toast from "react-hot-toast";

const logOnDev = (message) => {
  if (import.meta.env.MODE === "development") {
    console.log(message);
  }
};

const onResponse = (response) => {
  const { method, url } = response.config;
  const { status } = response;

  logOnDev(`[${method?.toUpperCase()}] ${url} - ${status}`);
  return response;
};

const onRequest = (config) => {
  const { method, url } = config;

  logOnDev(`[${method?.toUpperCase()}] ${url}`);

  if (method === "get") {
    config.timeout = 1000 * 60 * 10; // Set timeout for GET requests
  }

  return config;
};

let refreshTokenPromise = null;

const onErrorResponse = async (error) => {
  if (axios.isAxiosError(error)) {
    const { message } = error;
    const { method, url } = error.config;

    logOnDev(`[${method?.toUpperCase()}] ${url} - ${message}`);

    if (error.response?.status === 401) {
      await handleLogoutAPI();
      location.href = "/account.stacky.vn";
      return;
    }

    const originalRequest = error.config;

    if (error.response?.status === 410 && originalRequest) {
      if (!refreshTokenPromise) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          await handleLogoutAPI();
          location.href = "/account.stacky.vn";
          return;
        }

        refreshTokenPromise = refreshTokenAPI(refreshToken)
          .then((res) => {
            // Kiểm tra và lưu accessToken nếu có
            if (res.data && res.data.accessToken) {
              // Cập nhật accessToken vào localStorage hoặc thực hiện bất kỳ thao tác nào cần thiết
              console.log(res.data.accessToken);
            }
          })
          .catch((_error) => {
            handleLogoutAPI().then(() => {
              location.href = "/account.stacky.vn";
            });
            return Promise.reject(_error);
          })
          .finally(() => {
            refreshTokenPromise = null; // Reset promise after completion
          });
      }

      return refreshTokenPromise.then(() => {
        return axiosInstance(originalRequest);
      });
    }

    // if (error.response?.status !== 410) {
    //   toast.error(
    //     `🚨 [API] | Error ${error.response?.data?.message || message}`
    //   );
    // }
  } else {
    const errorMessage = error?.message || "Unknown error";
    logOnDev(`🚨 [API] | Error ${errorMessage}`);
  }

  return Promise.reject(error);
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
  timeout: 1000 * 60 * 10,
});

// Configure Axios interceptors
axiosInstance.interceptors.request.use(onRequest, onErrorResponse);
axiosInstance.interceptors.response.use(onResponse, onErrorResponse);

export default axiosInstance;
