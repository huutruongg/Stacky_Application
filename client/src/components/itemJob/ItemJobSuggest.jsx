import React, { useEffect, useState } from "react";
import IconHeart from "@/components/icons/IconHeart";
import imgCompany from "@/components/image/imgCompany.png";
import axiosInstance from "@/lib/authorizedAxios";
import toast from "react-hot-toast";
import { useJobSave } from "../context/JobSaveProvider";
import IconHeartActive from "../icons/IconHeartActive";

const ItemJobSuggest = ({ jobData, logined }) => {
  const [liked, setLiked] = useState(jobData.isLiked);
  const { refreshSavedJobs } = useJobSave();

  const handleHeartClick = () => {
    if (logined) {
      if (liked) {
        handleDeleteSaveJob();
      } else {
        handleSaveJob();
      }
    } else {
      toast.error("Vui lòng đăng nhập để lưu bài viết");
    }
  };
  const handleSaveJob = async () => {
    try {
      await axiosInstance.post(`/job-post/save-job-post/${jobData._id}`);
      toast.success("Lưu bài viết thành công");
      setLiked(true); // Update the liked state
      refreshSavedJobs();
    } catch (error) {
      toast.error("Lưu bài viết thất bại");
    }
  };

  const handleDeleteSaveJob = async () => {
    try {
      await axiosInstance.delete(`/job-post/unsave-job-post/${jobData._id}`);
      toast.success("Xóa bài viết thành công");
      setLiked(false); // Update the liked state
      refreshSavedJobs();
    } catch (error) {
      toast.error("Xóa bài viết thất bại");
    }
  };

  return (
    <div className="flex flex-col gap-5 text-sm bg-secondary p-3 rounded-lg border hover:border hover:border-primary hover:bg-white">
      <div className="flex justify-between gap-2">
        <div
          className="min-w-[75px] min-h-[75px] max-w-[75px] max-h-[75px] overflow-hidden rounded-md cursor-pointer"
          onClick={() => {
            window.open(`/job-detail/${jobData._id}`, "_blank");
          }}
        >
          <img
            src={jobData?.jobImage ? jobData?.jobImage : imgCompany}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-around gap-1 w-full">
          <div className="flex gap-1 items-center justify-between">
            <div className="flex gap-1 items-center">
              <div className="bg-[#D9BCFF] text-[#6112C9] px-2 rounded-full items-center justify-center">
                <span className="text-xs font-semibold">HOT</span>
              </div>
              <h3>
                <div
                  className="cursor-pointer line-clamp-1 overflow-hidden text-ellipsis font-medium hover:decoration-primary hover:text-primary hover:underline"
                  onClick={() => {
                    window.open(`/job-detail/${jobData?._id}`, "_blank");
                  }}
                >
                  {jobData?.jobTitle}
                </div>
              </h3>
            </div>
            <div
              className="z-10 hover:cursor-pointer"
              onClick={handleHeartClick}
            >
              {liked ? (
                <IconHeartActive className="w-6 h-6"></IconHeartActive>
              ) : (
                <IconHeart className="w-6 h-6"></IconHeart>
              )}
            </div>
          </div>
          <div>
            <a
              href={`/company/${jobData?.orgId}`}
              className="w-fit line-clamp-1 overflow-hidden text-xs text-ellipsis text-text3 hover:decoration-text3 hover:underline"
            >
              {jobData?.orgName?.toUpperCase()}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-[2px] max-w-32 text-text5 font-medium text-ellipsis bg-[#EDEAF0] rounded-xl line-clamp-1 overflow-hidden text-xs text-center">
              <span>{jobData?.jobSalary}</span>
            </div>
            <div className="px-2 py-[2px] max-w-32 text-text5 font-medium text-ellipsis bg-[#EDEAF0] rounded-xl line-clamp-1 overflow-hidden text-xs text-center">
              <span>{jobData?.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemJobSuggest;
