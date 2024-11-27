import React, { useEffect, useState } from "react";
import Buttonchild from "@/components/button/Buttonchild";
import IconPrice from "@/components/icons/IconPrice";
import imgCompany from "@/components/image/imgCompany.png";
import IconHeart from "@/components/icons/IconHeart";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/authorizedAxios";
import useAuth from "@/hooks/useAuth";
import { useParams } from "react-router-dom";
import FormatCurrency from "@/components/format/FormatCurrency";
const SearchJobPosition = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [liked, setLiked] = useState("jobData.isLiked");
  const [jobData, setJobData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(12);
  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentJobData = jobData.slice(indexOfFirstItem, indexOfLastItem);
  const checkCompany = jobData.filter((job) => {
    return job._id === id;
  });

  // console.log(currentJobData);

  const handleHeartClick = () => {
    if (liked) {
      handleDeleteSaveJob();
    } else {
      handleSaveJob();
    }
  };

  const handleSaveJob = async () => {
    try {
      await axiosInstance.post(`/job-post/save-job-post/${jobData._id}`);
      toast.success("Lưu bài viết thành công");
      setLiked(true); // Update the liked state
    } catch (error) {
      toast.error("Lưu bài viết thất bại");
    }
  };

  const handleDeleteSaveJob = async () => {
    try {
      await axiosInstance.delete(`/job-post/unsave-job-post/${jobData._id}`);
      toast.success("Xóa bài viết thành công");
      setLiked(false); // Update the liked state
    } catch (error) {
      toast.error("Xóa bài viết thất bại");
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        // Gọi API với type là 'job-postings' và phân trang
        if (user) {
          if (user.role === "CANDIDATE") {
            const result = await axiosInstance.get(
              `job-post/get-all-by-candidate`
            );
            setJobData(result.data.result); // Giả sử API trả về dữ liệu trong result.data
          } else {
            const result = await axiosInstance.get(`job-post/get-all`);
            setJobData(result.data.result); // Giả sử API trả về dữ liệu trong result.data
          }
        } else {
          const result = await axiosInstance.get(`job-post/get-all`);
          setJobData(result.data.result); // Giả sử API trả về dữ liệu trong result.data
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error while fetching jobs data:", error);
        setError(error); // Cập nhật lỗi
        setIsLoading(false);
      }
    };
    getData();
  }, [currentPage]);

  return (
    <div className="">
      <div className="py-2 rounded-tl-xl rounded-tr-xl text-transparent bg-gradient-to-r from-[#48038C] to-[#e59fff]">
        <h3 className="text-xl ml-5 text-white">Vị trí tuyển dụng</h3>
      </div>
      <div className="p-5 bg-secondary">
        <div className="flex flex-col gap-5 bg-white p-5 rounded-lg border hover:border hover:border-primary">
          <div className="flex justify-between items-center gap-4">
            <div className="flex justify-between items-center w-[100px] h-[100px]">
              <a href="">
                <img
                  src={
                    checkCompany?.jobImage ? checkCompany?.jobImage : imgCompany
                  }
                  alt=""
                  className="min-w-[100px] min-h-[100px] rounded-md border"
                />
              </a>
            </div>
            <div className="flex flex-col justify-center gap-2 w-full">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-3">
                  <div className="bg-[#D9BCFF] text-[#6112C9] px-2 rounded-full items-center justify-center">
                    <span className="text-xs font-semibold">HOT</span>
                  </div>
                  <h3 className="line-clamp-1 overflow-hidden font-medium text-ellipsis max-w-[330px] hover:text-primary">
                    <a href="" title={checkCompany.jobTitle}>
                      {checkCompany.jobTitle}
                    </a>
                  </h3>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="bg-primary p-1 rounded-full">
                    <IconPrice className={"w-4 h-4"} color={"#fff"}></IconPrice>
                  </div>
                  <span>{FormatCurrency(checkCompany.jobSalary)}</span>
                </div>
              </div>
              <div className="line-clamp-1 overflow-hidden text-sm text-ellipsis text-text3 hover:decoration-text3 hover:underline">
                <a href="" title={checkCompany.orgName}>
                  {checkCompany.orgName}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="text-sm line-clamp-1 overflow-hidden max-w-40 px-5 py-px text-text2 bg-[#EDEAF0] rounded-xl">
                    <span>{checkCompany.location}</span>
                  </div>
                  <div className="text-sm line-clamp-1 overflow-hidden max-w-60 px-5 py-px text-text2 bg-[#EDEAF0] rounded-xl">
                    <span>Còn 68 ngày để ứng tuyển</span>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <Buttonchild kind="primary" className="px-5 py-1">
                    Ứng tuyển
                  </Buttonchild>
                  <div
                    className="z-10 hover:cursor-pointer"
                    onClick={handleHeartClick}
                  >
                    <IconHeart className="w-5 h-5" liked={liked} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchJobPosition;
