import FormatDate from "@/components/format/FormatDate";
import React from "react";
import imgCompany from "@/components/image/imgCompany.png";

const ViewAccount = ({ candidateData }) => {
  return (
    <div className="py-5 px-10">
      <div className="flex items-center justify-around gap-10">
        <img
          src={candidateData?.avatarUrl || imgCompany}
          alt=""
          className="overflow-hidden object-cover min-w-[144px] min-h-[144px] max-w-[144px] max-h-[144px] border rounded-md"
        />
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">Họ và tên:</span>
            <span>{candidateData?.fullName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Email:</span>
            <span>{candidateData?.publicEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Ngày đăng ký:</span>
            <span>{FormatDate.formatDate(candidateData?.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-5 py-5">
        <div className="flex items-center gap-2">
          <span className="font-medium">Nguồn đăng nhập:</span>
          <span>{candidateData?.loginWith}</span>
        </div>
      </div>
    </div>
  );
};

export default ViewAccount;
