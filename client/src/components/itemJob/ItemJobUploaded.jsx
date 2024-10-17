import React from "react";
import imgCompany from "@/components/image/imgCompany.png";

const ItemJobUploaded = ({ jobData }) => {
  return (
    <div className="flex flex-col gap-5 text-sm bg-white p-3 rounded-lg border hover:border hover:border-primary hover:bg-white">
      <div className="flex justify-between gap-5">
        <div className="min-w-[80px] min-h-[80px]">
          <a href="">
            <img
              src={jobData.jobImage ? jobData.jobImage : imgCompany}
              alt=""
            />
          </a>
        </div>
        <div className="flex flex-col justify-around gap-1 w-full">
          <div className="flex gap-1 items-center">
            <div className="bg-[#D9BCFF] text-[#6112C9] px-2 rounded-full items-center justify-center">
              <span className="text-xs font-semibold">HOT</span>
            </div>
            <h3>
              <div
                href=""
                className="line-clamp-1 overflow-hidden text-ellipsis"
                onClick={() => {
                  navigate(`/job-detail/${jobData._id}`);
                }}
              >
                {jobData.jobTitle}
              </div>
            </h3>
            {/* <a href="">
              <IconHeart className={"w-5 h-5"} liked={""}></IconHeart>
            </a> */}
          </div>
          <div>
            <a
              href="/company"
              className="w-fit line-clamp-1 overflow-hidden text-xs text-ellipsis text-text3 hover:decoration-text3 hover:underline"
            >
              {jobData.orgName.toUpperCase()}
            </a>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-10">
              <div className="px-5 py-px text-text2 bg-[#EDEAF0] rounded-xl">
                <span>{jobData.jobSalary}</span>
              </div>
              <div className="px-5 py-px text-text2 bg-[#EDEAF0] rounded-xl">
                <span>{jobData.location}</span>
              </div>
            </div>
            <div className="">
              <span
                className={`text-sm font-semibold rounded-md ${
                  jobData.postStatus === "ACCEPTED"
                    ? "text-accepted"
                    : jobData.postStatus === "PENDING"
                    ? "text-primary"
                    : "text-rejected"
                }`}
              >
                {jobData.postStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemJobUploaded;
