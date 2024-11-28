import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from '../icons/adminIcons/Dashboard.png';
import ArticleIcon from '../icons/adminIcons/artical.png';
import CompanyIcon from '../icons/adminIcons/company.png';
import UserIcon from '../icons/adminIcons/user.png';
import '../../assets/css/Sidebar.css';


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
  
    return (
      <div className="sidebar">
        <ul className="menu">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => handleClick(item.name)}
              className={`menu-item ${selectedItem === item.name ? "active" : ""}`}
            >
              <Link to={item.path} style={{ textDecoration: "none", color: "inherit" }}>
                <img
                  src={item.icon}
                  alt={`${item.name} icon`}
                  className={`icon ${selectedItem === item.name ? "active-icon" : ""}`}
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