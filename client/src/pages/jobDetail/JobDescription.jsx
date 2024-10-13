import Button from "@/components/button/Button";
import TitleField from "@/components/titleField/TitleField";
import React from "react";

const JobDescription = ({ jobData }) => {
  const dateString = jobData.applicationDeadline;

  // Chuyển đổi chuỗi thành đối tượng Date
  const dateObject = new Date(dateString);

  // Lấy ngày, tháng, và năm
  const day = String(dateObject.getDate()).padStart(2, "0"); // Đảm bảo có 2 chữ số
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = dateObject.getFullYear();

  // Tạo chuỗi định dạng DD/MM/YYYY
  const formattedDate = `${day}/${month}/${year}`;

  return (
    <div className="bg-secondary rounded-xl p-5 text-sm">
      <TitleField children={"Chi tiết tuyển dụng"}></TitleField>
      <div className="flex flex-col gap-5">
        <div className="">
          <h3 className="text-text1 font-medium text-base mb-1">
            Mô tả công việc
          </h3>
          <div className="text-text1 text-sm px-5">
            {jobData.jobDescription.split("\\n").map((line, index) => (
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
        <div className="">
          <h3 className="text-text1 font-medium text-base mb-1">Quyền lợi</h3>
          <div className="text-text1 text-sm px-5">
            {jobData.jobBenefit !== "" ? (
              <div>
                {jobData.jobBenefit.split("\\n").map((line, index) => (
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
          <span>Hạn nộp hồ sơ: {formattedDate}</span>
        </div>
        <div className="flex justify-center items-center gap-10 mt-5">
          <Button kind="primary" className="gap-3 px-16">
            <span className="font-semibold">ỨNG TUYỂN NGAY</span>
          </Button>
          <Button className="gap-3 px-10 border-2 border-[#48038C]">
            <span className="font-semibold text-primary">LƯU TIN</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
