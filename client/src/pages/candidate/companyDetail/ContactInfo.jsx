import IconFacebook from "@/components/icons/IconFacebook";
import IconInstagram from "@/components/icons/IconInstagram";
import IconLocation from "@/components/icons/IconLocation";
import IconYoutube from "@/components/icons/IconYoutube";
import React from "react";

const ContactInfo = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-secondary border border-primary rounded-xl">
        <div className="py-2 rounded-tl-xl rounded-tr-xl text-transparent bg-gradient-to-r from-[#48038C] to-[#e59fff]">
          <h3 className="text-xl ml-5 text-white">Thông tin chung</h3>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div className="">
            <p className="font-medium text-base">Lĩnh vực</p>
            <p className="">
              Information Technology, B2B Services, Technology and Computer
              Sciences
            </p>
          </div>
          <div className="">
            <p className="font-medium text-base">Quy mô công ty</p>
            <p>Hơn 1000</p>
          </div>
        </div>
      </div>
      <div className="bg-secondary border border-primary rounded-xl">
        <div className="py-2 rounded-tl-xl rounded-tr-xl text-transparent bg-gradient-to-r from-[#48038C] to-[#e59fff]">
          <h3 className="text-xl ml-5 text-white">Thông tin liên hệ</h3>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div className="">
            <p className="font-medium text-base">Email</p>
            <p className="">contact@fpt.com</p>
          </div>
          <div className="">
            <p className="font-medium text-base">Website</p>
            <p>https://fpt-is.com/</p>
          </div>
          <div className="">
            <p className="font-medium text-base">Mạng xã hội</p>
            <div className="flex items-center gap-3">
              <IconFacebook></IconFacebook>
              <IconInstagram></IconInstagram>
              <IconYoutube></IconYoutube>
            </div>
          </div>
          <div className="">
            <p className="font-medium text-base">Địa chỉ công ty</p>
            <div className="flex items-center gap-2">
              <div className="">
                <IconLocation
                  className={"w-6 h-6"}
                  color={"#333"}
                ></IconLocation>
              </div>
              <span className="line-clamp-2 overflow-hidden text-ellipsis">
                Đường Sáng Tạo, KCX Tân Thuận, Phường Tân Thuận Đông, Quận 7,
                Thành phố Hồ Chí Minh Thành phố Hồ Chí Minh
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
