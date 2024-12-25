import React, { useEffect, useState } from "react";
import ReviewJobPost from "./ReviewJobPost";
import CandidateLists from "./CandidateLists";
import axiosInstance from "@/lib/authorizedAxios";
import { useParams } from "react-router-dom";

const JobPostManagerDetailPage = () => {
  const { jobId } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(
          `/job-post/get-job-detail/${jobId}`
        );
        console.log(result);
        setData(result.data.result);
      } catch (error) {
        console.error("Error while fetching job data:", error);
      }
    };
    getData();
  }, []);

  return (
    <div className="space-y-5 mt-5 w-full">
      <ReviewJobPost data={data} />
      <CandidateLists data={data} candidatesLimit={data.candidatesLimit} />
    </div>
  );
};

export default JobPostManagerDetailPage;
