import IconFacebook from "@/components/icons/IconFacebook";
import IconInstagram from "@/components/icons/IconInstagram";
import IconLocation from "@/components/icons/IconLocation";
import IconYoutube from "@/components/icons/IconYoutube";
import React from "react";

const ContactInfo = ({ companyData }) => {
  console.log(companyData);

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-secondary border border-primary rounded-xl">
        <div className="py-2 rounded-tl-xl rounded-tr-xl text-transparent bg-gradient-to-r from-[#48038C] to-[#e59fff]">
          <h3 className="text-xl ml-5 text-white">Thông tin chung</h3>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div className="">
            <p className="font-medium text-base">Lĩnh vực</p>
            <p className="">{companyData?.orgField}</p>
          </div>
          <div className="">
            <p className="font-medium text-base">Quy mô công ty</p>
            <p>{companyData?.orgScale} Nhân viên</p>
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
            <p className="">{companyData?.orgEmail}</p>
          </div>
          <div className="">
            <p className="font-medium text-base">Website</p>
            <p>
              {companyData?.orgLinkedinLink ||
                companyData?.orgFacebookLink ||
                companyData?.orgYoutubeLink}
            </p>
          </div>
          <div className="">
            <p className="font-medium text-base mb-1">Mạng xã hội</p>
            <div className="flex items-center gap-3">
              <a href={companyData?.orgFacebookLink}>
                <IconFacebook
                  className={"w-8 h-8"}
                  color={"#48038C"}
                ></IconFacebook>
              </a>
              <a href={companyData?.orgLinkedinLink}>
                <IconInstagram
                  className={"w-8 h-8"}
                  color={"#48038C"}
                ></IconInstagram>
              </a>
              <a href={companyData?.orgYoutubeLink}>
                <IconYoutube
                  className={"w-8 h-8"}
                  color={"#48038C"}
                ></IconYoutube>
              </a>
            </div>
          </div>
          <div className="">
            <p className="font-medium text-base mb-1">Địa chỉ công ty</p>
            <div className="flex items-center gap-2">
              <div className="">
                <IconLocation
                  className={"w-6 h-6"}
                  color={"#333"}
                ></IconLocation>
              </div>
              <span className="line-clamp-2 overflow-hidden text-ellipsis">
                {companyData?.orgAddress}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
