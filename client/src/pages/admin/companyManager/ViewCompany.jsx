import axiosInstance from "@/lib/authorizedAxios";
import React, { useEffect, useState } from "react";

const ViewCompany = ({ companyData }) => {
  const [companyDetailData, setCompanyDetailData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await axiosInstance.get(
          `/admin/get-detail-company/${companyData?.userId}`
        );
        setCompanyDetailData(result.data.company);
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log(companyDetailData);

  return (
    <div className="p-5">
      <div className="flex items-center justify-around gap-5">
        <img
          src="https://dyl347hiwv3ct.cloudfront.net/app/uploads/2023/09/img-favicon.png"
          alt=""
          className="w-36 h-36 rounded-full border border-gray-200"
        />
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <span className="font-medium min-w-24">Tên công ty:</span>
            <span>{companyDetailData?.orgName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium min-w-24">Mã số thuế:</span>
            <span>{companyDetailData?.orgTaxNumber}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium min-w-40">Địa Chỉ Trụ Sở Chính:</span>
            <span>{companyDetailData?.orgAddress}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-5 py-5">
        <div className="flex items-center gap-2">
          <span className="font-medium">Website:</span>
          <span>{companyDetailData?.orgWebsiteUrl}</span>
        </div>
        <div className="flex items-center gap-2">
          
          <span className="font-medium">Email Liên Hệ:</span>
          <span>{companyDetailData?.orgEmail}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Số Điện Thoại Liên Hệ:</span>
          <span>{companyDetailData?.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Số Lượng Bài Tuyển Dụng Đã Đăng:</span>
          <span>{companyDetailData?.jobPostCount} bài đăng tuyển dụng.</span>
        </div>
      </div>
    </div>
  );
};

export default ViewCompany;
