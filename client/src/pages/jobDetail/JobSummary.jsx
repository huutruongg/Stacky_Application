import React from "react";
import IconPrice from "@/components/icons/IconPrice";
import IconTimer from "@/components/icons/IconTimer";
import IconLocation from "@/components/icons/IconLocation";
import IconHourglass from "@/components/icons/IconHourglass";
import Button from "@/components/button/Button";
import IconSend from "@/components/icons/IconSend";
import IconHeart from "@/components/icons/IconHeart";

const JobSummary = () => {
  return (
    <div className="bg-secondary p-8 rounded-xl">
      <h2 className="font-semibold text-2xl mb-7">Front-end developer</h2>
      <div className="flex items-center justify-between mb-5">
        <ItemInfoJob
          icon={<IconPrice></IconPrice>}
          title={"Mức lương"}
          children={"Thoả Thuận"}
        ></ItemInfoJob>
        <ItemInfoJob
          icon={<IconLocation color={"#FFFF"}></IconLocation>}
          title={"Địa điểm"}
          children={"Hà Nội"}
        ></ItemInfoJob>
        <ItemInfoJob
          icon={<IconHourglass></IconHourglass>}
          title={"Kinh nghiệm"}
          children={"1 - 2 Năm"}
        ></ItemInfoJob>
      </div>
      <div className="flex items-center w-fit text-text2 p-2 rounded-xl bg-[#EFF0F3] gap-2 mb-5">
        <IconTimer></IconTimer>
        <span>Hạn nộp hồ sơ: 20/09/2024</span>
      </div>
      <div className="flex justify-center items-center gap-10">
        <Button kind="primary" className="gap-3 px-16 w-full">
          <IconSend></IconSend>
          <span className="font-semibold">ỨNG TUYỂN NGAY</span>
        </Button>
        <Button className="gap-3 px-10 border-2 border-[#48038C]">
          <IconHeart></IconHeart>
          <span className="font-semibold text-primary">LƯU</span>
        </Button>
      </div>
    </div>
  );
};

const ItemInfoJob = ({ icon, title, children }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="p-3 rounded-full bg-primary">{icon}</div>
      <div className="flex flex-col font-medium">
        <span className="text-text3">{title}</span>
        <span>{children}</span>
      </div>
    </div>
  );
};

export default JobSummary;
