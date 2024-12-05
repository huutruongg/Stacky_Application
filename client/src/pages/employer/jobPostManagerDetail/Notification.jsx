import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("This is a test notification");
  

  useEffect(() => {
    // Kết nối với server WebSocket
    const socket = io(import.meta.env.VITE_API_URL);

    // Đăng ký userId khi kết nối
    socket.emit("register", userId);

    // Lắng nghe thông báo từ server
    socket.on("notification", (notification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    // Cleanup khi component unmount
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // Hàm gửi yêu cầu tạo thông báo đến backend
  const createNotification = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/notification/create-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            userIds: [userId], // Danh sách userIds nhận thông báo
          }),
        }
      );

      if (response.ok) {
        console.log("Notification created successfully");
      } else {
        console.error("Failed to create notification");
      }
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  // Gửi thông báo khi nhấn nút
  const handleSendNotification = () => {
    createNotification();
  };

  return (
    <div>
      <h1>Realtime Notifications</h1>
      <button onClick={handleSendNotification}>Send Notification</button>

      <div id="notifications">
        <h3>Notifications:</h3>
        {notifications.map((notification, index) => (
          <div key={index}>{notification}</div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
