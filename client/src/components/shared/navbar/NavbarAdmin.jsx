import IconBag from "@/components/icons/IconBag";
import IconDashboard from "@/components/icons/IconDashboard";
import IconManagerPost from "@/components/icons/IconManagerPost";
import IconAccount from "@/components/icons/IconAccount";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const NavbarAdmin = ({ isOpen }) => {
  return (
    <div className="w-full h-full py-10 bg-white border-r border-gray-200">
      <div className="w-full">
        <ItemNavbar
          label="Bảng điều khiển"
          Icon={IconDashboard}
          path="/admin/dashboard"
          isOpen={isOpen}
        />
        <ItemNavbar
          label="Quản lý bài viết"
          Icon={IconManagerPost}
          path="/admin/post-management"
          isOpen={isOpen}
        />
        <ItemNavbar
          label="Quản lý công ty"
          Icon={IconBag}
          path="/admin/company-management"
          isOpen={isOpen}
        />
        <ItemNavbar
          label="Quản lý ứng viên"
          Icon={IconAccount}
          path="/admin/account-management"
          isOpen={isOpen}
        />
      </div>
    </div>
  );
};

const ItemNavbar = ({ label, Icon, path, isOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex w-full gap-5 items-center hover:text-primary hover:bg-secondary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavLink
        to={path}
        className={({ isActive }) =>
          isActive ? "w-full p-3 bg-[#ead6fd]" : "w-full p-3"
        }
      >
        {({ isActive }) => (
          <div
            className={
              isOpen
                ? isActive
                  ? "flex gap-5 w-full h-full items-center font-semibold text-primary"
                  : " flex gap-5 w-full h-full items-center"
                : isActive
                ? "flex gap-5 w-full h-full items-center justify-center font-semibold text-primary"
                : " flex gap-5 w-full h-full items-center justify-center"
            }
          >
            {isOpen ? (
              <>
                <Icon
                  className="w-6 h-6"
                  color={isActive || isHovered ? "#48038C" : "#000"}
                />
                <span
                  className={`${
                    isOpen
                      ? isActive
                        ? "font-semibold text-primary block"
                        : ""
                      : isActive
                      ? "font-semibold text-primary hidden"
                      : ""
                  }`}
                >
                  {label}
                </span>
              </>
            ) : (
              <Icon
                className="w-6 h-6"
                color={isActive || isHovered ? "#48038C" : "#000"}
              />
            )}
          </div>
        )}
      </NavLink>
    </div>
  );
};

export default NavbarAdmin;
