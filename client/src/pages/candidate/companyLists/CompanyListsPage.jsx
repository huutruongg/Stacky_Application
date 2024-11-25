import React, { useState } from "react";
import imgCompanySlide from "@/components/image/imgCompanySlide.png";
import IconSearch from "@/components/icons/IconSearch";
import IconClose from "@/components/icons/IconClose";
import { NavLink } from "react-router-dom";
import PaginationDemo from "@/components/pagination/Pagination";

const CompanyListsPage = () => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    console.log(params);
  };

  const handleClearInput = () => setSearchInput("");
  return (
    <div>
      <div className="overflow-hidden">
        <img src={imgCompanySlide} alt="" />
        <div className="relative page-container">
          <div className="absolute top-[-280px]">
            <div className="flex items-center gap-5 mb-10 ">
              <NavLink
                to={"/company"}
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-primary border-b-2 border-primary"
                    : "text-text5 hover:text-primary"
                }
              >
                Danh sách công ty
              </NavLink>
              <NavLink
                to={"/company-top"}
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-primary border-b-2 border-primary"
                    : "text-text5 hover:text-primary"
                }
              >
                Top công ty
              </NavLink>
            </div>
            <div className="flex flex-col gap-7">
              <h1 className="text-xl text-primary font-medium">
                Khám phá 100.000+ công ty nổi bật
              </h1>
              <span>
                Tra cứu thông tin công ty và tìm kiếm nơi làm việc tốt nhất dành
                cho bạn
              </span>
              <div className="flex justify-between items-center bg-white rounded-full p-2 border border-secondary">
                <div className="relative flex items-center min-w-[500px]">
                  <IconSearch className="absolute m-2 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Vị trí tuyển dụng"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-5 py-1 outline-none rounded-lg"
                  />
                  {searchInput && (
                    <IconClose
                      className="cursor-pointer hover:bg-secondary rounded-full w-6 h-6 ml-2 mr-5"
                      onClick={handleClearInput}
                    />
                  )}
                </div>
                <button
                  className="flex items-center justify-center bg-button text-white rounded-full px-5 max-h-10 text-base font-semibold h-[48px] hover:opacity-90"
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-container flex flex-col justify-center items-center my-10">
        <h3 className="text-primary font-medium text-xl mb-8">
          DANH SÁCH CÁC CÔNG TY NỔI BẬT
        </h3>
        <div className="grid w-full grid-cols-3 gap-5">
          <ItemCompany />
          <ItemCompany />
          <ItemCompany />
        </div>
        <div className="mt-5">
          <PaginationDemo
            PerPage={"newsPerPage"}
            dataBase={"jobData"}
            currentPage={"currentPage"}
            onPageChange={"handlePageChange"}
          />
        </div>
      </div>
    </div>
  );
};

const ItemCompany = () => {
  return (
    <div className="overflow-hidden bg-secondary rounded-lg h-auto cursor-pointer hover:bg-white hover:shadow-[0_10px_30px_rgba(91,6,170,0.2)] hover:border-primary border">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiUHB559_lpuhRggsf2SfA6nuCvsM_7zj8lg&s"
        alt=""
        className="object-fill w-full h-28 rounded-t-lg  border-b"
      />
      <div className="relative">
        <div className="absolute top-[-35px] left-[20px] flex items-center justify-center w-[70px] h-[70px] overflow-hidden bg-white border rounded-lg">
          <img
            src="https://img.freepik.com/free-vector/abstract-logo-flame-shape_1043-44.jpg?semt=ais_hybrid"
            alt=""
            className="h-[100%] w-[100%] object-contain rounded-lg"
          />
        </div>
      </div>
      <div className="mt-10 flex flex-col p-3 gap-3 text-sm">
        <h3 className="font-medium w-fit line-clamp-2 overflow-hidden text-ellipsis">
          CÔNG TY CỔ PHẦN CÔNG NGHỆ PREP PHẦN CÔNG NGHỆ PREP PHẦN CÔNG NGHỆ PREP
          CÔNG NGHỆ PREP PHẦN CÔNG NGHỆ PREP
        </h3>
        <p className="w-fit line-clamp-5 overflow-hidden text-ellipsis text-text3 ">
          " Prep là một startup Edtech (công nghệ giáo dục) hiện đang phát triển
          nền tảng học tập tương tác trực tuyến để học viên luyện thi chứng chỉ
          ngoại ngữ hiệu quả trong khi tiết kiệm tối ưu về thời gian và chi phí.
          Học viên được xây dựng lộ trình cá nhân hoá sao cho phù hợp với khả
          năng và mục tiêu của mình nhất. Prep với sứ..."
        </p>
      </div>
    </div>
  );
};

export default CompanyListsPage;
