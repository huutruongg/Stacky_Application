import React from "react";
import imgCompany from "@/components/image/imgCompany.png";
import IconPrice from "@/components/icons/IconPrice";

const ItemJobSave = () => {
  return (
    <div className="flex flex-col gap-5 bg-white p-5 rounded-lg border border-transparent hover:border hover:border-primary">
      <div className="flex justify-between items-center gap-4">
        <div className="min-w-[80px] min-h-[80px]">
          <a href="">
            <img src={imgCompany} alt="" />
          </a>
        </div>
        <div className="flex flex-col justify-center gap-1 w-full">
          <div className="flex items-center justify-between gap-1">
            <div className="bg-[#D9BCFF] text-[#6112C9] px-2 rounded-full items-center justify-center">
              <span className="text-xs font-semibold">HOT</span>
            </div>
            <h3 className="line-clamp-1 overflow-hidden text-ellipsis max-w-[350px]">
              <a href="">
                Nhân viên kế toán Nhân viên kế toán Nhân viên kế toánNhân viên
                kế toánNhân viên kế toán
              </a>
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-primary p-1 rounded-full">
                <IconPrice></IconPrice>
              </div>
              <span>Thỏa thuận</span>
            </div>
          </div>
          <div className="line-clamp-1 overflow-hidden text-sm text-ellipsis text-text3 hover:decoration-text3 hover:underline">
            <a href="">
              CÔNG TY TNHH XÂY DỰNG NAM CÔNG TY TNHH XÂY DỰNG NAM CÔNG TY TNHH
              XÂY DỰNG NAM CÔNG TY TNHH XÂY DỰNG NAM
            </a>
          </div>
          <div className="line-clamp-1 overflow-hidden text-sm text-ellipsis text-text3">
            <span>Đã lưu: 15/09/2024 - 15:00</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="px-5 py-px text-text2 bg-[#EDEAF0] rounded-xl">
              <span>Hà Nội</span>
            </div>
            <div className="flex items-center gap-5">
              <button className="px-5 py-1 text-white bg-primary rounded-md hover:opacity-80">
                Ứng tuyển
              </button>
              <button className="px-5 py-1 rounded-md hover:opacity-70 border border-primary">
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemJobSave;
