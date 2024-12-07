import React from "react";
import ImgHome from "@/components/image/imgHome.png";
import SearchJob from "@/components/shared/searchJob/SearchJob";
import JobsInteresting from "./JobsInteresting";
import HotMajor from "./HotMajor";
import HotEmployer from "./HotEmployer";
import useAuth from "@/hooks/useAuth";
import Buttonchild from "@/components/button/Buttonchild";
import { io } from "socket.io-client";

const HomePage = () => {
  const { user } = useAuth();
  const socket = io("http://localhost:5050", {
    transports: ["websocket"], // Ưu tiên giao thức WebSocket
    withCredentials: true, // Nếu server bật credentials (CORS)
  });

  socket.on("connect", () => {
    console.log("Connected to server, socket ID:", socket.id);

    // Assume getLoggedInUserId() fetches the user ID from a token or session
    const userId = "670fbcbda4cdb849c025d715";
    if (userId) {
      socket.emit("register", userId); // Send the user's ID to the server
    }
  });

  // Nhận thông báo từ server
  socket.on("notification", (data) => {
    console.log("New notification:", data);
  });

  // Xử lý ngắt kết nối
  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
  return (
    <>
      {!user || user.role === "CANDIDATE" || user.role === "ADMIN" ? (
        <div>
          <div className="relative flex justify-center">
            <img src={ImgHome} alt="" className="w-full h-full object-fill" />
            <div className="absolute flex top-20">
              <SearchJob></SearchJob>
            </div>
          </div>
          <div className="page-container flex flex-col my-10">
            <JobsInteresting></JobsInteresting>
            <HotMajor></HotMajor>
            <HotEmployer></HotEmployer>
          </div>
        </div>
      ) : (
        <div className="w-screen h-[300px]">
          <div className="flex h-full flex-col items-center justify-center gap-5">
            <p>
              Tính năng này không khả dụng đối với tài khoản nhà tuyển dụng. Vui
              lòng thử lại với tài khoản khác.
            </p>
            <Buttonchild kind="primary" className="px-3 py-1">
              <a href="/company-profile">Về trang chủ</a>
            </Buttonchild>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
