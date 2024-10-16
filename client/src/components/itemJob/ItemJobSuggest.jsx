import React, { useEffect, useState } from "react";
import IconHeart from "@/components/icons/IconHeart";
import imgCompany from "@/components/image/imgCompany.png";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/lib/authorizedAxios";
import toast from "react-hot-toast";

const ItemJobSuggest = ({ jobData }) => {
  const [changeColorLiked, setChangeColorLiked] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSaveJob = async () => {
    try {
      await axiosInstance.post(`/job-posting/save-job`, {
        userId: user.userId,
        jobPostId: jobData._id,
      });
      toast.success("Lưu bài viết thành công");
    } catch (error) {
      toast.error("Lưu bài viết thất bại");
    }
  };

  const handleDeleteSaveJob = async () => {
    try {
      await axiosInstance.delete(
        `/job-posting/cancel-job-saved/${user.userId}/${jobData._id}`
      );
      toast.success("Xóa bài viết thành công");
    } catch (error) {
      toast.error("Xóa bài viết thất bại");
    }
  };

  return (
    <div className="flex flex-col gap-5 text-sm bg-secondary p-3 rounded-lg border hover:border hover:border-primary hover:bg-white">
      <div className="flex justify-between gap-2">
        <div className="min-w-[75px] min-h-[75px] max-w-[75px] max-h-[75px] overflow-hidden rounded-md">
          <a href="/company">
            <img
              src={jobData.jobImage ? jobData.jobImage : imgCompany}
              alt=""
            />
          </a>
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
                    navigate(`/job-detail/${jobData._id}`);
                  }}
                >
                  {jobData.jobTitle}
                </div>
              </h3>
            </div>
            <div
              className="z-10 hover:cursor-pointer"
              onClick={
                jobData.isLiked === true ? handleDeleteSaveJob : handleSaveJob
              }
            >
              <IconHeart
                className="w-5 h-5"
                liked={jobData.isLiked}
                initialLiked={changeColorLiked}
              />
            </div>
          </div>
          <div>
            <a
              href="/company"
              className="w-fit line-clamp-1 overflow-hidden text-xs text-ellipsis text-text3 hover:decoration-text3 hover:underline"
            >
              {jobData.orgName.toUpperCase()}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-[2px] max-w-32 text-text5 font-medium text-ellipsis bg-[#EDEAF0] rounded-xl line-clamp-1 overflow-hidden text-xs text-center">
              <span>{jobData.jobSalary}</span>
            </div>
            <div className="px-2 py-[2px] max-w-32 text-text5 font-medium text-ellipsis bg-[#EDEAF0] rounded-xl line-clamp-1 overflow-hidden text-xs text-center">
              <span>{jobData.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemJobSuggest;
