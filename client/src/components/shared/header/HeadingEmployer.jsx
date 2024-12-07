import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import IconAvatar from "@/components/icons/IconAvatar";
import IconDropdown from "@/components/icons/IconDropdown";
import Logo from "@/components/icons/Logo";
import useAuth from "@/hooks/useAuth";
import IconSignUp from "@/components/icons/IconSignUp";
import IconVietNamese from "@/components/icons/IconVietNamese";
import Button from "@/components/button/Button";
import IconEnglish from "@/components/icons/IconEnglish";
import IconProfile from "@/components/icons/IconProfile";
import axiosInstance from "@/lib/authorizedAxios";

const HeadingEmployer = () => {
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [data, setData] = useState(null);
  const [language, setLanguage] = useState(null);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleLogout = () => logout();

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(
          `/recruiter/get-company-info/${user.userId}`
        );
        setData(result.data.result);
      } catch (error) {
        console.error("Error while fetching job data:", error);
      }
    };
    getData();
  }, []);
  // console.log(data);
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container flex justify-between items-center text-[#212F3F] border-b border-b-[#E9EAEC] h-[64px] lg:max-w-[1748px]">
        <Link to={"/"}>
          <Logo />
        </Link>
        <div className="flex justify-between items-center gap-8">
          <NavLink className="w-full rounded-lg" to={"/job-post"}>
            <Button
              kind="primary"
              className="w-full text-center px-3 bg-primary text-white hover:opacity-80"
            >
              Đăng việc làm
            </Button>
          </NavLink>
          <button>
            {language ? (
              <IconVietNamese></IconVietNamese>
            ) : (
              <IconEnglish></IconEnglish>
            )}
          </button>
          {user ? (
            <div className="flex w-full items-center bg-secondary rounded-md">
              <div
                className="relative w-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex w-full justify-between items-center gap-5 px-5 py-1 rounded-md hover:bg-secondary z-10">
                  {data?.orgImage ? (
                    <img
                      src={data?.orgImage}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <IconAvatar />
                  )}
                  <span className="text-sm w-52 line-clamp-1">
                    {data?.orgName}
                  </span>
                  <IconDropdown className={"w-3 h-3"} />
                </div>
                <div className="absolute after:contents w-full h-4 top-12"></div>
                {isHovered && (
                  <div className="absolute flex flex-col items-center bg-white min-w-[200px] right-0 z-50 shadow-md rounded-md top-[54px]">
                    <ItemDropdown
                      url={`/recruiter/reset-password/${user.userId}`}
                      icon={
                        <IconProfile className={"w-6 h-6"} color={"#424242"} />
                      }
                      children={"Thông tin cá nhân"}
                    />
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
                Đăng nhập
              </button>
            </Link>
          )}
          <div className="flex items-center">
            <button
              className={`w-10 uppercase transition hover:text-primary ${
                !language ? "font-bold text-primary" : "text-gray-400"
              }`}
              onClick={() => setLanguage(false)}
            >
              EN
            </button>
            <span className="w-px h-5 bg-gray-400"></span>
            <button
              className={`w-10 uppercase transition hover:text-primary ${
                language ? "font-bold text-primary" : "text-gray-400"
              }`}
              onClick={() => setLanguage(true)}
            >
              VI
            </button>
          </div>
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

export default HeadingEmployer;
