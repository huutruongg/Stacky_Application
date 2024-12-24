import React, { useEffect, useState } from "react";
import Buttonchild from "@/components/button/Buttonchild";
import IconPrice from "@/components/icons/IconPrice";
import imgCompany from "@/components/image/imgCompany.png";
import axiosInstance from "@/lib/authorizedAxios";
import useAuth from "@/hooks/useAuth";
import { useParams } from "react-router-dom";
import PaginationDemo from "@/components/pagination/Pagination";

const SearchJobPosition = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [jobData, setJobData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(6);

  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentJobData = jobData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(
          `/job-post/get-related-job-posts?jobTitle=&location=&yearsOfExperience=`
        );
        console.log(result.data.result);
        setJobData(result.data.result);
        setIsLoading(false);
      } catch (error) {
        console.error("Error while fetching jobs data:", error);
        setError(error);
        setIsLoading(false);
      }
    };
    getData();
  }, [currentPage]);

  console.log(jobData);

  return (
    <div className="">
      <div className="py-2 rounded-tl-xl rounded-tr-xl text-transparent bg-gradient-to-r from-[#48038C] to-[#e59fff]">
        <h3 className="text-xl ml-5 text-white">Vị trí tuyển dụng</h3>
      </div>
      <div className="p-5 bg-secondary flex flex-col gap-5">
        {currentJobData.map((item) => (
          <JobCard key={item._id} item={item} user={user} />
        ))}
        {jobData.length > 0 && (
          <div className="mt-5">
            <PaginationDemo
              PerPage={newsPerPage}
              dataBase={jobData}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const JobCard = ({ item }) => {
  return (
    <div className="flex flex-col gap-5 bg-white p-5 rounded-lg border hover:border hover:border-primary">
      <div className="flex justify-between items-center gap-4">
        <div className="flex justify-between items-center">
          <a href="">
            <img
              src={item?.jobImage ? item?.jobImage : imgCompany}
              alt=""
              className="overflow-hidden object-cover min-w-[100px] min-h-[100px] max-w-[100px] max-h-[100px] border rounded-md"
            />
          </a>
        </div>
        <div className="flex flex-col justify-center gap-2 w-full">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-3">
              <div className="bg-[#D9BCFF] text-[#6112C9] px-2 rounded-full items-center justify-center">
                <span className="text-xs font-semibold">HOT</span>
              </div>
              <h3 className="line-clamp-1 font-medium text-ellipsis max-w-[330px] hover:text-primary">
                <a href="" title={item?.jobTitle}>
                  {item?.jobTitle}
                </a>
              </h3>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-primary p-1 rounded-full">
                <IconPrice className={"w-4 h-4"} color={"#fff"} />
              </div>
              <span>{item?.jobSalary}</span>
            </div>
          </div>
          <div className="line-clamp-1 text-sm text-ellipsis text-text3 hover:decoration-text3 hover:underline">
            <a href="" title={item?.orgName}>
              {item?.orgName}
            </a>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div
                className="text-sm line-clamp-1 max-w-36 px-5 py-px text-text2 bg-[#EDEAF0] rounded-xl"
                title={item?.location}
              >
                <span>{item?.location}</span>
              </div>
              <div
                className="text-sm line-clamp-1 max-w-60 px-5 py-px text-text2 bg-[#EDEAF0] rounded-xl"
                title={item?.location}
              >
                <span>{item?.location}</span>
              </div>
            </div>
            <a href={`/job-detail/${item?._id}`} className="flex items-center">
              <Buttonchild kind="primary" className="text-sm px-5 py-1">
                Ứng tuyển
              </Buttonchild>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchJobPosition;
