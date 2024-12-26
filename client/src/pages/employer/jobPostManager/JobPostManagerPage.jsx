import React, { useEffect, useState } from "react";
import imgCompany from "@/components/image/imgCompany.png";
import PaginationDemo from "@/components/pagination/Pagination";
import IconDelete from "@/components/icons/IconDelete";
import IconEye from "@/components/icons/IconEye";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/authorizedAxios";
import toast from "react-hot-toast";
import CandidateListSkeleton from "@/components/skeleton/CandidateListSkeleton";
import IconPrice from "@/components/icons/IconPrice";
import FormatDate from "@/components/format/FormatDate";

const JobPostManagerPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reRender, setReRender] = useState(0);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(10);
  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentJobData = data.slice(indexOfFirstItem, indexOfLastItem);
  const isPastDeadline = (applicationDeadline) => {
    const deadline = new Date(applicationDeadline); // Chuyển đổi thành Date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Chỉ giữ phần ngày, bỏ giờ
    return deadline < today;
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(
          `/job-post/get-job-posts-by-recruiter`
        );
        // console.log(result.data.result);
        setData(result.data.result);
        setIsLoading(true);
      } catch (error) {
        console.error("Error while fetching job data:", error);
      }
    };
    getData();
  }, [reRender]);
  // console.log(data);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const result = await axiosInstance.delete(
        `/job-post/delete-job-post/${jobId}`
      );
      // console.log(result);
      toast.success("Xóa việc làm thành công");
      setReRender((prev) => prev + 1);
    } catch (error) {
      toast.error("Xóa việc làm thất bại");
      console.error("Error while deleting job:", error);
    }
  };

  return (
    <div className="bg-secondary rounded-xl py-5 px-16 text-sm">
      <div className="flex items-center gap-4 mb-5">
        <p className="">
          Danh sách{" "}
          <span className="font-semibold text-primary">{data.length}</span> việc
          việc làm đã đăng tuyển
        </p>
      </div>
      <div className="flex flex-col gap-5">
        {isLoading
          ? currentJobData.map((item, index) => (
              <div
                className="flex flex-col gap-5 text-sm bg-white p-3 rounded-lg border hover:border hover:border-primary hover:bg-white"
                key={index}
              >
                <div className="flex justify-between gap-5">
                  <div className="border rounded-lg">
                    <img
                      src={item.jobImage ? item.jobImage : imgCompany}
                      alt=""
                      className="overflow-hidden object-cover min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col justify-around gap-1 w-full">
                    <div className="flex gap-1 items-center justify-between">
                      <h3 className="line-clamp-1 text-ellipsis font-medium">
                        {item.jobTitle}
                      </h3>
                      <div className="flex items-center justify-center gap-2">
                        <div className="bg-primary p-1 rounded-full">
                          <IconPrice
                            className={"w-4 h-4"}
                            color={"#fff"}
                          ></IconPrice>
                        </div>
                        <span>{item.jobSalary}</span>
                      </div>
                    </div>
                    <div>
                      <span className="line-clamp-1 text-sm text-ellipsis uppercase text-text3">
                        {item.orgName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="px-5 text-text2 bg-[#EDEAF0] rounded-xl py-[2px] max-w-80 line-clamp-1 text-xs text-center">
                          <span>
                            {isPastDeadline(item.applicationDeadline) ? (
                              <span className="text-red-500">
                                Hạn nộp đã qua
                              </span>
                            ) : (
                              <span>
                                {FormatDate.formatDate(
                                  item.applicationDeadline
                                )}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="px-5 text-text2 bg-[#EDEAF0] rounded-xl py-[2px] max-w-64 line-clamp-1 text-xs text-center">
                          <span>{item.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="flex items-center justify-center gap-2 bg-error text-white text-sm rounded-xl px-3 py-1 cursor-pointer"
                          onClick={() => handleDeleteJob(item._id)}
                        >
                          <IconDelete className={"w-5 h-5"} color={"#fff"} />
                          <span>Xóa</span>
                        </div>
                        <div
                          className="flex items-center justify-center gap-2 bg-primary text-white text-sm rounded-xl px-3 py-1 cursor-pointer"
                          onClick={() => {
                            navigate(`/job-management/detail/${item._id}`);
                          }}
                        >
                          <IconEye className={"w-5 h-5"} color={"#fff"} />
                          <span>Xem chi tiết</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : [...Array(newsPerPage)].map((_, index) => (
              <CandidateListSkeleton key={index} />
            ))}
      </div>
      {data.length > newsPerPage ? (
        <div className="mt-5">
          <PaginationDemo
            PerPage={newsPerPage}
            dataBase={data}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </div>
  );
};

export default JobPostManagerPage;
