import React, { useEffect, useRef, useState } from "react";
import TitleField from "@/components/titleField/TitleField";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import IconBack from "@/components/icons/IconBack";
import IconNext from "@/components/icons/IconNext";
import axiosInstance from "@/lib/authorizedAxios";
import { useNavigate } from "react-router-dom";

const HotEmployer = () => {
  const [companyData, setCompanyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const swiperRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await axiosInstance.get("/job-post/get-top-recruiters");
        setCompanyData(result.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const limitedCompanyData = companyData.slice(0, 10);

  return (
    <div className="">
      <div className="flex justify-between">
        <TitleField children={"Nhà Tuyển Dụng Nổi Bật"} />
        <ul className="flex justify-start gap-5 mr-20">
          <li className="cursor-pointer" onClick={handlePrev}>
            <IconBack />
          </li>
          <li className="cursor-pointer" onClick={handleNext}>
            <IconNext />
          </li>
        </ul>
      </div>
      {isLoading ? (
        <div className="text-center mt-5">Đang tải dữ liệu...</div>
      ) : (
        <Swiper
          spaceBetween={20}
          slidesPerView={5}
          grabCursor={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            reverseDirection: true,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Autoplay]}
          className="px-3 py-1"
        >
          {limitedCompanyData.length > 0 ? (
            limitedCompanyData.map((item, index) => (
              <SwiperSlide key={index}>
                <ItemEmployer
                  url={item?.orgImage || ""}
                  onCLick={() => navigate(`/company/${item._id}`)}
                />
              </SwiperSlide>
            ))
          ) : (
            <div className="text-center mt-5">Không có dữ liệu</div>
          )}
        </Swiper>
      )}
    </div>
  );
};

const ItemEmployer = ({ url, onCLick }) => {
  return (
    <div
      className="flex flex-col items-center p-4 gap-2 bg-secondary rounded-lg w-[180px] h-[180px] cursor-pointer hover:bg-white hover:shadow-[0_10px_30px_rgba(91,6,170,0.2)] hover:border-primary border"
      onClick={onCLick}
    >
      <img src={url} alt="Employer Logo" className="w-24 h-auto" />
    </div>
  );
};

export default HotEmployer;
