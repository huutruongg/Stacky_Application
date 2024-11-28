import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import logo from "../icons/adminIcons/Logo.png";
import profileIcon from "../icons/adminIcons/Profile.png";

const Header = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const styles = {
        header: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 40px",
            backgroundColor: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            position: "relative",
        },
        left: {
            display: "flex",
            alignItems: "center",
            gap: "56px", // Khoảng cách giữa logo và hamburger icon
            position: "relative", // Quan trọng để dropdown menu căn chỉnh dựa vào cha
        },
        hamburgerIcon: {
            width: "24px",
            height: "24px",
            cursor: "pointer",
        },
        logo: {
            width: "100px",
            height: "30px",
        },
        dropdownMenu: {
            position: "absolute",
            top: "44px", // Hiển thị ngay dưới hamburger icon
            left: "152px", // Căn trái theo hamburger icon
            backgroundColor: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
            zIndex: 1000,
            width: "150px", // Độ rộng của menu
        },
        dropdownItem: {
            padding: "10px",
            fontSize: "16px",
            color: "#333",
            cursor: "pointer",
            borderBottom: "1px solid #e0e0e0",
        },
        dropdownItemLast: {
            padding: "10px",
            fontSize: "16px",
            color: "#333",
            cursor: "pointer",
        },
        searchBox: {
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f0f2f5",
            padding: "5px 10px",
            borderRadius: "20px",
            width: "300px",
        },
        searchInput: {
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            flex: "1",
            fontSize: "14px",
            color: "#999",
        },
        searchIcon: {
            width: "20px",
            height: "20px",
            marginRight: "5px",
        },
        right: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            color: "#48038C",
        },
        profileIcon: {
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "#e0e0e0",
        },
    };

    return (
        <header style={styles.header}>
            {/* Logo and Hamburger Menu */}
            <div style={styles.left}>
                {/* Logo */}
                <img src={logo} alt="Logo" style={styles.logo} />
                {/* Hamburger Icon */}
                <img
                    src="https://cdn-icons-png.flaticon.com/512/1828/1828859.png"
                    alt="Menu"
                    style={styles.hamburgerIcon}
                    onClick={toggleMenu}
                />
                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div style={styles.dropdownMenu}>
                        <div style={styles.dropdownItem}>Trang chủ</div>
                        <div style={styles.dropdownItemLast}>Đăng xuất</div>
                    </div>
                )}
            </div>

            {/* Search Bar */}
            <div style={styles.searchBox}>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/54/54481.png"
                    alt="Search"
                    style={styles.searchIcon}
                />
                <input type="text" placeholder="Search..." style={styles.searchInput} />
            </div>

            {/* Profile */}
            <div style={styles.right}>
                <img src={profileIcon} alt="Profile" style={styles.profileIcon} />
                <span>Nguyễn Công Hữu</span>
            </div>
        </header>
    );
};

export default Header