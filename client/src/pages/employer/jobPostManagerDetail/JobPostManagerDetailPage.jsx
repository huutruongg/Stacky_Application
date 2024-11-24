import React, { useEffect, useState } from "react";
import ReviewJobPost from "./ReviewJobPost";
import CandidateLists from "./CandidateLists";
import axiosInstance from "@/lib/authorizedAxios";
import { useParams } from "react-router-dom";

const JobPostManagerDetailPage = () => {
  const { jobId } = useParams();
  const [data, setData] = useState([]);
  const [dataCandidate, setDataCandidate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reRender, setReRender] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(
          `/job-post/get-job-detail/${jobId}`
        );
        const resultCandidate = await axiosInstance.get(
          `/recruiter/get-candidates-applied/${jobId}`
        );
        // console.log(result.data.result);
        setData(result.data.result);
        setDataCandidate(resultCandidate.data.result);
        console.log(resultCandidate.data.result);

        setLoading(true);
      } catch (error) {
        console.error("Error while fetching job data:", error);
      }
    };
    getData();
  }, [reRender]);

  return (
    <div className="space-y-5 mt-5 w-full">
      <ReviewJobPost data={data} />
      <CandidateLists />
    </div>
  );
};

export default JobPostManagerDetailPage;
