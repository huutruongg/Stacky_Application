import React, { useRef } from "react";
import TitleField from "@/components/titleField/TitleField";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import IconBack from "@/components/icons/IconBack";
import IconNext from "@/components/icons/IconNext";
import imgMarketing from "@/components/image/imgMarketing.png";
import imgAuditing from "@/components/image/imgAuditing.png";
import imgAccounting from "@/components/image/imgAccounting.png";
import imgIT from "@/components/image/imgIT.png";
import imgTourism from "@/components/image/imgTourism.png";
import imgConstruction from "@/components/image/imgConstruction.png";
import imgGraphic from "@/components/image/imgGraphic.png";
import imgAchitecture from "@/components/image/imgAchitecture.png";
import imgBusiness from "@/components/image/imgBusiness.png";
import imgLogistics from "@/components/image/imgLogistics.png";
import imgAutomotive from "@/components/image/imgAutomotive.png";
import imgLanguage from "@/components/image/imgLanguage.png";

const HotMajor = () => {
  const swiperRef = useRef(null);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between">
        <TitleField children={"Top Ngành Nghề Nổi Bật"}></TitleField>
        <ul className="flex justify-start gap-5 mr-20">
          <li className="cursor-pointer" onClick={handlePrev}>
            <IconBack></IconBack>
          </li>
          <li className="cursor-pointer" onClick={handleNext}>
            <IconNext></IconNext>
          </li>
        </ul>
      </div>
      <Swiper
        spaceBetween={20}
        slidesPerView={5} // Hiển thị 2 slide mỗi hàng
        grabCursor={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false, // Thay đổi thành false để tiếp tục autoplay ngay cả khi tương tác
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Autoplay]} // Đảm bảo bạn đã thêm Pagination nếu cần
        className="px-3 py-1"
      >
        <SwiperSlide>
          <ItemMajor url={imgIT} children={"Công Nghệ Thông Tin"} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemMajor url={imgMarketing} children={"Marketing"} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemMajor url={imgAuditing} children={"Tài Chính"} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemMajor url={imgAccounting} children={"Kế Toán / Kiểm Toán"} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemMajor url={imgTourism} children={"Du Lịch"} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemMajor url={imgGraphic} children={"Thiết Kế Đồ Họa"} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemMajor url={imgConstruction} children={"Xây Dựng"} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemMajor url={imgAchitecture} children={"Kiến Trúc"} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemMajor url={imgBusiness} children={"Quản Trị Kinh Doanh"} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemMajor url={imgLogistics} children={"Logistic"} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemMajor url={imgAutomotive} children={"Kỹ Thuật Ô Tô / Cơ Khí"} />
        </SwiperSlide>
        <SwiperSlide>
          <ItemMajor url={imgLanguage} children={"Ngôn Ngữ"} />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

const ItemMajor = ({ children, url }) => {
  return (
    <div className="flex flex-col items-center p-4 gap-2 bg-secondary w-[180px] h-[184px] rounded-lg cursor-pointer hover:bg-white hover:shadow-[0_10px_30px_rgba(91,6,170,0.2)] hover:border-primary border">
      <img src={url} alt="" className="w-24" />
      <span className="text-center">{children}</span>
    </div>
  );
};

export default HotMajor;
