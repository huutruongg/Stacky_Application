import React, { useState } from "react";
import PaginationDemo from "@/components/pagination/Pagination";
import YouCanInterested from "@/components/youCanInterested/YouCanInterested";
import ImgHome from "@/components/image/imgHome.png";
import SearchJob from "@/components/shared/searchJob/SearchJob";
import ItemJobSuggest from "@/components/itemJob/ItemJobSuggest";

const SearchJobPage = () => {
  const [jobData, setJobData] = useState([]); // State for job data
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(10); // Items per page, set to 10

  // Pagination logic
  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentJobData = jobData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  // Function to update job data after search
  const handleSearchResults = (data) => {
    setJobData(data);
    setCurrentPage(1); // Reset to the first page after search
  };

  return (
    <div className="">
      <div className="relative flex justify-center">
        <img src={ImgHome} alt="Home" className="w-full h-full object-fill" />
        <div className="absolute flex top-20">
          <SearchJob onSearchResults={handleSearchResults} />
          {/* Pass callback */}
        </div>
      </div>
      <div className="page-container grid grid-cols-12 gap-7 my-10">
        <div className="grid col-start-1 col-end-9 h-fit rounded-xl bg-secondary">
          <div className="p-10">
            <div className="flex items-center gap-3 mb-5">
              <p>
                Danh sách{" "}
                <span className="font-semibold text-primary">
                  {jobData.length}
                </span>{" "}
                việc làm đã tìm thấy:
              </p>
            </div>
            <div className="flex flex-col gap-5">
              {currentJobData.length > 0 ? (
                currentJobData.map((item, index) => (
                  <ItemJobSuggest jobData={item} key={index} />
                ))
              ) : (
                <p>Không có kết quả tìm kiếm</p>
              )}
            </div>
            <div className="mt-5">
              <PaginationDemo
                PerPage={newsPerPage}
                dataBase={jobData}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
        <div className="grid col-start-9 col-end-13 gap-7 h-fit">
          <YouCanInterested />
        </div>
      </div>
    </div>
  );
};

export default SearchJobPage;
