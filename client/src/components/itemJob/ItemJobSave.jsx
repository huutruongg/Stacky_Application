import React from "react";
import imgCompany from "@/components/image/imgCompany.png";
import IconPrice from "@/components/icons/IconPrice";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/authorizedAxios";

const ItemJobSave = ({ jobData }) => {
  const handleDeleteSaveJob = async () => {
    try {
      await axiosInstance.delete(`/job-post/unsave-job-post/${jobData._id}`);
      toast.success("Xóa bài viết thành công");
    } catch (error) {
      toast.error("Xóa bài viết thất bại");
    }
  };

  return (
    <div className="flex flex-col gap-5 bg-white p-5 rounded-lg border hover:border hover:border-primary">
      <div className="flex justify-between items-center gap-4">
        <div className="flex justify-between items-center w-[100px] h-[100px]">
          <a href="">
            <img
              src={jobData.jobImage ? jobData.jobImage : imgCompany}
              alt=""
              className="min-w-[100px] min-h-[100px] rounded-md border"
            />
          </a>
        </div>
        <div className="flex flex-col justify-center gap-1 w-full">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-3">
              <div className="bg-[#D9BCFF] text-[#6112C9] px-2 rounded-full items-center justify-center">
                <span className="text-xs font-semibold">HOT</span>
              </div>
              <h3 className="line-clamp-1 overflow-hidden text-ellipsis max-w-[330px]">
                <a href="" title={jobData.jobTitle}>
                  {jobData.jobTitle}
                </a>
              </h3>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-primary p-1 rounded-full">
                <IconPrice className={"w-4 h-4"} color={"#fff"}></IconPrice>
              </div>
              <span>{jobData.jobSalary}</span>
            </div>
          </div>
          <div className="line-clamp-1 overflow-hidden text-sm text-ellipsis text-text3 hover:decoration-text3 hover:underline">
            <a href="" title={jobData.jobTitle}>
              FPT
            </a>
          </div>
          <div className="line-clamp-1 overflow-hidden text-sm text-ellipsis text-text3">
            <span>{dayjs(jobData.postedAt).format("DD/MM/YYYY")}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="px-5 py-px text-text2 bg-[#EDEAF0] rounded-xl">
              <span>{jobData.location}</span>
            </div>
            <div className="flex items-center gap-5">
              <button className="px-5 py-1 text-white bg-primary rounded-md hover:opacity-80">
                Ứng tuyển
              </button>
              <button
                className="px-5 py-1 rounded-md hover:opacity-70 border border-primary"
                onClick={handleDeleteSaveJob}
              >
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
