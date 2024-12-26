import React, { useEffect, useState } from "react";
import imgCoverImage from "@/components/image/imgCoverImage.png";
import imgCompany from "@/components/image/imgCompany.png";
import IconGlobe from "@/components/icons/IconGlobe";
import IconBuilding from "@/components/icons/IconBuilding";
import SearchJobPosition from "./SearchJobPosition";
import ContactInfo from "./ContactInfo";
import CompanyInfo from "./CompanyInfo";
import { useParams } from "react-router-dom";
import axiosInstance from "@/lib/authorizedAxios";

const CompanyDetailPage = () => {
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(
          `/recruiter/get-company-info/${companyId}`
        );
        setCompanyData(result.data.result);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);
  console.log(companyData);

  return (
    <div className="page-container">
      <div className="overflow-hidden min-h-[358px] w-full rounded-xl text-transparent bg-gradient-to-r from-[#48038C] to-[#e59fff]">
        <div className="overflow-hidden h-[224px]">
          <img
            src={companyData?.orgCoverImage || imgCoverImage}
            alt=""
            className="object-cover min-w-[100%] min-h-[100%] max-w-[100%] max-h-[100%]"
          />
        </div>
        <div className="relative">
          <div className="absolute top-[-90px] left-[40px] flex items-center justify-center w-[180px] h-[180px] overflow-hidden rounded-full border-[4.5px] border-primary bg-white">
            <img
              src={companyData?.orgImage || imgCompany}
              alt=""
              className="object-cover min-w-[100%] min-h-[100%] max-w-[100%] max-h-[100%]"
            />
          </div>
        </div>
        <div className="relative flex items-center gap-[32px] my-[20px] pl-[252px] pr-[40px]">
          <div className="block flex-[1_1_auto] max-w-full w-0 text-white">
            <h1 className="text-[20px] font-semibold leading-[28px] mb-[16px] mt-0 max-w-full overflow-hidden line-clamp-2">
              {companyData?.orgName}
            </h1>
            <span className="flex items-center flex-wrap max-w-full gap-x-[20px] gap-y-[16px] mb-1">
              {companyData?.orgField === "technology"
                ? "Công Nghệ Thông Tin"
                : companyData?.orgField}
            </span>
            <div className="flex items-center gap-8 text-white text-[16px] mr-[16px]">
              <div className="flex gap-2 items-center">
                <IconGlobe className={"w-6 h-6"} />
                <a
                  href={
                    companyData?.orgLinkedinLink ||
                    companyData?.orgFacebookLink ||
                    companyData?.orgYoutubeLink
                  }
                >
                  {companyData?.orgLinkedinLink ||
                    companyData?.orgFacebookLink ||
                    companyData?.orgYoutubeLink}
                </a>
              </div>
              <div className="flex gap-2 items-center">
                <IconBuilding className={"w-5 h-5"} color={"#fff"} />
                <span>{companyData?.orgScale} Nhân viên</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5 my-10">
        <div className="grid col-start-1 col-end-9 gap-5">
          <CompanyInfo companyData={companyData}></CompanyInfo>
          <SearchJobPosition></SearchJobPosition>
        </div>
        <div className="grid col-start-9 col-end-13 gap-5 text-sm">
          <ContactInfo companyData={companyData}></ContactInfo>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
