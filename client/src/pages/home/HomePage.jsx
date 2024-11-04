import React from "react";
import ImgHome from "@/components/image/imgHome.png";
import SearchJob from "@/components/shared/searchJob/SearchJob";
import JobsInteresting from "./JobsInteresting";
import HotMajor from "./HotMajor";
import HotEmployer from "./HotEmployer";
import useAuth from "@/hooks/useAuth";
import Buttonchild from "@/components/button/Buttonchild";

const HomePage = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <>
      {!user || user.role === "CANDIDATE" ? (
        <div>
          <div className="relative flex justify-center">
            <img src={ImgHome} alt="" className="w-full h-full object-fill" />
            <div className="absolute flex top-20">
              <SearchJob></SearchJob>
            </div>
          </div>
          <div className="page-container flex flex-col my-10">
            <JobsInteresting></JobsInteresting>
            <HotMajor></HotMajor>
            <HotEmployer></HotEmployer>
          </div>
        </div>
      ) : (
        <div className="w-screen h-[300px]">
          <div className="flex h-full flex-col items-center justify-center gap-5">
            <p>
              Tính năng này không khả dụng đối với tài khoản nhà tuyển dụng. Vui
              lòng thử lại với tài khoản khác.
            </p>
            <Buttonchild kind="primary" className="px-3 py-1">
              <a href="/company-profile">Về trang chủ</a>
            </Buttonchild>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
