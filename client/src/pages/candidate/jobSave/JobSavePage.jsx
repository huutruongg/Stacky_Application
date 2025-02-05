import React, { useState } from "react";
import ItemJobSave from "@/components/itemJob/ItemJobSave";
import YouCanInterested from "@/components/youCanInterested/YouCanInterested";
import PaginationDemo from "@/components/pagination/Pagination";
import { useJobSave } from "@/components/context/JobSaveProvider";

const JobSavePage = () => {
  const { jobSaveData = [], isLoading, error: jobSaveError } = useJobSave(); // Set default value to avoid undefined
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(5);

  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentSaveJobData = jobSaveData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) return <div>Loading...</div>;
  if (jobSaveError) return <div>Error: {jobSaveError.message}</div>;

  return (
    <div className="page-container grid grid-cols-12 gap-7 my-10">
      <div className="grid col-start-1 col-end-9 h-fit rounded-xl bg-secondary">
        <div className="flex flex-col justify-center gap-2 text-white bg-gradient-to-r from-[#48038C] to-[#8d2eb3] p-10 rounded-t-xl">
          <h2 className="text-2xl font-semibold">Việc làm đã lưu</h2>
          <p>
            Xem lại danh sách những việc làm mà bạn đã lưu trước đó. Ứng tuyển
            ngay để không bỏ lỡ cơ hội nghề nghiệp dành cho bạn.
          </p>
        </div>
        <div className="px-10 py-5">
          <p className="mb-5 font-medium">
            Danh sách <span className="text-error">{jobSaveData.length}</span>{" "}
            việc làm đã lưu
          </p>
          <div className="flex flex-col gap-5">
            {currentSaveJobData.length > 0 ? (
              currentSaveJobData.map((item, index) => (
                <ItemJobSave jobData={item} key={index} />
              ))
            ) : (
              <p>Không có việc làm nào trong danh sách lưu.</p>
            )}
          </div>
          {jobSaveData.length > newsPerPage ? (
            <div className="mt-5">
              <PaginationDemo
                PerPage={newsPerPage}
                dataBase={jobSaveData}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="grid col-start-9 col-end-13 gap-7 h-fit">
        <YouCanInterested />
      </div>
    </div>
  );
};

export default JobSavePage;
