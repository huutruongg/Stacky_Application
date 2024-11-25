import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import IconCompanyFrofile from "@/components/icons/IconCompanyFrofile";
import IconBag from "@/components/icons/IconBag";
import IconInfoApply from "@/components/icons/IconInfoApply";
import IconSearchCandidates from "@/components/icons/IconSearchCandidates";
import IconManager from "@/components/icons/IconManager";
import Button from "@/components/button/Button";
import Buttonchild from "@/components/button/Buttonchild";

const NavbarEmployer = () => {
  const navItems = [
    {
      icon: IconCompanyFrofile,
      label: "Hồ sơ công ty",
      path: "/company-profile",
    },
    { icon: IconBag, label: "Quản lý công việc", path: "/job-management" },
    { icon: IconInfoApply, label: "Quản lý ứng viên", path: "/apply-info" },
    {
      icon: IconSearchCandidates,
      label: "Tìm kiếm ứng viên",
      path: "/search-candidates",
    },
    { icon: IconManager, label: "Ví điện tử", path: "/payment" },
  ];

  return (
    <div className="sticky top-[208px] left-0 h-[calc(100vh-208px)] overflow-y-auto grid col-start-1 col-end-4 border-2 border-primary bg-secondary rounded-t-xl custom-scrollbar">
      <div className="flex flex-col gap-5 w-full p-5 mb-5">
        <div className="flex flex-col gap-2">
          {navItems.map((item, index) => (
            <ItemNavbar
              key={index}
              Icon={item.icon}
              label={item.label}
              path={item.path}
            />
          ))}
        </div>
        <div className="flex justify-center items-center">
          <NavLink className="w-full rounded-lg" to={"/job-post"}>
            <Button
              kind="primary"
              className="w-full text-center bg-primary text-white hover:opacity-80"
            >
              Đăng việc làm
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

const ItemNavbar = ({ label, Icon, path }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex gap-5 items-center rounded-md hover:text-primary  custom-scrollbar"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavLink
        to={path}
        className={({ isActive }) =>
          isActive
            ? "rounded-md h-12 w-full p-3 bg-[#ead6fd]"
            : "rounded-md h-12 w-full p-3"
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
              className="w-6"
              color={isActive || isHovered ? "#48038C" : "#000000"}
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

export default NavbarEmployer;
