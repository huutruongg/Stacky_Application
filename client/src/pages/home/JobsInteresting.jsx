import React, { useEffect, useState } from "react";
import ItemJobSuggest from "@/components/itemJob/ItemJobSuggest";
import TitleField from "@/components/titleField/TitleField";
import PaginationDemo from "@/components/pagination/Pagination";
import { fetchData } from "@/api/fetchData";
import JobSkeleton from "@/components/skeleton/JobSkeleton";

const JobsInteresting = () => {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(12);
  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentJobData = jobData.slice(indexOfFirstItem, indexOfLastItem);

  // console.log(currentJobData);

  useEffect(() => {
    const getData = async () => {
      try {
        // Gọi API với type là 'job-postings' và phân trang
        const result = await fetchData(`job-posting/job-postings`);
        setJobData(result); // Giả sử API trả về dữ liệu trong result.data
        setLoading(false);
      } catch (error) {
        console.error("Error while fetching jobs data:", error);
        setError(error); // Cập nhật lỗi
        setLoading(false);
      }
    };
    getData();
  }, [currentPage]); // Thêm currentPage vào mảng phụ thuộc
  // console.log(jobData);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  if (loading) {
    return (
      <div className="mb-10">
        <TitleField>Công việc hấp dẫn</TitleField>
        <div className="grid grid-cols-3 items-center gap-5">
          {[...Array(newsPerPage)].map((_, index) => (
            <JobSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="mb-10">
      <TitleField>Công việc hấp dẫn</TitleField>
      <div className="grid grid-cols-3 items-center gap-5">
        {currentJobData.length > 0 &&
          currentJobData.map((item, index) => (
            <ItemJobSuggest jobData={item} key={index}></ItemJobSuggest>
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
  );
};

export default JobsInteresting;
