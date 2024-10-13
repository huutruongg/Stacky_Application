import React from "react";
import IconFacebook from "@/components/icons/IconFacebook";
import IconYoutube from "@/components/icons/IconYoutube";
import IconInstagram from "@/components/icons/IconInstagram";
import Logo from "@/components/icons/Logo";

const Footer = () => {
  return (
    <footer className=" w-full text-text1 p-10 bg-secondary">
      <div className="page-container">
        <Logo className={"mb-5"}></Logo>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-medium">Liên Hệ</span>
            <span>Hotline: +(123) 456-7890</span>
            <span>Mail: stacky@gmail.com</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-medium">Ứng Viên</span>
            <span>Quản lý CV của bạn</span>
            <span>Công ty</span>
            <span>Tìm việc</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-medium">Khu Vực</span>
            <span>Hà Nội</span>
            <span>Đà Nẵng</span>
            <span>Hồ Chí Minh</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-medium">Nhà Tuyển Dụng</span>
            <span>Đăng tuyển dụng</span>
            <span>Đăng ký nhà tuyển dụng</span>
            <span>Tìm hồ sơ</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg ">Kết nối với Stacky</span>
            <div className="flex">
              <a href="">
                <IconFacebook></IconFacebook>
              </a>
              <a href="">
                <IconYoutube></IconYoutube>
              </a>
              <a href="">
                <IconInstagram></IconInstagram>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
