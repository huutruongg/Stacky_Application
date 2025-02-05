import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import IconHeart from "@/components/icons/IconHeart";
import IconNotification from "@/components/icons/IconNotification";
import IconAvatar from "@/components/icons/IconAvatar";
import IconDropdown from "@/components/icons/IconDropdown";
import Logo from "@/components/icons/Logo";
import useAuth from "@/hooks/useAuth";
import IconSignUp from "@/components/icons/IconSignUp";
import { useJobSave } from "@/components/context/JobSaveProvider";
import IconUpload from "@/components/icons/IconUpload";
import IconProfile from "@/components/icons/IconProfile";
import axiosInstance from "@/lib/authorizedAxios";

const Heading = () => {
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const { jobSaveData, loading } = useJobSave();
  const [data, setData] = useState(null);
  const [dataNotification, setDataNotification] = useState(null);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleLogout = () => logout();

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(`/candidate/get-profile`);
        const resultNotification = await axiosInstance.get(
          `/notification/unread`
        );
        setData(result.data.result);
        setDataNotification(resultNotification.data.count);
      } catch (error) {
        console.error("Error while fetching job data:", error);
      }
    };
    getData();
  }, []);

  const handleReadNotification = async () => {
    try {
      await axiosInstance.put(`/notification/mark-all-as-read`);
      const resultNotification = await axiosInstance.get(
        `/notification/unread`
      );
      setDataNotification(resultNotification.data.count);
    } catch (error) {
      console.error("Error while fetching job data:", error);
    }
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
          {/* <ItemMain url={"/tools"}>Công cụ hỗ trợ</ItemMain> */}
        </div>
        <div className="flex justify-between items-center gap-5">
          {user ? (
            <div className="flex items-center">
              {jobSaveData ? (
                <div className="flex items-center">
                  <ItemNotification
                    icon={<IconHeart className="w-6 h-6"></IconHeart>}
                    children={jobSaveData ? jobSaveData.length : "0"}
                    url={"/job-save"}
                  />
                  <ItemNotification
                    icon={<IconNotification />}
                    children={dataNotification ? dataNotification : "0"}
                    className={"mx-5"}
                    url={"/notification"}
                    onClick={handleReadNotification}
                  />
                </div>
              ) : (
                ""
              )}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex justify-between items-center gap-10 px-5 py-1 rounded-md hover:bg-secondary z-10">
                  {data?.avatarUrl ? (
                    <img
                      src={data.avatarUrl}
                      alt="avatar"
                      className="overflow-hidden object-cover min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] border rounded-md"
                    />
                  ) : (
                    <IconAvatar />
                  )}
                  <span className="text-sm">{data?.fullName}</span>
                  <IconDropdown className={"w-3 h-3"} />
                </button>
                <div className="absolute after:contents w-full h-4 top-12"></div>
                {isHovered && (
                  <div className="absolute flex flex-col items-center bg-white min-w-[200px] right-0 z-50 shadow-md rounded-md top-[54px]">
                    <ItemDropdown
                      url={"/uploaded-cv"}
                      icon={
                        <IconUpload className={"w-6 h-6"} color={"#424242"} />
                      }
                      children={"CV đã đăng tuyển"}
                    />
                    <ItemDropdown
                      url={`/profile`}
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

const ItemNotification = ({ icon, url, children, className, onClick }) => {
  return (
    <li
      className={`relative list-none w-12 h-12 rounded-full bg-secondary ${className}`}
      onClick={onClick}
    >
      <Link
        to={url}
        className="w-full h-full flex justify-center items-center rounded-full"
      >
        {icon}
      </Link>
      {children > 0 && (
        <div className="absolute flex justify-center items-center w-5 h-5 bg-primary rounded-full top-0 -right-1">
          <span className="text-sm text-white">{children}</span>
        </div>
      )}
    </li>
  );
};

export default Heading;
