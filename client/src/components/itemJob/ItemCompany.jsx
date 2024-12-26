import React from "react";
import imgCompany from "@/components/image/imgCompany.png";
import imgBackgroundOrg from "@/components/image/imgBackgroundOrg.jpg";
import { NavLink } from "react-router-dom";

const ItemCompany = ({ item }) => {
  // console.log(item);
  return (
    <NavLink
      to={`/company/${item.userId}`}
      className="overflow-hidden bg-secondary rounded-lg h-auto cursor-pointer hover:bg-white hover:shadow-[0_10px_30px_rgba(91,6,170,0.2)] hover:border-primary border"
    >
      <img
        src={item.orgCoverImage || imgBackgroundOrg}
        alt=""
        className="object-fill w-full h-28 rounded-t-lg border-b"
      />
      <div className="relative">
        <div className="absolute top-[-35px] left-[20px] flex items-center justify-center w-[70px] h-[70px] overflow-hidden bg-white border rounded-lg">
          <img
            src={item.orgImage || imgCompany}
            alt=""
            className="h-[100%] w-[100%] object-contain rounded-lg"
          />
        </div>
      </div>
      <div className="mt-10 flex flex-col p-3 gap-3 text-sm">
        <h3 className="font-medium w-fit line-clamp-2 overflow-hidden text-ellipsis">
          {item.orgName}
        </h3>
        <p className="w-fit line-clamp-5 overflow-hidden text-ellipsis text-text3">
          {item.orgIntroduction}
        </p>
      </div>
    </NavLink>
  );
};

export default ItemCompany;
