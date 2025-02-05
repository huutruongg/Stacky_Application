import React, { useEffect, useCallback, useState } from "react";
import IconGoogle from "@/components/icons/IconGoogle";
import IconGithub from "@/components/icons/IconGithub";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/lib/authorizedAxios";
import { decodeJWT } from "@/utils/jwt";

const FormSignInCandidate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = useCallback(() => {
    window.location.href = "http://localhost:5050/auth/google/login";
  }, []);

  const handleGithubLogin = useCallback(() => {
    window.location.href = "http://localhost:5050/auth/github/login";
  }, []);

  const handleTokenRetrieval = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/auth/get-access-token", {
        withCredentials: true,
      });
      const accessToken = response.data.accessToken;
      console.log(response.data.accessToken);

      const decodedAccessToken = decodeJWT(accessToken);
      const { userId, email: userEmail, role: roleName } = decodedAccessToken;
      console.log(decodedAccessToken);

      const userInfo = { userId, email: userEmail, role: roleName };
      login(userInfo, accessToken);

      navigate("/"); // Điều hướng đến trang chủ sau khi đăng nhập thành công
    } catch (error) {
      console.error("Lỗi lấy token:", error);
      alert("Lỗi khi lấy token. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
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
        disabled={isLoading}
      >
        <IconGoogle />
        <span className="text-text2">Đăng nhập với Google</span>
      </button>

      <button
        className="flex items-center justify-center gap-3 w-full h-14 font-medium border rounded-lg bg-[#424242]"
        onClick={handleGithubLogin}
        disabled={isLoading}
      >
        <IconGithub className={"w-6 h-6"} color={"#fff"} />
        <span className="text-white">Đăng nhập với Github</span>
      </button>
    </div>
  );
};

export default FormSignInCandidate;
