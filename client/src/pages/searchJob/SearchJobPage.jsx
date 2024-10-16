import PaginationDemo from "@/components/pagination/Pagination";
import YouCanInterested from "@/components/youCanInterested/YouCanInterested";
import ImgHome from "@/components/image/imgHome.png";
import React, { useEffect, useState } from "react";
import SearchJob from "@/components/shared/searchJob/SearchJob";
import { fetchData } from "@/api/fetchData";
import ItemJobSuggest from "@/components/itemJob/ItemJobSuggest";

const SearchJobPage = () => {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(10);
  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentJobData = jobData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  useEffect(() => {
    const getData = async () => {
      try {
        // Gọi API với type là 'job-postings' và phân trang
        const result = await fetchData(
          `job-posting/search-job-postings?keySearch=${""}&industry=${""}&location=${""}`
        );
        setJobData(result); // Giả sử API trả về dữ liệu trong result.data

        setLoading(false);
      } catch (error) {
        console.error("Error while fetching jobs data:", error);
        setError(error); // Cập nhật lỗi
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <div className="">
      <div className="relative flex justify-center">
        <img src={ImgHome} alt="" className="w-full h-full object-fill" />
        <div className="absolute flex top-20">
          <SearchJob jobData={jobData}></SearchJob>
        </div>
      </div>
      <div className="page-container grid grid-cols-12 gap-7 my-10">
        <div className="grid col-start-1 col-end-9 h-fit rounded-xl bg-secondary">
          <div className="p-10">
            <div className="flex items-center gap-3 mb-5">
              <p className="">
                Danh sách{" "}
                <span className="font-semibold text-primary">{"6"}</span> việc
                làm đã ứng tuyển:
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
              {currentJobData.length > 0 &&
                currentJobData.map((item, index) => (
                  <ItemJobSuggest jobData={item} key={index} />
                ))}
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
          <YouCanInterested></YouCanInterested>
        </div>
      </div>
    </div>
  );
};

export default SearchJobPage;
