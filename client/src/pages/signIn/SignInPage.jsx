import React, { useEffect, useState } from "react";
import BgSignIn from "@/components/image/bgSignIn.jpg";
import FormSignInCandidate from "./FormSignInCandidate";
import FormSignInEmployer from "./FormSignInEmployer";
import FormRegisterEmployer from "./FormRegisterEmployer";

const SignInPage = () => {
  const [activeTab, setActiveTab] = useState("candidate");

  return (
    <div>
      <div className="page-container grid grid-cols-12 justify-center items-center gap-10 my-10">
        <div className="grid col-start-1 col-end-7">
          <div className="flex flex-col justify-center items-center gap-3 mb-10">
            <h1 className="w-fit text-4xl font-semibold h-12 text-transparent bg-clip-text bg-gradient-to-r from-[#48038C] to-[#00F0FF]">
              Đăng ký / Đăng nhập
            </h1>
            <span className="text-lg">
              Liên kết tài khoản của bạn để tiếp tục sử dụng dịch vụ Stacky
            </span>
          </div>

          <div className="bg-secondary rounded-lg">
            <div className="flex items-center justify-center px-7">
              {/* Tab cho Ứng viên và Nhà tuyển dụng */}
              <div
                className={`flex items-center justify-center w-full py-4 text-lg cursor-pointer ${
                  activeTab === "candidate"
                    ? "border-b-4 border-primary font-medium"
                    : "hover:text-primary"
                }`}
                onClick={() => setActiveTab("candidate")}
              >
                <span>Ứng viên</span>
              </div>
              <div
                className={`flex items-center justify-center w-full py-4 text-lg cursor-pointer ${
                  activeTab === "employer"
                    ? "border-b-4 border-primary font-medium "
                    : "hover:text-primary"
                }`}
                onClick={() => setActiveTab("employer")}
              >
                <span>Nhà tuyển dụng</span>
              </div>
            </div>
            {activeTab === "candidate" ? (
              <FormSignInCandidate></FormSignInCandidate>
            ) : (
              <FormSignInEmployer></FormSignInEmployer>
            )}
          </div>
        </div>
        <div className="grid col-start-7 col-end-13">
          {activeTab === "candidate" ? (
            <img className="" src={BgSignIn} alt="" />
          ) : (
            <FormRegisterEmployer></FormRegisterEmployer>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
