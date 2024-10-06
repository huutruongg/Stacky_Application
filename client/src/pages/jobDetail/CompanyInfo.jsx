import React from "react";
import imgCompany from "@/components/image/imgCompany.png";
import IconUSerAcount from "@/components/icons/IconUSerAcount";
import IconField from "@/components/icons/IconField";
import IconLocation from "@/components/icons/IconLocation";
import IconSeeCompany from "@/components/icons/IconSeeCompany";

const CompanyInfo = () => {
  return (
    <div className="bg-secondary rounded-xl p-5 text-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="min-w-[80px] min-h-[80px]">
          <a href="">
            <img src={imgCompany} alt="" />
          </a>
        </div>
        <a
          href=""
          className="self-stretch text-text1 font-semibold text-[16px] leading-6 tracking-[-0.16px] h-[70px] w-full overflow-hidden text-ellipsis"
        >
          CÔNG TY TNHH XÂY DỰNG NAM CÔNG THÀNH CÔNG TY TNHH XÂY DỰNG NAM CÔNG
          THÀNH CÔNG TY TNHH XÂY DỰNG NAM CÔNG THÀNH
        </a>
      </div>
      <div className="flex flex-col gap-4">
        <ItemInfo
          icon={<IconUSerAcount color={"#7F878F"}></IconUSerAcount>}
          title={"Quy Mô:"}
          children={"25 - 99 Nhân Viên"}
        ></ItemInfo>
        <ItemInfo
          icon={<IconField></IconField>}
          title={"Lĩnh vực:"}
          children={"Công nghệ thông tin"}
        ></ItemInfo>
        <ItemInfo
          icon={<IconLocation color={"#7F878F"}></IconLocation>}
          title={"Địa điểm:"}
          children={`Số D34, tổ 16, KP 5, Phường Tân Hiệp , Thành phố Biên Hòa , Đồng
              Nai , Viet Nam`}
          className={"line-clamp-2 h-[44px] overflow-hidden text-ellipsis"}
        ></ItemInfo>
      </div>
      <div className="flex items-center justify-center gap-3 mt-5">
        <a
          href=""
          className="text-primary font-semibold tracking-[0.175px] leading-[22px] hover:decoration-primary hover:underline"
        >
          Xem trang công ty
        </a>
        <IconSeeCompany></IconSeeCompany>
      </div>
    </div>
  );
};

const ItemInfo = ({ icon, className, title, children }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-white p-3 rounded-full">{icon}</div>
      <div className="flex items-start">
        <div className="self-stretch flex items-center text-[#7f878f] font-normal tracking-[0.14px] leading-[22px] gap-2 w-[88px]">
          {title}
        </div>
        <div
          className={`text-text1 font-medium tracking-[0.14px] leading-[22px] w-[calc(100%-50px)] ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
