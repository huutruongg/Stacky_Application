// SearchJobPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PaginationDemo from "@/components/pagination/Pagination";
import YouCanInterested from "@/components/youCanInterested/YouCanInterested";
import ImgHome from "@/components/image/imgHome.png";
import ItemJobSuggest from "@/components/itemJob/ItemJobSuggest";
import { fetchData } from "@/api/fetchData";
import SearchJob from "@/components/shared/searchJob/SearchJob";

const SearchJobPage = () => {
  const [jobData, setJobData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(10); // Items per page, set to 10
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // Access the current URL

  // Extract query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const keySearch = queryParams.get("keySearch") || "";
  const industry = queryParams.get("industry") || "";
  const locationParam = queryParams.get("location") || "";

  // Fetch job data when the page loads or when search parameters change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const result = await fetchData(
          `job-posting/search-job-postings?keySearch=${encodeURIComponent(
            keySearch
          )}&industry=${encodeURIComponent(
            industry
          )}&location=${encodeURIComponent(locationParam)}`
        );
        setJobData(result);
      } catch (error) {
        console.error("Error while fetching jobs data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [keySearch, industry, locationParam]); // Trigger fetch when search parameters change

  // Pagination logic
  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentJobData = jobData.slice(
    indexOfFirstItem,
    indexOfFirstItem + newsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="">
      <div className="relative flex justify-center">
        <img src={ImgHome} alt="Home" className="w-full h-full object-fill" />
        <div className="absolute flex top-20">
          <SearchJob /> {/* You can still use the SearchJob component here */}
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
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="flex flex-col gap-5">
                {currentJobData.length > 0 ? (
                  currentJobData.map((item, index) => (
                    <ItemJobSuggest jobData={item} key={index} />
                  ))
                ) : (
                  <p>Không có kết quả tìm kiếm</p>
                )}
              </div>
            )}
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
