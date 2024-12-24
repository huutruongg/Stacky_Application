import Button from "@/components/button/Button";
import FormatDate from "@/components/format/FormatDate";
import { AlertModal } from "@/components/shared/AlertModal";
import TitleField from "@/components/titleField/TitleField";
import { Modal } from "@/components/ui/modal";
import axiosInstance from "@/lib/authorizedAxios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import ViewApply from "./ViewApply";

const JobDescription = ({ jobData }) => {
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onCloseReview = () => {
    setOpenReview(false);
  };

  const handleOpenReview = () => {
    setOpenReview(true);
  };

  const handleApplyJob = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.post(`/job-post/create-application/${jobData._id}`);
      toast.success("Ứng tuyển thành công");
      setOpenReview(false);
      setIsLoading(false);
    } catch (error) {
      toast.error("Ứng tuyển thất bại");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-secondary rounded-xl p-5 text-sm">
      <TitleField children={"Chi tiết tuyển dụng"}></TitleField>
      <div className="flex flex-col gap-5">
        <div className="">
          <h3 className="text-text1 font-medium text-base mb-1">
            Mô tả công việc
          </h3>
          <div className="text-text1 text-sm px-5">
            {jobData.jobDescription.split("\n").map((line, index) => (
              <li key={index}>
                {line.replace(/^-/, "").trim()}{" "}
                {/* Loại bỏ ký tự '-' và khoảng trắng */}
              </li>
            ))}
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
        {jobData.languagesRequired.length > 0 ? (
          <div className="">
            <h3 className="text-text1 font-medium text-base mb-1">
              Yêu cầu ngoại ngữ
            </h3>
            <div className="text-text1 text-sm px-5">
              {jobData.languagesRequired.map((item, index) => (
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
            {jobData.jobBenefit !== "" ? (
              <div>
                {jobData.jobBenefit.split("\n").map((line, index) => (
                  <li key={index}>
                    {line.replace(/^-/, "").trim()}{" "}
                    {/* Loại bỏ ký tự '-' và khoảng trắng */}
                  </li>
                ))}
              </div>
            ) : (
              ""
            )}
            <li>
              <span>Chế độ nghĩ phép: {jobData.leavePolicy}</span>
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
          <span>
            Hạn nộp hồ sơ: {FormatDate.formatDate(jobData.applicationDeadline)}
          </span>
        </div>
        <div className="flex justify-center items-center gap-10 mt-5">
          <Button
            kind="primary"
            className="gap-3 px-16"
            onClick={handleOpenReview}
          >
            <span className="font-semibold">ỨNG TUYỂN NGAY</span>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-end w-full">
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          isLoading={isLoading}
        />
        <Modal
          isOpen={openReview}
          onClose={onCloseReview}
          className="bg-white max-w-[600px]"
          title={`Ứng tuyển ${jobData?.jobTitle}`}
          description={`Nếu ngành bạn là Công Nghệ Thông Tin, hãy chia sẻ quyền truy cập Github của bạn để chúng tôi tính điểm số của bạn với bài viết này!`}
        >
          <ViewApply id={jobData?._id} />
          <div className="flex justify-center gap-5 py-5">
            <Button
              kind="secondary"
              className="text-center px-10 disabled:opacity-50"
              type="button"
              isLoading={isLoading}
              onClick={onCloseReview}
            >
              Hủy
            </Button>
            <Button
              kind="primary"
              className="text-center px-10 disabled:opacity-50"
              type="submit"
              isLoading={isLoading}
              onClick={handleApplyJob}
            >
              ứng tuyển
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default JobDescription;
