import React from "react";

const ViewAccount = () => {
  return (
    <div className="py-5 px-10">
      <div className="flex items-center justify-around gap-10">
        <img
          src="https://dyl347hiwv3ct.cloudfront.net/app/uploads/2023/09/img-favicon.png"
          alt=""
          className="w-36 h-36 rounded-full border border-gray-200"
        />
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">Họ và tên:</span>
            <span>Nguyễn Văn Trần Anh</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Email:</span>
            <span>nguyenvana@email.com</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Ngày đăng ký:</span>
            <span>01/01/2024</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-5 py-5">
        <div className="flex items-center gap-2">
          <span className="font-medium">Nguồn đăng nhập:</span>
          <span>Google - nguyenvana@email.com</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Trạng thái:</span>
          <span>Đang hoạt động</span>
        </div>
      </div>
    </div>
  );
};

export default ViewAccount;
