import React, { useEffect, useState } from "react";
import YouCanInterested from "@/components/youCanInterested/YouCanInterested";
import PaginationDemo from "@/components/pagination/Pagination";
import ItemJobUploaded from "@/components/itemJob/ItemJobUploaded";
import { fetchData } from "@/api/fetchData";
import useAuth from "@/hooks/useAuth";

const CvUploadedPage = () => {
  const { user } = useAuth();
  const [jobData, setJobData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(12);
  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentJobData = jobData.slice(indexOfFirstItem, indexOfLastItem);
  const { countAccepted, countPending, countRejected } =
    jobData?.reduce(
      (acc, item) => {
        if (item.status === "ACCEPTED") {
          acc.countAccepted += 1;
        } else if (item.status === "PENDING") {
          acc.countPending += 1;
        } else if (item.status === "REJECTED") {
          acc.countRejected += 1;
        }
        return acc;
      },
      { countAccepted: 0, countPending: 0, countRejected: 0 }
    ) || {};

  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  useEffect(() => {
    const getData = async () => {
      try {
        // Gọi API với type là 'job-postings' và phân trang
        const result = await fetchData(`job-post/get-job-applied`);
        setJobData(result); // Giả sử API trả về dữ liệu trong result.data
        // console.log(result);

        setIsLoading(false);
      } catch (error) {
        console.error("Error while fetching jobs data:", error);
        setError(error); // Cập nhật lỗi
        setIsLoading(false);
      }
    };
    getData();
  }, []);

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
              <span className="font-semibold text-primary">
                {currentJobData.length}
              </span>{" "}
              việc làm đã ứng tuyển:
            </p>
            <span className="text-sm font-semibold text-accepted rounded-md">
              {countAccepted} Đã đăng bài
            </span>
            <span className="text-sm font-semibold text-primary rounded-md">
              {countPending} Chờ xét duyệt
            </span>
            <span className="text-sm font-semibold text-rejected rounded-md">
              {countRejected} Không được duyệt
            </span>
          </div>
          <div className="flex flex-col gap-5">
            {currentJobData.length > 0 &&
              currentJobData.map((item, index) => (
                <ItemJobUploaded jobData={item} key={index} />
              ))}
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
      </div>
      <div className="grid col-start-9 col-end-13 gap-7 h-fit">
        <YouCanInterested></YouCanInterested>
      </div>
    </div>
  );
};

export default CvUploadedPage;
