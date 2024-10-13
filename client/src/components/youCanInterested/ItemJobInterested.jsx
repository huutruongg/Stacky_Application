import React from "react";
import IconHeart from "@/components/icons/IconHeart";
import IconLocation from "../icons/IconLocation";
import IconPrice from "../icons/IconPrice";

const ItemJobInterested = () => {
  return (
    <div className="flex flex-col gap-5 p-3 bg-white rounded-lg border hover:border hover:border-primary text-sm">
      <div className="flex justify-between gap-1">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-around gap-1">
            {/* <div className="bg-[#D9BCFF] text-[#6112C9] px-2 rounded-full items-center justify-center">
              <span className="text-xs font-semibold">HOT</span>
            </div> */}
            <h3>
              <a
                href=""
                className="line-clamp-1 overflow-hidden text-ellipsis hover:text-primary"
              >
                Nhân viên kế toán Nhân viên kế toán Nhân viên kế toán
              </a>
            </h3>
            <a href="">
              <IconHeart className={"w-5 h-5"} liked={""}></IconHeart>
            </a>
          </div>
          <div>
            <a
              href=""
              className="line-clamp-1 overflow-hidden text-xs text-ellipsis text-text3 hover:decoration-text3 hover:underline"
            >
              CÔNG TY TNHH XÂY DỰNG NAM CÔNG TY TNHH XÂY DỰNG NAM NAM CÔNG TY
              TNHH XÂY DỰNG NAM
            </a>
          </div>
          <div className="flex items-center justify-around text-xs">
            <div className="flex items-center justify-center gap-2 px-5 py-px text-text2 rounded-xl">
              <div className="bg-primary p-1 rounded-full">
                <IconPrice color={"#fff"} className={"w-4 h-4"}></IconPrice>
              </div>
              <span className="text-primary font-semibold">Thoả thuận</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-5 py-px text-text2 rounded-xl">
              <div className="bg-primary p-1 rounded-full">
                <IconLocation
                  color={"#fff"}
                  className={"w-4 h-4"}
                ></IconLocation>
              </div>
              <span>Hà Nội</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemJobInterested;
