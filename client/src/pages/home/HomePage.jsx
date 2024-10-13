import React from "react";
import ImgHome from "@/components/image/imgHome.png";
import SearchJob from "@/components/shared/searchJob/SearchJob";
import JobsInteresting from "./JobsInteresting";
import HotMajor from "./HotMajor";
import HotEmployer from "./HotEmployer";

const HomePage = () => {
  return (
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
  );
};

export default HomePage;
