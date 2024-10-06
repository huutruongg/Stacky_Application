import TitleField from "@/components/titleField/TitleField";
import IconBag from "@/components/icons/IconBag";
import IconGender from "@/components/icons/IconGender";
import IconHourglass from "@/components/icons/IconHourglass";
import IconRank from "@/components/icons/IconRank";
import IconUSerAcount from "@/components/icons/IconUSerAcount";
import React from "react";

const GeneralInfo = () => {
  return (
    <div className="bg-secondary rounded-xl p-5 text-sm">
      <TitleField children={"Thông tin chung"}></TitleField>
      <div className="flex flex-col gap-5 mx-5 mt-5">
        <ItemInfo
          icon={<IconRank></IconRank>}
          title={"Cấp bậc"}
          children={"Nhân viên"}
        ></ItemInfo>
        <ItemInfo
          icon={<IconHourglass></IconHourglass>}
          title={"Kinh nghiệm"}
          children={"1 - 2 năm kinh nghiệm"}
        ></ItemInfo>
        <ItemInfo
          icon={<IconUSerAcount color={"#FFF"}></IconUSerAcount>}
          title={"Số lượng tuyển"}
          children={"2 Người"}
        ></ItemInfo>
        <ItemInfo
          icon={<IconBag></IconBag>}
          title={"Loại công việc"}
          children={"Nhân viên toàn thời gian"}
        ></ItemInfo>
        <ItemInfo
          icon={<IconGender></IconGender>}
          title={"Giới tính"}
          children={"Nam/Nữ"}
        ></ItemInfo>
      </div>
    </div>
  );
};

const ItemInfo = ({ icon, title, children }) => {
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

export default GeneralInfo;
