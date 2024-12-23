import Button from "@/components/button/Button";
import axiosInstance from "@/lib/authorizedAxios";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import ModalViewCV from "./ModalViewCV";
import { Modal } from "@/components/ui/modal";
import useAuth from "@/hooks/useAuth";

const ViewApply = ({ id }) => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const token = searchParams.get("token");
  const [isGithubLoggedIn, setIsGithubLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(token ? token : "");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [githubScore, setGithubScore] = useState(0);
  const [openReview, setOpenReview] = useState(false);

  const handleOpenReview = () => {
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
  };

  console.log(user);

  useEffect(() => {
    const getGithubScore = async () => {
      try {
        const res = await axiosInstance.get(
          `/github/is-github-logged-in?isToken=${accessToken}`
        );
        setIsGithubLoggedIn(res.data.isLoggedInGithub);
        setAccessToken(res.data.token);
      } catch (error) {
        console.log(error);
      }
    };
    getGithubScore();
  }, []);

  const handleCalculateGithubScore = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(
        `/github/get-github-score?jobPostId=${id}&token=${accessToken}`
      );
      console.log(res);
      toast.success("Tính điểm thành công");
      setIsLoading(false);
      setSuccess(true);
      setGithubScore(res.data.score);
    } catch (error) {
      console.log(error);
      toast.error("Tính điểm thất bại");
    }
  };

  const handleLoginGithub = () => {
    window.location.href = `http://localhost:5050/auth/github-info?jobPostId=${id}`;
  };

  return (
    <div className="py-5 px-10">
      <div className="flex justify-center">
        {isGithubLoggedIn ? (
          !success ? (
            <Button
              kind="secondary"
              className="text-center px-10 disabled:opacity-50"
              onClick={handleCalculateGithubScore}
            >
              {isLoading ? "Đang tính điểm..." : "Tính điểm Github"}
            </Button>
          ) : (
            <div className="p-5 bg-[#daffe7] w-full flex items-center justify-center text-accepted font-normal rounded-md">
              <span>
                {isLoading
                  ? "Đang tính điểm..."
                  : `Tính điểm thành công. Điểm của bạn là ${
                      githubScore ? `${githubScore} điểm` : "0 điểm"
                    }`}
              </span>
            </div>
          )
        ) : (
          <Button
            kind="secondary"
            className="text-center px-10 disabled:opacity-50"
            onClick={handleLoginGithub}
          >
            Cho quyền truy cập Github
          </Button>
        )}
      </div>
      <div className="flex justify-end text-primary text-sm font-medium pt-5 hover:underline cursor-pointer">
        <span onClick={handleOpenReview}>Xem CV của bạn</span>
      </div>
      <div className="flex items-center justify-end w-full">
        <Modal
          isOpen={openReview}
          onClose={handleCloseReview}
          className="bg-white min-w-[900px] max-w-[1170px]"
          title={`CV của bạn`}
          description={`Nội dung CV của bạn. Nếu bạn chưa có CV, hãy tạo CV trước khi xem CV của bạn!`}
        >
          <ModalViewCV jobId={id} userId={user?.userId} />
          <div className="flex justify-center gap-5 py-5">
            <Button
              kind="secondary"
              className="text-center px-10 disabled:opacity-50"
              type="button"
              isLoading={isLoading}
              onClick={handleCloseReview}
            >
              Trở về
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ViewApply;
