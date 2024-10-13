import ItemJobUploaded from "@/components/itemJob/ItemJobUploaded";
import NavbarEmployer from "@/components/navbarEmployer/NavbarEmployer";
import PaginationDemo from "@/components/pagination/Pagination";
import Panel from "@/components/panel/Panel";
import React from "react";

const JobPostManagerPage = () => {

  return (
    <div className="page-container relative mt-5">
      {/* Panel section */}
      <Panel
        title={"Việc làm đã đăng tuyển"}
        children={"Xem lại các việc làm đã đăng tuyển dụng"}
        className={"sticky top-[84px] z-40"}
      />
      <div className="custom-panel"></div>
      <div className="grid grid-cols-12 gap-5">
        <div className="sticky top-[208px] left-0 h-[calc(100vh-208px)] overflow-y-auto grid col-start-1 col-end-4 border-2 border-primary bg-secondary rounded-t-xl fixed-navbar">
          <NavbarEmployer />
        </div>
        {/* Form section */}
        <div className="grid col-start-4 col-end-13 w-full gap-5 bg-secondary">
          <div className="p-10">
            <div className="flex items-center gap-4 mb-5">
              <p className="">
                Danh sách{" "}
                <span className="font-semibold text-primary">{"6"}</span> việc
                việc làm đã đăng tuyển:
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
      </div>
    </div>
  );
};

export default JobPostManagerPage;
