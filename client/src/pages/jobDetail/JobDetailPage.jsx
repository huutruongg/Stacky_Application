import React, { useEffect, useState } from "react";
import SearchJob from "@/components/shared/searchJob/SearchJob";
import CompanyInfo from "./CompanyInfo";
import GeneralInfo from "./GeneralInfo";
import JobSuggest from "./JobSuggest";
import JobSummary from "./JobSummary";
import JobDescription from "./JobDescription";
import JobContact from "./JobContact";
import axiosInstance from "@/lib/authorizedAxios";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const JobDetailPage = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isliked, setIsliked] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user) {
          console.log(user);
          const response = await axiosInstance.get(
            `/job-post/get-job-detail/${jobId}`
          );
          setData(response.data.result); // Cập nhật dữ liệu
          setIsliked(response.data.isLiked);
          setIsLoading(false); // Đặt loading thành false
        } else {
          const response = await axiosInstance.get(
            `/job-post/get-job-detail-by-candidate/${jobId}`
          ); // API URL
          setData(response.data.result); // Cập nhật dữ liệu
          setIsliked(response.data.isLiked);
          setIsLoading(false); // Đặt loading thành false
        }
        // console.log(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error); // Cập nhật lỗi
        setIsLoading(false); // Đặt loading thành false
      }
    };

    loadData();
  }, [jobId, isliked]); // Chạy khi component mount

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-center items-center bg-primary py-4">
        <SearchJob />
      </div>
      <div className="page-container grid grid-cols-12 gap-7 py-10">
        <div className="grid col-start-1 col-end-9 gap-7 h-fit">
          <JobSummary jobData={data} isliked={isliked} />
          <JobDescription jobData={data} isliked={isliked} />
          <JobContact jobData={data} />
        </div>
        <div className="grid col-start-9 col-end-13 gap-7 h-fit">
          <CompanyInfo data={data} />
          <GeneralInfo jobData={data} />
          <JobSuggest jobData={data} logined={user ? true : false} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
