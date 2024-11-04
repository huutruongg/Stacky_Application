import TitleField from "@/components/titleField/TitleField";
import React from "react";

const ReviewJobPost = () => {
  return (
    <div className="bg-secondary rounded-xl p-5 text-sm">
      <TitleField children={"Chi tiết tuyển dụng"}></TitleField>
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-text1 font-medium text-base mb-1">
            Mô tả công việc
          </h3>
          <div className="text-text1 text-sm px-5">
            - Thiết kế, phát triển và bảo trì các ứng dụng phần mềm.
            <br />
            - Làm việc với đội ngũ để xây dựng các giải pháp phù hợp với nhu cầu
            kinh doanh.
            <br />- Thực hiện kiểm thử và gỡ lỗi sản phẩm.
          </div>
        </div>
        <div>
          <h3 className="text-text1 font-medium text-base mb-1">
            Yêu cầu ứng viên
          </h3>
          <div className="text-text1 text-sm px-5">
            <li>
              <span>Trình độ học vấn: </span>Cử nhân ngành Công nghệ Thông tin.
            </li>
            <li>
              <span>Kinh nghiệm làm việc:</span> Tối thiểu 2 năm trong lĩnh vực
              phát triển phần mềm.
            </li>
            <li>
              <span>Ngành nghề yêu cầu: </span>Kỹ sư phần mềm, phát triển web.
            </li>
            <li>
              <span>Kỹ năng chuyên môn:</span> Thành thạo JavaScript, ReactJS,
              và NodeJS.
            </li>
          </div>
        </div>

        <div>
          <h3 className="text-text1 font-medium text-base mb-1">Quyền lợi</h3>
          <div className="text-text1 text-sm px-5">
            <li>
              <span>Chế độ nghỉ phép: </span>12 ngày phép/năm và các ngày nghỉ
              lễ.
            </li>
            <li>
              <span>Thưởng: </span>Các khoản thưởng dựa trên hiệu suất làm việc.
            </li>
            <li>
              <span>Bảo hiểm: </span>Tham gia bảo hiểm y tế, xã hội theo quy
              định.
            </li>
          </div>
        </div>
        <div>
          <h3 className="text-text1 font-medium text-base mb-1">
            Địa điểm làm việc
          </h3>
          <div className="text-text1 text-sm px-5">
            <li>
              <span>Văn phòng chính: </span>123 Đường ABC, Quận 1, TP. Hồ Chí
              Minh.
            </li>
            <li>
              <span>Làm việc từ xa: </span>Có thể thỏa thuận.
            </li>
          </div>
        </div>
        <div>
          <h3 className="text-text1 font-medium text-base mb-1">
            Thời gian làm việc
          </h3>
          <div className="text-text1 text-sm px-5">
            <li>
              <span>Thứ hai đến thứ sáu: </span>8:00 - 17:00.
            </li>
            <li>
              <span>Thứ bảy: </span>Nghỉ.
            </li>
          </div>
        </div>
        <div>
          <h3 className="text-text1 font-medium text-base mb-1">
            Cách thức ứng tuyển
          </h3>
          <div className="text-text1 text-sm px-5">
            Ứng viên nộp hồ sơ trực tuyến bằng cách bấm{" "}
            <a href="" className="font-semibold">
              Ứng tuyển
            </a>{" "}
            ngay dưới đây hoặc gửi CV về email: example@company.com.
          </div>
        </div>
        <div className="">
          <span>Hạn nộp hồ sơ: </span>30/11/2024
        </div>
      </div>
    </div>
  );
};

export default ReviewJobPost;
