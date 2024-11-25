import Button from "@/components/button/Button";
import FormatDate from "@/components/format/FormatDate";
import TitleField from "@/components/titleField/TitleField";
import React from "react";

const ModalReviewJob = ({ jobData }) => {
  return (
    <div className="bg-secondary rounded-xl p-5 text-sm">
      <TitleField children={"Chi tiết tuyển dụng"}></TitleField>
      <div className="flex flex-col gap-5">
        {jobData.jobImage ? (
          <div className="flex items-center justify-center h-[220px] w-full overflow-hidden">
            <img
              src={jobData.jobImage}
              alt=""
              className="w-[400px] bg-cover bg-center h-full object-cover rounded-md"
            />
          </div>
        ) : (
          ""
        )}
        <div className="">
          <h3 className="text-text1 font-medium text-base mb-1">
            Mô tả công việc
          </h3>
          <div className="text-text1 text-sm px-5">
            {jobData?.jobDescription
              ? !jobData.jobDescription.includes("\n")
                ? jobData.jobDescription
                : jobData.jobDescription.split("\n").map((line, index) => (
                    <li key={index}>
                      {line.replace(/^-/, "").trim()}{" "}
                      {/* Loại bỏ ký tự '-' và khoảng trắng */}
                    </li>
                  ))
              : null}
          </div>
        </div>
        <div className="">
          <h3 className="text-text1 font-medium text-base mb-1">
            Yêu cầu ứng viên
          </h3>
          <div className="text-text1 text-sm px-5">
            <li>
              <span>Trình độ học vấn: {jobData.educationRequired}</span>
            </li>
            <li>
              <span>Kinh nghiệm làm việc: {jobData.yearsOfExperience}</span>
            </li>
            <li>
              <span>Ngành nghề yêu cầu: {jobData.jobTitle}</span>
            </li>
            <li>
              <span>Kỹ năng chuyên môn: {jobData.professionalSkills}</span>
            </li>
            {jobData.certificateRequired !== "" ? (
              <li>
                <span>Chứng chỉ cần thiết: {jobData.certificateRequired}</span>
              </li>
            ) : (
              ""
            )}
          </div>
        </div>
        {jobData?.languagesRequired?.length > 0 ? (
          <div className="">
            <h3 className="text-text1 font-medium text-base mb-1">
              Yêu cầu ngoại ngữ
            </h3>
            <div className="text-text1 text-sm px-5">
              {jobData?.languagesRequired?.map((item, index) => (
                <li key={index}>
                  <span>
                    {item.language}: {item.level}
                  </span>
                </li>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="">
          <h3 className="text-text1 font-medium text-base mb-1">Quyền lợi</h3>
          <div className="text-text1 text-sm px-5">
            {jobData?.jobBenefit !== "" ? (
              <div>
                {jobData?.jobBenefit
                  ? !jobData.jobBenefit.includes("\n")
                    ? jobData.jobBenefit
                    : jobData.jobBenefit.split("\n").map((line, index) => (
                        <li key={index}>
                          {line.replace(/^-/, "").trim()}{" "}
                          {/* Loại bỏ ký tự '-' và khoảng trắng */}
                        </li>
                      ))
                  : ""}
              </div>
            ) : (
              ""
            )}
            <li>
              <span>Chế độ nghĩ phép: {jobData?.leavePolicy}</span>
            </li>
          </div>
        </div>
        <div className="">
          <h3 className="text-text1 font-medium text-base mb-1">
            Địa điểm làm việc
          </h3>
          <div className="text-text1 text-sm px-5">
            <li>
              <span>{jobData.location}</span>
            </li>
          </div>
        </div>
        <div className="">
          <h3 className="text-text1 font-medium text-base mb-1">
            Thời gian làm việc
          </h3>
          <div className="text-text1 text-sm px-5">
            <li>
              <span>{jobData.typeOfWork}</span>
            </li>
          </div>
        </div>
        <div className="">
          <h3 className="text-text1 font-medium text-base mb-1">
            Cách thức ứng tuyển
          </h3>
          <div className="text-text1 text-sm px-5">
            Ứng viên nộp hồ sơ trực tuyến bằng cách bấm{" "}
            <a href="" className="font-semibold">
              Ứng tuyển
            </a>{" "}
            ngay dưới đây.
          </div>
        </div>
        <div className="">
          <span>Hạn nộp hồ sơ: {FormatDate(jobData?.applicationDeadline)}</span>
        </div>
      </div>
    </div>
  );
};

export default ModalReviewJob;
