import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";

const CompanyInfo = () => {
  return (
    <div className="rounded-xl bg-secondary">
      <div className="py-2 rounded-tl-xl rounded-tr-xl text-transparent bg-gradient-to-r from-[#48038C] to-[#e59fff]">
        <h3 className="text-xl ml-5 text-white">Thông tin công ty</h3>
      </div>
      <div className="flex flex-col w-full gap-5 p-5 text-sm leading-6 text-justify">
        <p>
          As a cornerstone of FPT Corporation, a leader in integrated solutions
          and IT services in Vietnam for nearly three decades, FPT IS proudly
          stands as a trusted partner, committed to co-creating future value
          through technology alongside top enterprises and organizations, both
          domestically and globally. Recognized for its technical expertise by
          customers and partners worldwide, FPT IS has been instrumental in
          designing and implementing comprehensive IT products, projects,
          services, and solutions across key sectors, enriching the lives of
          millions. With over 3,400 employees and an extensive network of
          offices and branches spanning all 63 provinces and cities, FPT IS has
          recently been honored by Vietnam Report as one of the Top 10 Most
          Reputable Technology Companies in 2023, and also awarded the "Best
          Companies To Work For In Asia 2023" accolade by HR Asia.
        </p>
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
            <SwiperSlide className="w-[200px] rounded-md">
              <img
                src={
                  "https://cdn.create.vista.com/api/media/small/46394565/stock-photo-corporate-building"
                }
                alt=""
                className="w-[200px] object-cover rounded-md"
              />
            </SwiperSlide>
            <SwiperSlide className="w-[200px] rounded-md">
              <img
                src={
                  "https://cdn.create.vista.com/api/media/small/46394565/stock-photo-corporate-building"
                }
                alt=""
                className="w-[200px] object-cover rounded-md"
              />
            </SwiperSlide>
            <SwiperSlide className="w-[200px] rounded-md">
              <img
                src={
                  "https://cdn.create.vista.com/api/media/small/46394565/stock-photo-corporate-building"
                }
                alt=""
                className="w-[200px] object-cover rounded-md"
              />
            </SwiperSlide>
            <SwiperSlide className="w-[200px] rounded-md">
              <img
                src={
                  "https://cdn.create.vista.com/api/media/small/46394565/stock-photo-corporate-building"
                }
                alt=""
                className="w-[200px] object-cover rounded-md"
              />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="">
          <h3 className="font-medium text-base">Chế độ đãi ngộ</h3>
          <ul>
            <li>Lương tháng 13 và thưởng KPI. Xem xét tăng lương hàng năm.</li>
            <li>Lương tháng 13 và thưởng KPI. Xem xét tăng lương hàng năm.</li>
            <li>Lương tháng 13 và thưởng KPI. Xem xét tăng lương hàng năm.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
