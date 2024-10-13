import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import IconHeart from "@/components/icons/IconHeart";
import IconNotification from "@/components/icons/IconNotification";
import IconAvatar from "@/components/icons/IconAvatar";
import IconDropdown from "@/components/icons/IconDropdown";
import Logo from "@/components/icons/Logo";
import useAuth from "@/hooks/useAuth";
import IconSignUp from "@/components/icons/IconSignUp";

const Heading = () => {
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container flex justify-between items-center text-[#212F3F] border-b border-b-[#E9EAEC] h-[64px] lg:max-w-[1748px]">
        <Link to={"/"}>
          <Logo />
        </Link>
        <div className="flex justify-between items-center gap-10">
          <ItemMain url={"/"}>Trang chủ</ItemMain>
          <ItemMain url={"/company"}>Công ty</ItemMain>
          <ItemMain url={"/profile-cv"}>Hồ sơ & CV</ItemMain>
          <ItemMain url={"/tools"}>Công cụ hỗ trợ</ItemMain>
        </div>
        <div className="flex justify-between items-center gap-5">
          {user ? (
            <div className="flex justify-between items-center ">
              <ItemNotification
                icon={<IconHeart />}
                children={"99"}
                url={"/job-save"}
              />
              <ItemNotification
                icon={<IconNotification />}
                children={"99"}
                className={"mx-5"}
              />
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex justify-between items-center gap-10 px-5 rounded-md hover:bg-secondary z-10">
                  <IconAvatar />
                  <IconDropdown />
                </button>
                <div className="absolute after:contents w-full h-4 top-12"></div>
                {isHovered && (
                  <div className="absolute flex flex-col items-center bg-white min-w-[200px] right-0 z-50 shadow-md rounded-md top-[54px]">
                    <ItemDropdown
                      url={"/"}
                      icon={<IconSignUp />}
                      children={"Thông tin cá nhân"}
                    />
                    <ItemDropdown
                      url={"/account.stacky.vn"}
                      icon={<IconSignUp />}
                      children={"Đăng xuất"}
                      onClick={logout}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link to={"/account.stacky.vn"}>
              <button className="px-5 py-2 rounded-xl border border-[#E9EAEC] bg-button text-white">
                Đăng nhập
              </button>
            </Link>
          )}
          <div className="flex items-center justify-center divide-x">
            <button className="text-gray-400 px-2 uppercase transition-all hover:text-primary">
              EN
            </button>
            <button className="font-bold px-2 uppercase transition-all hover:text-primary">
              VI
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const ItemMain = ({ url, children }) => {
  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        isActive
          ? "font-semibold text-primary"
          : "font-semibold text-text5 hover:text-primary"
      }
    >
      {children}
    </NavLink>
  );
};

const ItemDropdown = ({
  url,
  icon,
  children,
  onClick = () => {},
  className,
}) => {
  return (
    <Link
      to={url}
      className={`flex items-center p-3 w-full gap-4 h-10 text-[#424242] hover:bg-slate-100 cursor-pointer rounded-md ${className}`}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

const ItemNotification = ({
  icon,
  url,
  children,
  className,
  onClick = () => {},
}) => {
  return (
    <li
      className={`relative list-none w-12 h-12 rounded-full bg-secondary ${className}`}
    >
      <Link
        to={url}
        className="w-full h-full flex justify-center items-center rounded-full"
        onClick={onClick}
      >
        {icon}
      </Link>
      <div className="absolute flex justify-center items-center w-5 h-5 bg-primary rounded-full top-0 -right-1">
        <span className="text-sm text-white">{children}</span>
      </div>
    </li>
  );
};

export default Heading;
