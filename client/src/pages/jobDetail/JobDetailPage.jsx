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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isliked, setIsliked] = useState(true);

  // console.log(isliked);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axiosInstance.get(
          `/job-posting/job-detail/${user.userId}/${jobId}`
        ); // API URL
        // console.log(response.data.result);

        setData(response.data.result); // Cập nhật dữ liệu
        setIsliked(response.data.isLiked);
        setLoading(false); // Đặt loading thành false
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error); // Cập nhật lỗi
        setLoading(false); // Đặt loading thành false
      }
    };

    loadData();
  }, [jobId]); // Chạy khi component mount

  if (loading) return <div>Loading...</div>;
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
          <CompanyInfo />
          <GeneralInfo jobData={data} />
          <JobSuggest />
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
