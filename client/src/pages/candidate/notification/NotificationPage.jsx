import React from "react";

const NotificationPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center my-5">
      <div className="flex flex-col gap-5 min-w-[800px] max-w-[650px] max-h-[500px] rounded-xl bg-secondary p-5 text-sm">
        <h1 className="text-2xl font-medium text-primary">Thông báo</h1>
        <div className="flex gap-3 items-center">
          <span className="px-3 py-1 rounded-full bg-primary text-white">
            Tất cả
          </span>
          <span className="px-3 py-1 rounded-full bg-primary text-white">
            Chưa đọc
          </span>
        </div>
        <div className="custom-scrollbar overflow-y-auto">
          <div className="mb-5">
            <h3 className="text-lg font-medium text-primary">Mới</h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-1 p-2 rounded-md border hover:border hover:border-primary hover:bg-white cursor-pointer">
                <div className="flex flex-col gap-1 w-[90%]">
                  <p className="line-clamp-2 overflow-hidden text-ellipsis">
                    CV ứng tuyển vị trí Business Analyst (Domain Bank) cho công
                    ty FPT IS, chúng tôi rất vui mừng thông báo bạn đã được chọn
                    vào vòng phỏng vấn. Hãy kiểm tra email để không bỏ lỡ cơ hội
                    này nhé! Hãy kiểm tra email để không bỏ lỡ cơ hội này
                    nhé!Hãy kiểm tra email để không bỏ lỡ cơ hội này nhé!
                  </p>
                  <span>20 giờ</span>
                </div>
                <div className="flex items-center justify-center w-[10%]">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium text-primary">Trước đó</h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-1 p-2 rounded-md border hover:border hover:border-primary hover:bg-white cursor-pointer">
                <div className="flex flex-col gap-1 w-[90%]">
                  <p className="line-clamp-2 overflow-hidden text-ellipsis">
                    CV ứng tuyển vị trí Business Analyst (Domain Bank) cho công
                    ty FPT IS, chúng tôi rất vui mừng thông báo bạn đã được chọn
                    vào vòng phỏng vấn. Hãy kiểm tra email để không bỏ lỡ cơ hội
                    này nhé! Hãy kiểm tra email để không bỏ lỡ cơ hội này
                    nhé!Hãy kiểm tra email để không bỏ lỡ cơ hội này nhé!
                  </p>
                  <span>20 giờ</span>
                </div>
                <div className="flex items-center justify-center w-[10%]">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
