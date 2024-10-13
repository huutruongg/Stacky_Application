import React, { useEffect, useCallback, useState } from "react";
import IconGoogle from "@/components/icons/IconGoogle";
import IconGithub from "@/components/icons/IconGithub";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/lib/authorizedAxios";

const FormSignInCandidate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = useCallback(() => {
    window.location.href = "http://localhost:4080/auth/google/callback";
  }, []);

  const handleGithubLogin = useCallback(() => {
    window.location.href = "http://localhost:4080/auth/github/callback";
  }, []);

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  const handleTokenRetrieval = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/auth/get-access-token", {
        withCredentials: true,
      });
      const { accessToken } = response.data;

      const decodedAccessToken = decodeJWT(accessToken);
      const { userId, email: userEmail, role: roleName } = decodedAccessToken;

      const userInfo = { userId, email: userEmail, role: roleName };
      login(userInfo, accessToken);

      navigate("/"); // Điều hướng đến trang chủ sau khi đăng nhập thành công
    } catch (error) {
      console.error("Lỗi lấy token:", error);
      alert("Lỗi khi lấy token. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [login, navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenReceived = urlParams.get("token");

    if (tokenReceived) {
      handleTokenRetrieval();
    }
  }, [location.search, handleTokenRetrieval]);

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-10">
      <button
        className="flex items-center justify-center gap-3 w-full h-14 font-medium border border-text1 rounded-lg"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        <IconGoogle />
        <span className="text-text2">Đăng nhập với Google</span>
      </button>

      <button
        className="flex items-center justify-center gap-3 w-full h-14 font-medium border rounded-lg bg-[#424242]"
        onClick={handleGithubLogin}
        disabled={loading}
      >
        <IconGithub />
        <span className="text-white">Đăng nhập với Github</span>
      </button>
    </div>
  );
};

export default FormSignInCandidate;
