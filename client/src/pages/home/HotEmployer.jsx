import React, { useRef } from "react";
import TitleField from "@/components/titleField/TitleField";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import IconBack from "@/components/icons/IconBack";
import IconNext from "@/components/icons/IconNext";
import imgIT from "@/components/image/imgIT.png";

const HotEmployer = () => {
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
    <div className="">
      <div className="flex justify-between">
        <TitleField children={"Nhà Tuyển Dụng Nổi Bật"}></TitleField>
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
          reverseDirection: true
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Autoplay]} // Đảm bảo bạn đã thêm Pagination nếu cần
        className="px-3 py-1"
      >
        <SwiperSlide>
          <ItemEmployer url={imgIT}></ItemEmployer>
        </SwiperSlide>
        <SwiperSlide>
          <ItemEmployer url={imgIT}></ItemEmployer>
        </SwiperSlide>
        <SwiperSlide>
          <ItemEmployer url={imgIT}></ItemEmployer>
        </SwiperSlide>
        <SwiperSlide>
          <ItemEmployer url={imgIT}></ItemEmployer>
        </SwiperSlide>
        <SwiperSlide>
          <ItemEmployer url={imgIT}></ItemEmployer>
        </SwiperSlide>
        <SwiperSlide>
          <ItemEmployer url={imgIT}></ItemEmployer>
        </SwiperSlide>
        <SwiperSlide>
          <ItemEmployer url={imgIT}></ItemEmployer>
        </SwiperSlide>
        <SwiperSlide>
          <ItemEmployer url={imgIT}></ItemEmployer>
        </SwiperSlide>
        <SwiperSlide>
          <ItemEmployer url={imgIT}></ItemEmployer>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

const ItemEmployer = ({ url }) => {
  return (
    <div className="flex flex-col justify-center items-center p-4 gap-2 bg-secondary w-[180px] h-[184px] rounded-lg cursor-pointer hover:bg-white hover:shadow-[0_10px_30px_rgba(91,6,170,0.2)] hover:border-primary border">
      <img src={url} alt="" className="w-24" />
    </div>
  );
};
export default HotEmployer;
