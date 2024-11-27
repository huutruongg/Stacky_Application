import React, { useEffect, useState } from "react";
import ItemJobSuggest from "@/components/itemJob/ItemJobSuggest";
import TitleField from "@/components/titleField/TitleField";
import PaginationDemo from "@/components/pagination/Pagination";
import { fetchData } from "@/api/fetchData";
import JobSkeleton from "@/components/skeleton/JobSkeleton";
import useAuth from "@/hooks/useAuth";

const JobsInteresting = () => {
  const { user } = useAuth();
  const [jobData, setJobData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(12);
  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentJobData = jobData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const getData = async () => {
      try {
        // Gọi API với type là 'job-postings' và phân trang
        if (user) {
          if (user.role === "CANDIDATE") {
            const result = await fetchData(`job-post/get-all-by-candidate`);
            setJobData(result); // Giả sử API trả về dữ liệu trong result.data
          } else {
            const result = await fetchData(`job-post/get-all`);
            setJobData(result); // Giả sử API trả về dữ liệu trong result.data
          }
        } else {
          const result = await fetchData(`job-post/get-all`);
          setJobData(result); // Giả sử API trả về dữ liệu trong result.data
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error while fetching jobs data:", error);
        setError(error); // Cập nhật lỗi
        setIsLoading(false);
      }
    };
    getData();
  }, [currentPage]); // Thêm currentPage vào mảng phụ thuộc
  // console.log(jobData);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="mb-10">
      <TitleField>Công việc hấp dẫn</TitleField>
      <div className="grid grid-cols-3 items-center gap-5">
        {isLoading ? (
          [...Array(newsPerPage)].map((_, index) => <JobSkeleton key={index} />)
        ) : currentJobData.length > 0 ? (
          currentJobData.map((item, index) => (
            <ItemJobSuggest jobData={item} key={index}></ItemJobSuggest>
          ))
        ) : (
          <div>Không có dữ liệu</div>
        )}
      </div>
      {jobData.length > newsPerPage ? (
        <div className="mt-5">
          <PaginationDemo
            PerPage={newsPerPage}
            dataBase={jobData}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </div>
  );
};

export default JobsInteresting;
