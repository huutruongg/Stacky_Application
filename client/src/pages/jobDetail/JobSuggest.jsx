import React, { useEffect, useState } from "react";
import TitleField from "@/components/titleField/TitleField";
import { fetchData } from "@/api/fetchData";
import imgCompany from "@/components/image/imgCompany.png";
import IconHeart from "@/components/icons/IconHeart";
import IconHeartActive from "@/components/icons/IconHeartActive";
import { useJobSave } from "@/components/context/JobSaveProvider";
import toast from "react-hot-toast";

const JobSuggest = ({ jobData, logined }) => {
  const [liked, setLiked] = useState(jobData.isLiked);
  const { refreshSavedJobs } = useJobSave();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobRelatedData, setJobRelatedData] = useState([]);

  // console.log(jobData);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(
          `job-post/get-related-job-posts?jobTitle=${jobData.jobTitle}&location=${jobData.location}&yearsOfExperience=${jobData.yearsOfExperience}`
        );
        setJobRelatedData(result); // Cập nhật dữ liệu công việc
        setIsLoading(false);
      } catch (error) {
        console.error("Error while fetching jobs data:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    getData();
  }, [jobData]);

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-secondary rounded-xl">
      <TitleField
        children={"Gợi ý việc làm phù hợp"}
        className={"mt-5 ml-5"}
      ></TitleField>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex flex-col gap-5 text-sm bg-secondary p-3 rounded-lg border hover:border hover:border-primary hover:bg-white">
          <div className="flex justify-between gap-2">
            <div
              className="cursor-pointer"
              onClick={() => {
                window.open(`/job-detail/${jobData._id}`, "_blank");
              }}
            >
              <img
                src={jobData?.jobImage ? jobData?.jobImage : imgCompany}
                alt=""
                className="overflow-hidden object-cover min-w-[75px] min-h-[75px] max-w-[75px] max-h-[75px] rounded-md"
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
                      className="cursor-pointer line-clamp-1 text-ellipsis font-medium hover:decoration-primary hover:text-primary hover:underline"
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
                  className="w-fit line-clamp-1 text-xs text-ellipsis text-text3 hover:decoration-text3 hover:underline"
                >
                  {jobData?.orgName?.toUpperCase()}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-[2px] max-w-32 text-text5 font-medium text-ellipsis bg-[#EDEAF0] rounded-xl line-clamp-1 text-xs text-center">
                  <span>{jobData?.jobSalary}</span>
                </div>
                <div className="px-2 py-[2px] max-w-32 text-text5 font-medium text-ellipsis bg-[#EDEAF0] rounded-xl line-clamp-1 text-xs text-center">
                  <span>{jobData?.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSuggest;
