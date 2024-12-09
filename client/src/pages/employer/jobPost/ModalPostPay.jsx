import FormatCurrency from "@/components/format/FormatCurrency";
import React from "react";

const ModalPostPay = ({ jobData }) => {
  return (
    <div className="flex flex-col gap-2 px-20 py-5">
      <div className="flex items-center gap-2">
        <span className="font-medium min-w-[180px] max-w-[180px]">
          Tên bài viết tuyển dụng:
        </span>
        <span>{jobData?.jobTitle}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium min-w-[180px] max-w-[180px]">
          Phí đăng bài:{" "}
        </span>
        <span>{FormatCurrency(100000)}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-medium min-w-[180px] max-w-[180px]">
          Mô tả ngắn:{" "}
        </span>
        <span>{jobData?.jobDescription}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium min-w-[180px] max-w-[180px]">
          Phương thức thanh toán:{" "}
        </span>
        <span className="text-primary">Ví thanh toán Stacky</span>
      </div>
    </div>
  );
};

export default ModalPostPay;
