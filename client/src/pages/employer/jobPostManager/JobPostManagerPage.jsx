import React from "react";
import imgCompany from "@/components/image/imgCompany.png";
import PaginationDemo from "@/components/pagination/Pagination";
import IconDelete from "@/components/icons/IconDelete";
import IconEye from "@/components/icons/IconEye";
import { useNavigate } from "react-router-dom";

const JobPostManagerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-secondary rounded-xl py-5 px-16 text-sm">
      <div className="flex items-center gap-4 mb-5">
        <p className="">
          Danh sách <span className="font-semibold text-primary">{"6"}</span>{" "}
          việc việc làm đã đăng tuyển
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 text-sm bg-white p-3 rounded-lg border hover:border hover:border-primary hover:bg-white">
          <div className="flex justify-between gap-5">
            <div className="min-w-[80px] min-h-[80px]">
              <a href="">
                <img src={imgCompany} alt="" />
              </a>
            </div>
            <div className="flex flex-col justify-around gap-1 w-full">
              <div className="flex gap-1 items-center">
                {/* <div className="bg-[#D9BCFF] text-[#6112C9] px-2 rounded-full items-center justify-center">
                  <span className="text-xs font-semibold">HOT</span>
                </div> */}
                <h3>
                  <div
                    href=""
                    className="cursor-pointer line-clamp-1 overflow-hidden text-ellipsis font-medium hover:decoration-primary hover:text-primary hover:underline"
                    onClick={() => {
                      navigate(`/job-detail/`);
                    }}
                  >
                    Chuyên Viên Đào Tạo Ngành F&B (Thu Nhập 15-20 Triệu) Tại Hà
                    Nội
                  </div>
                </h3>
                {/* <a href="">
              <IconHeart className={"w-5 h-5"} liked={""}></IconHeart>
            </a> */}
              </div>
              <div>
                <a
                  href="/company"
                  className="w-fit line-clamp-1 overflow-hidden text-xs text-ellipsis text-text3 hover:decoration-text3 hover:underline"
                >
                  CÔNG TY CỔ PHẦN TẦM NHÌN QUỐC TẾ ALADDIN
                </a>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-5 text-text2 bg-[#EDEAF0] rounded-xl py-[2px]">
                    <span>Thỏa thuận</span>
                  </div>
                  <div className="px-5 text-text2 bg-[#EDEAF0] rounded-xl py-[2px]">
                    <span>88 Tố Hữu, Vạn Phúc, Hà Đông, Hà Nội</span>
                  </div>
                </div>
                {/* <span
                    className={`text-sm font-semibold rounded-xl 
                      "{
                      jobData.postStatus === "ACCEPTED"
                        ? "text-accepted"
                        : jobData.postStatus === "PENDING"
                        ? "text-primary"
                        : "text-rejected"
                    }"
                    `}
                  >
                    ACCEPTED
                  </span> */}
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center justify-center gap-2 bg-error text-white text-sm rounded-xl px-3 py-1 cursor-pointer">
                    <IconDelete className={"w-5 h-5"} color={"#fff"} />
                    <span>Xóa</span>
                  </div>
                  <div
                    className="flex items-center justify-center gap-2 bg-primary text-white text-sm rounded-xl px-3 py-1 cursor-pointer"
                    onClick={() => {
                      navigate(`/job-management/detail`);
                    }}
                  >
                    <IconEye className={"w-5 h-5"} color={"#fff"} />
                    <span>Xem chi tiết</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <PaginationDemo
          PerPage={"newsPerPage"}
          dataBase={"sortedProducts"}
          currentPage={"currentPage"}
          onPageChange={"handlePageChange"}
        ></PaginationDemo>
      </div>
    </div>
  );
};

export default JobPostManagerPage;
