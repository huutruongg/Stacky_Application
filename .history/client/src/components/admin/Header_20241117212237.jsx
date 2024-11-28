import React from "react";
import logo from "../icons/adminIcons/Logo.png"; // Đường dẫn đến file logo
import profileIcon from "../icons/adminIcons/Profile.png"; // Đường dẫn đến icon profile

const Header = () => {
    const styles = {
        header: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 40px",
            backgroundColor: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        },
        left: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
        },
        logo: {
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: "bold",
            fontSize: "18px",
            color: "#48038C",
        },
        menuIcon: {
            width: "24px",
            height: "24px",
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
            {/* Logo and Menu */}
            <div style={styles.left}>
            
                <div style={styles.logo}>
                    <img src={logo} alt="Logo" style={{ width: "100px", height: "30px" }} />
                </div>
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

export default Header;
