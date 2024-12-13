import React, { useEffect, useState } from "react";
import Button from "@/components/button/Button";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "@/lib/authorizedAxios";
const CaculatorGithubPage = () => {
  const [jobPostId, setJobPostId] = useState("");
  const [token, setToken] = useState("");
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const jobPostId = queryParams.get("jobPostId");
    setToken(token);
    setJobPostId(jobPostId);
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="w-[500px] h-[500px] flex flex-col items-center justify-center bg-secondary rounded-lg shadow-lg p-5 m-10 gap-5">
        <h1 className="text-2xl font-bold">
          Bạn đã cho phép quyền truy cập Github
        </h1>
        <p className="text-center text-primary">
          Hãy quay về trang ứng tuyển để hoàn tất việc ứng tuyển.
        </p>
        <div className="flex items-center justify-center">
          <Link to={`/job-detail/${jobPostId}?token=${token}`}>
            <Button kind="primary" className="px-10">
              Quay về trang ứng tuyển
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaculatorGithubPage;
