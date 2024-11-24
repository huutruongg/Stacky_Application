import React from "react";
import imgCoverImage from "@/components/image/imgCoverImage.png";
import imgCompany from "@/components/image/imgCompany.png";
import IconGlobe from "@/components/icons/IconGlobe";
import IconBuilding from "@/components/icons/IconBuilding";
import SearchJobPosition from "./SearchJobPosition";
import ContactInfo from "./ContactInfo";
import CompanyInfo from "./CompanyInfo";

const CompanyDetailPage = () => {
  return (
    <div className="page-container">
      <div className="overflow-hidden min-h-[358px] w-full rounded-xl text-transparent bg-gradient-to-r from-[#48038C] to-[#e59fff]">
        <div className="overflow-hidden h-[224px]">
          <img src={imgCoverImage} alt="" />
        </div>
        <div className="relative">
          <div className="absolute top-[-90px] left-[40px] flex items-center justify-center w-[180px] h-[180px] overflow-hidden rounded-full border-[4.5px] border-white bg-white">
            <img
              src={imgCompany}
              alt=""
              className="h-[80%] w-[80%] object-contain"
            />
          </div>
        </div>
        <div className="relative flex items-center gap-[32px] my-[20px] pl-[252px] pr-[40px]">
          <div className="block flex-[1_1_auto] max-w-full w-0 text-white">
            <h1 className="text-[20px] font-semibold leading-[28px] mb-[16px] mt-0 max-w-full overflow-hidden line-clamp-2">
              Công Ty TNHH LG CNS VIỆT NAM
            </h1>
            <span className="flex items-center flex-wrap max-w-full gap-x-[20px] gap-y-[16px] mb-1">
              Best Companies To Work For In Asia 2023
            </span>
            <div className="flex items-center gap-8 text-white text-[16px] mr-[16px]">
              <div className="flex gap-2 items-center">
                <IconGlobe className={"w-6 h-6"} />
                <a href="https://fptshop.com.vn/">https://fptshop.com.vn/</a>
              </div>
              <div className="flex gap-2 items-center">
                <IconBuilding className={"w-5 h-5"} color={"#fff"} />
                <span>100-499 nhân viên</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5 my-10">
        <div className="grid col-start-1 col-end-9 gap-5">
          <CompanyInfo></CompanyInfo>
          <SearchJobPosition></SearchJobPosition>
        </div>
        <div className="grid col-start-9 col-end-13 gap-5 text-sm">
          <ContactInfo></ContactInfo>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
