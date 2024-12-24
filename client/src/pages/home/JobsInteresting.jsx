import React, { useEffect, useState } from "react";
import ItemJobSuggest from "@/components/itemJob/ItemJobSuggest";
import TitleField from "@/components/titleField/TitleField";
import PaginationDemo from "@/components/pagination/Pagination";
import { fetchData } from "@/api/fetchData";
import JobSkeleton from "@/components/skeleton/JobSkeleton";
import useAuth from "@/hooks/useAuth";

const JobsInteresting = () => {
  const { user } = useAuth(); // user sẽ là null nếu chưa đăng nhập
  const [jobData, setJobData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(12);
  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentJobData = jobData.slice(indexOfFirstItem, indexOfLastItem);

  console.log("User:", user);

  useEffect(() => {
    const getData = async () => {
      try {
        let result;
        if (!user) {
          // Khi chưa đăng nhập
          result = await fetchData(`job-post/get-all`);
        } else if (user.role === "CANDIDATE") {
          // Khi đăng nhập và role là CANDIDATE
          result = await fetchData(`job-post/get-all-by-candidate`);
        } else {
          // Khi đăng nhập và role khác
          result = await fetchData(`job-post/get-all`);
        }
        setJobData(result); // Cập nhật dữ liệu công việc
        setIsLoading(false);
      } catch (error) {
        console.error("Error while fetching jobs data:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    getData();
  }, [currentPage, user]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
            <ItemJobSuggest logined={user ? true : false} jobData={item} key={index}></ItemJobSuggest>
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
