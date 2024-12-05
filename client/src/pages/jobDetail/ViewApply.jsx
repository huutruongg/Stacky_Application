import Button from "@/components/button/Button";
import axiosInstance from "@/lib/authorizedAxios";
import React, { useCallback, useEffect, useState } from "react";

const ViewApply = ({ id }) => {
  const [isGithubLoggedIn, setIsGithubLoggedIn] = useState(false);

  console.log(isGithubLoggedIn);
  useEffect(() => {
    const getGithubScore = async () => {
      try {
        const res = await axiosInstance.get("/github/is-github-logged-in");
        setIsGithubLoggedIn(res.data.result.isLoggedInGithub);
      } catch (error) {
        console.log(error);
      }
    };
    getGithubScore();
  }, []);

  const handleCalculateGithubScore = async () => {
    try {
      const res = await axiosInstance.get(`/github/get-github-score/${id}`);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginGithub = useCallback(() => {
    window.location.href = "http://localhost:5050/auth/github/callback";
  }, []);

  return (
    <div className="py-5 px-10">
      <div className="flex justify-center">
        {isGithubLoggedIn ? (
          <Button
            kind="secondary"
            className="text-center px-10 disabled:opacity-50"
            onClick={handleCalculateGithubScore}
          >
            Tính điểm Github
          </Button>
        ) : (
          <Button
            kind="secondary"
            className="text-center px-10 disabled:opacity-50"
            onClick={handleLoginGithub}
          >
            Đăng nhập Github
          </Button>
        )}
      </div>
    </div>
  );
};

export default ViewApply;
