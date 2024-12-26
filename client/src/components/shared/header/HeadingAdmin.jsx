import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IconAvatar from "@/components/icons/IconAvatar";
import IconDropdown from "@/components/icons/IconDropdown";
import Logo from "@/components/icons/Logo";
import useAuth from "@/hooks/useAuth";
import IconSignUp from "@/components/icons/IconSignUp";
import axiosInstance from "@/lib/authorizedAxios";
import IconMenu from "@/components/icons/IconMenu";

const HeadingAdmin = ({ isOpen, handleToggleNavbar }) => {
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [data, setData] = useState(null);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleLogout = () => logout();

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(`/candidate/get-profile`);
        setData(result.data.result);
      } catch (error) {
        console.error("Error while fetching job data:", error);
      }
    };
    getData();
  }, []);
  console.log(data);

  return (
    <header className="bg-white shadow-md">
      <div className="container flex justify-between items-center text-[#212F3F] border-b border-b-[#E9EAEC] h-[64px] lg:max-w-[1748px]">
        <div className="flex items-center gap-20">
          <Link to={"/"}>
            <Logo />
          </Link>
          <div
            className="p-1 rounded-md bg-[#ead6fd] hover:opacity-70 cursor-pointer"
            onClick={handleToggleNavbar}
          >
            <IconMenu
              className={`${isOpen ? "" : "rotate-180"} w-6 h-6`}
              color={"#48038C"}
            />
          </div>
        </div>
        <div className="flex justify-between items-center gap-5">
          {user ? (
            <div className="flex items-center">
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex justify-between items-center gap-5 px-5 py-1 rounded-md hover:bg-secondary z-10">
                  <IconAvatar />
                  <IconDropdown className={"w-3 h-3"} />
                </button>
                <div className="absolute after:contents w-full h-4 top-12"></div>
                {isHovered && (
                  <div className="absolute flex flex-col items-center bg-white min-w-[200px] right-0 z-50 shadow-md rounded-md top-[54px]">
                    <ItemDropdown
                      url={"/account.stacky.vn"}
                      icon={
                        <IconSignUp className={"w-6 h-6"} color={"#424242"} />
                      }
                      children={"Đăng xuất"}
                      onClick={handleLogout}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link to={"/account.stacky.vn"}>
              <button className="px-5 py-2 rounded-xl border border-[#E9EAEC] bg-button text-white">
                Đăng nhập / Đăng ký
              </button>
            </Link>
          )}
          {/* <div className="flex items-center divide-x">
            <button className="text-gray-400 px-2 uppercase transition hover:text-primary">
              EN
            </button>
            <button className="font-bold px-2 uppercase transition hover:text-primary">
              VI
            </button>
          </div> */}
        </div>
      </div>
    </header>
  );
};

const ItemDropdown = ({ url, icon, children, onClick = () => {} }) => {
  return (
    <Link
      to={url}
      className="flex items-center p-3 w-full gap-4 h-10 text-[#424242] hover:bg-slate-100 cursor-pointer rounded-md"
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

const ItemNotification = ({ icon, url, children, className }) => {
  return (
    <li
      className={`relative list-none w-12 h-12 rounded-full bg-secondary ${className}`}
    >
      <Link
        to={url}
        className="w-full h-full flex justify-center items-center rounded-full"
      >
        {icon}
      </Link>
      <div className="absolute flex justify-center items-center w-5 h-5 bg-primary rounded-full top-0 -right-1">
        <span className="text-sm text-white">{children}</span>
      </div>
    </li>
  );
};

export default HeadingAdmin;
