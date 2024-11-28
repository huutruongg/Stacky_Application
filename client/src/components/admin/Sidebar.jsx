import React, { useState } from "react"; 
import { Link } from "react-router-dom";
import DashboardIcon from "../icons/adminIcons/Dashboard.png";
import ArticleIcon from "../icons/adminIcons/artical.png";
import CompanyIcon from "../icons/adminIcons/company.png";
import UserIcon from "../icons/adminIcons/user.png";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Sidebar = () => {
    const [selectedItem, setSelectedItem] = useState("Dashboard");

    const menuItems = [
        { name: "Dashboard", icon: DashboardIcon, path: "/admin/dashboard" },
        { name: "Quản lý bài viết", icon: ArticleIcon, path: "/admin/posts" },
        { name: "Quản lý công ty", icon: CompanyIcon, path: "/admin/companies" },
        { name: "Quản lý User", icon: UserIcon, path: "/admin/users" },
    ];

    const handleClick = (itemName) => {
        setSelectedItem(itemName);
    };

    const styles = {
        sidebar: {
            height: "100vh", // Chiều cao toàn màn hình
            width: "250px", // Chiều rộng sidebar
            backgroundColor: "#fff", // Màu nền sidebar
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)", // Đổ bóng
            padding: "0", // Loại bỏ padding mặc định
        },
        menuItem: {
            display: "flex",
            alignItems: "center", // Đặt icon và chữ trên cùng một hàng
            justifyContent: "flex-start", // Canh trái
            width: "250px", // Độ rộng mục menu
            height: "65px", // Chiều cao mục menu
            padding: "10px 20px", // Khoảng cách bên trong
            borderRadius: "8px", // Bo góc
            transition: "background-color 0.3s ease, color 0.3s ease",
            textDecoration: "none", // Xóa gạch chân
            color: "#333", // Màu chữ mặc định
            cursor: "pointer",
            fontWeight: "500",
        },
        activeItem: {
            backgroundColor: "#f0f2f5", // Màu nền trạng thái active
            color: "#48038C", // Màu chữ trạng thái active
            fontWeight: "bold", // In đậm chữ khi active
        },
        icon: {
            width: "26px", // Kích thước icon
            height: "26px",
            marginRight: "15px", // Khoảng cách giữa icon và chữ
            filter: "grayscale(1)", // Icon màu xám mặc định
            transition: "filter 0.3s ease, color 0.3s ease",
        },
        activeIcon: {
            filter: "none", // Bỏ màu xám khi active
            color: "#48038C", // Đồng bộ màu icon với chữ
        },
    };

    return (
        <div style={styles.sidebar}>
            <ul className="list-unstyled m-0">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className={`d-flex align-items-center ${
                            selectedItem === item.name ? "active" : ""
                        }`}
                        style={{
                            ...styles.menuItem,
                            ...(selectedItem === item.name ? styles.activeItem : {}),
                        }}
                        onClick={() => handleClick(item.name)}
                    >
                        <Link to={item.path} style={{ ...styles.menuItem, color: "inherit" }}>
                            <img
                                src={item.icon}
                                alt={`${item.name} icon`}
                                style={{
                                    ...styles.icon,
                                    ...(selectedItem === item.name ? styles.activeIcon : {}),
                                }}
                            />
                            <span>{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
