import React from "react";

const ViewCompany = ({ companyData }) => {
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
            <span>
              FPT Information System (FPT IS) Information System (FPT IS)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium min-w-24">Mã số thuế:</span>
            <span>0101248141</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium min-w-40">Địa Chỉ Trụ Sở Chính:</span>
            <span>Tòa nhà FPT, số 17 Duy Tân, Cầu Giấy, Hà Nội, Việt Nam</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-5 py-5">
        <div className="flex items-center gap-2">
          <span className="font-medium">Website:</span>
          <span>https://fpt.com.vn</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Tên Người Liên Hệ Chính:</span>
          <span>Nguyễn Văn A, Giám đốc Tuyển dụng.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Email Liên Hệ:</span>
          <span>nguyenvana@fpt.com.vn</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Số Điện Thoại Liên Hệ:</span>
          <span>+84 24 7300 7300.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Số Lượng Bài Tuyển Dụng Đã Đăng:</span>
          <span>25 bài đăng tuyển dụng.</span>
        </div>
      </div>
    </div>
  );
};

export default ViewCompany;
