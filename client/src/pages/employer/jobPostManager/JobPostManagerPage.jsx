import React, { useEffect, useState } from "react";
import imgCompany from "@/components/image/imgCompany.png";
import PaginationDemo from "@/components/pagination/Pagination";
import IconDelete from "@/components/icons/IconDelete";
import IconEye from "@/components/icons/IconEye";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/authorizedAxios";
import FormatCurrency from "@/components/format/FormatCurrency";
import toast from "react-hot-toast";

const JobPostManagerPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reRender, setReRender] = useState(0);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(10);
  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentJobData = data.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(
          `/job-post/get-job-posts-by-recruiter`
        );
        // console.log(result.data.result);
        setData(result.data.result);
        setLoading(true);
      } catch (error) {
        console.error("Error while fetching job data:", error);
      }
    };
    getData();
  }, [reRender]);
  console.log(data);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const result = await axiosInstance.delete(
        `/job-post/delete-job-post/${jobId}`
      );
      console.log(result);
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
        {currentJobData.map((item, index) => (
          <div
            className="flex flex-col gap-5 text-sm bg-white p-3 rounded-lg border hover:border hover:border-primary hover:bg-white"
            key={index}
          >
            <div className="flex justify-between gap-5">
              <div className="min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] border rounded-lg">
                <a href="" className="rounded-lg">
                  <img
                    src={item.jobImage ? item.jobImage : imgCompany}
                    alt=""
                    className="rounded-lg"
                  />
                </a>
              </div>
              <div className="flex flex-col justify-around gap-1 w-full">
                <div className="flex gap-1 items-center justify-between">
                  <h3>
                    <div
                      href=""
                      className="cursor-pointer line-clamp-1 overflow-hidden text-ellipsis font-medium hover:decoration-primary hover:text-primary hover:underline"
                      onClick={() => {
                        navigate(`/job-detail/`);
                      }}
                    >
                      {item.jobTitle}
                    </div>
                  </h3>
                  <span className="text-primary font-semibold mr-5">
                    {FormatCurrency(item.jobSalary)}
                  </span>
                </div>
                <div>
                  <a
                    href="/company"
                    className="w-fit line-clamp-1 overflow-hidden text-xs text-ellipsis text-text3 hover:decoration-text3 hover:underline"
                  >
                    {item.orgName}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="px-5 text-text2 bg-[#EDEAF0] rounded-xl py-[2px]">
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
        ))}
      </div>
      <div className="mt-5">
        <PaginationDemo
          PerPage={newsPerPage}
          dataBase={data}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default JobPostManagerPage;
