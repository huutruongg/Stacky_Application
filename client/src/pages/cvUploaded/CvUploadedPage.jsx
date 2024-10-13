import React from "react";
import YouCanInterested from "@/components/youCanInterested/YouCanInterested";
import PaginationDemo from "@/components/pagination/Pagination";
import ItemJobUploaded from "@/components/itemJob/ItemJobUploaded";

const CvUploadedPage = () => {
  return (
    <div className="page-container grid grid-cols-12 gap-7 my-10">
      <div className="grid col-start-1 col-end-9 h-fit rounded-xl bg-secondary">
        <div className="flex flex-col justify-center gap-2 text-white bg-gradient-to-r from-[#48038C] to-[#8d2eb3] p-10 rounded-t-xl">
          <h2 className="text-2xl font-semibold">Hồ sơ ứng tuyển</h2>
          <p>Xem lại danh sách những việc làm mà bạn ứng tuyển trước đó.</p>
        </div>
        <div className="p-10">
          <div className="flex items-center gap-3 mb-5">
            <p className="">
              Danh sách{" "}
              <span className="font-semibold text-primary">{"6"}</span> việc làm
              đã ứng tuyển:
            </p>
            <span className="text-sm font-semibold text-accepted rounded-md">
              {"3"} Đã đăng bài
            </span>
            <span className="text-sm font-semibold text-primary rounded-md">
              {"2"} Chờ xét duyệt
            </span>
            <span className="text-sm font-semibold text-rejected rounded-md">
              {"2"} Không được duyệt
            </span>
          </div>
          <div className="flex flex-col gap-5">
            <ItemJobUploaded></ItemJobUploaded>
            <ItemJobUploaded></ItemJobUploaded>
            <ItemJobUploaded></ItemJobUploaded>
            <ItemJobUploaded></ItemJobUploaded>
            <ItemJobUploaded></ItemJobUploaded>
            <ItemJobUploaded></ItemJobUploaded>
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
      </div>
      <div className="grid col-start-9 col-end-13 gap-7 h-fit">
        <YouCanInterested></YouCanInterested>
      </div>
    </div>
  );
};

export default CvUploadedPage;
