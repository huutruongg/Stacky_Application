import IconBag from "@/components/icons/IconBag";
import IconDashboard from "@/components/icons/IconDashboard";
import IconManagerPost from "@/components/icons/IconManagerPost";
import IconAccount from "@/components/icons/IconAccount";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const NavbarAdmin = () => {
  return (
    <div className="w-full h-screen p-5 bg-white border-r border-gray-200">
      <div className="w-full">
        <ItemNavbar
          label="Dashboard"
          Icon={IconDashboard}
          path="/admin/dashboard"
        />
        <ItemNavbar
          label="Quản lý bài viết"
          Icon={IconManagerPost}
          path="/admin/job-management"
        />
        <ItemNavbar
          label="Quản lý công việc"
          Icon={IconBag}
          path="/admin/job-management"
        />
        <ItemNavbar
          label="Quản lý tài khoản"
          Icon={IconAccount}
          path="/admin/user-management"
        />
      </div>
    </div>
  );
};

const ItemNavbar = ({ label, Icon, path }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="flex w-full gap-5 items-center rounded-md hover:text-primary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavLink
        to={path}
        className={({ isActive }) =>
          isActive
            ? "w-full rounded-md p-3 bg-[#ead6fd]"
            : "w-full rounded-md p-3"
        }
      >
        {({ isActive }) => (
          <div
            className={
              isActive
                ? "flex gap-5 w-full h-full items-center font-semibold text-primary"
                : " flex gap-5 w-full h-full items-center"
            }
          >
            <Icon
              className="w-6 h-6"
              color={isActive || isHovered ? "#48038C" : "#000"}
            />
            <span className={isActive ? "font-semibold text-primary" : ""}>
              {label}
            </span>
          </div>
        )}
      </NavLink>
    </div>
  );
};

export default NavbarAdmin;
