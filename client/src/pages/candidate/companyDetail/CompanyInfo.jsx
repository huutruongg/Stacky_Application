import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";

const CompanyInfo = ({ companyData }) => {
  return (
    <div className="rounded-xl bg-secondary">
      <div className="py-2 rounded-tl-xl rounded-tr-xl text-transparent bg-gradient-to-r from-[#48038C] to-[#e59fff]">
        <h3 className="text-xl ml-5 text-white">Thông tin công ty</h3>
      </div>
      <div className="flex flex-col w-full gap-5 p-5 text-sm leading-6 text-justify">
        <p>{companyData?.orgIntroduction}</p>
        <div className="w-[733px]">
          <Swiper
            spaceBetween={10}
            slidesPerView={3}
            pagination={{ clickable: true }}
            grabCursor={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false, // Thay đổi thành false để tiếp tục autoplay ngay cả khi tương tác
              reverseDirection: true,
            }}
            scrollbar={{ hide: false }}
            modules={[Scrollbar, Pagination, Autoplay]}
          >
            {companyData?.orgImages.length > 0 &&
              companyData?.orgImages.map((image, index) => (
                <SwiperSlide key={index} className="w-[200px] rounded-md">
                  <img
                    src={image}
                    alt=""
                    className="w-[200px] object-cover rounded-md"
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <div className="">
          <div className="">
            <h3 className="font-medium text-base">Chế độ đãi ngộ</h3>
            <div>
              {companyData?.orgBenefits
                ? !companyData.orgBenefits.includes("\n")
                  ? companyData.orgBenefits
                  : companyData.orgBenefits.split("\n").map((line, index) => (
                      <li key={index}>
                        {line.replace(/^-/, "").trim()}{" "}
                        {/* Loại bỏ ký tự '-' và khoảng trắng */}
                      </li>
                    ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
