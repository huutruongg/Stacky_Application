import React, { useEffect, useState } from "react";
import IconPrice from "@/components/icons/IconPrice";
import IconTimer from "@/components/icons/IconTimer";
import IconLocation from "@/components/icons/IconLocation";
import IconHourglass from "@/components/icons/IconHourglass";
import Button from "@/components/button/Button";
import IconSend from "@/components/icons/IconSend";
import IconHeart from "@/components/icons/IconHeart";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/shared/AlertModal";
import { Modal } from "@/components/ui/modal";
import ViewApply from "./ViewApply";
import { Link, useParams } from "react-router-dom";
import FormatDate from "@/components/format/FormatDate";
import { useJobSave } from "@/components/context/JobSaveProvider";
import axiosInstance from "@/lib/authorizedAxios";
import IconHeartActive from "@/components/icons/IconHeartActive";
import useAuth from "@/hooks/useAuth";

const JobSummary = ({ jobData, isliked }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [liked, setLiked] = useState(isliked);
  const [isLoading, setIsLoading] = useState(false);
  const { removeJob, refreshSavedJobs } = useJobSave();
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  useEffect(() => {
    setLiked(isliked);
  }, [isliked]);

  const handleLiked = () => {
    setLiked(!liked);
  };

  const onCloseReview = () => {
    setOpenReview(false);
  };

  const handleOpenReview = () => {
    setOpenReview(true);
  };

  const handleSaveJob = async () => {
    try {
      if (user) {
        setIsLoading(true);
        await axiosInstance.post(`/job-post/save-job-post/${jobData._id}`);
        toast.success("Lưu bài viết thành công");
        setLiked(true);
        refreshSavedJobs(); // Đảm bảo refresh sau khi lưu
      } else {
        toast.error("Vui lòng đăng nhập để lưu bài viết");
      }
    } catch (error) {
      toast.error("Lưu bài viết thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSaveJob = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/job-post/unsave-job-post/${jobData._id}`);
      toast.success("Xóa bài viết thành công");
      refreshSavedJobs(); // Đảm bảo refresh sau khi xóa
      setLiked(false);
      removeJob(jobData._id);
    } catch (error) {
      console.error("Error deleting saved job:", error);
      toast.error("Xóa bài viết thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyJob = async () => {
    try {
      setIsLoading(true);

      // Gửi yêu cầu ứng tuyển
      const response = await axiosInstance.post(
        `/job-post/create-application/${jobData._id}`
      );

      // Kiểm tra trạng thái phản hồi
      if (response.status === 406) {
        toast.error("Bạn đã ứng tuyển bài viết này");
      } else {
        toast.success("Ứng tuyển thành công");
        setOpenReview(false);
      }
    } catch (error) {
      // Xử lý lỗi từ API
      if (error.response && error.response.status === 406) {
        toast.error("Bạn đã ứng tuyển bài viết này");
      } else {
        toast.error("Ứng tuyển thất bại");
      }
    } finally {
      // Đảm bảo trạng thái tải luôn được cập nhật
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-secondary p-8 rounded-xl">
      <h2 className="font-semibold text-2xl mb-7">{jobData?.jobTitle}</h2>
      <div className="flex items-center justify-between gap-3 mb-5">
        <ItemInfoJob
          icon={<IconPrice className={"w-6 h-6"} color={"#fff"}></IconPrice>}
          title={"Mức lương"}
          children={jobData?.jobSalary}
        ></ItemInfoJob>
        <ItemInfoJob
          icon={<IconLocation color={"#FFFF"}></IconLocation>}
          title={"Địa điểm"}
          children={jobData?.location}
          className={"max-w-80 line-clamp-1"}
        ></ItemInfoJob>
        <ItemInfoJob
          icon={<IconHourglass></IconHourglass>}
          title={"Kinh nghiệm"}
          children={
            jobData?.yearsOfExperience === "notRequired"
              ? "Không yêu cầu"
              : jobData?.yearsOfExperience === "1-2Years"
              ? "1 - 2 năm"
              : jobData?.yearsOfExperience === "2-5Years"
              ? "2 - 5 năm"
              : "Trên 5 năm"
          }
        ></ItemInfoJob>
      </div>
      <div className="flex items-center w-fit text-text2 p-2 rounded-xl bg-[#EFF0F3] gap-2 mb-5">
        <IconTimer></IconTimer>
        <span>
          Hạn nộp hồ sơ: {FormatDate.formatDate(jobData?.applicationDeadline)}
        </span>
      </div>
      <div className="flex justify-center items-center gap-10">
        <Button
          kind="primary"
          className="gap-3 w-7/12"
          onClick={handleOpenReview}
        >
          <IconSend></IconSend>
          <span className="font-semibold">ỨNG TUYỂN NGAY</span>
        </Button>
        <Button
          className={`gap-3 w-3/12 px-10 border-2 border-[#48038C]`}
          onClick={
            liked
              ? () => {
                  handleDeleteSaveJob();
                  handleLiked();
                }
              : handleSaveJob
          }
          disabled={isLoading ? true : false}
        >
          <div className="flex items-center justify-center">
            {liked ? (
              <IconHeartActive className="w-6 h-6"></IconHeartActive>
            ) : (
              <IconHeart className="w-6 h-6"></IconHeart>
            )}
          </div>
          <span className="font-semibold w-full text-center text-primary">
            {liked ? "ĐÃ LƯU" : "LƯU"}
          </span>
        </Button>
      </div>
      <div className="flex items-center justify-end w-full">
        <AlertModal
          isOpen={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
          isLoading={isLoading}
          onConfirm={() => {
            handleApplyJob();
            setAlertModalOpen(false);
          }}
        />
        <Modal
          isOpen={openReview}
          onClose={onCloseReview}
          className="bg-white max-w-[600px]"
          title={`Ứng tuyển ${jobData?.jobTitle}`}
          description={`Nếu ngành bạn là Công Nghệ Thông Tin, hãy chia sẻ quyền truy cập Github của bạn để chúng tôi tính điểm số của bạn với bài viết này!`}
        >
          {user ? (
            <>
              <ViewApply id={jobData?._id} />
              <div className="flex justify-center gap-5 py-5">
                <Button
                  kind="secondary"
                  className="text-center px-10 disabled:opacity-50"
                  type="button"
                  isLoading={isLoading}
                  onClick={onCloseReview}
                >
                  Hủy
                </Button>
                <Button
                  kind="primary"
                  className="text-center px-10 disabled:opacity-50"
                  type="submit"
                  isLoading={isLoading}
                  onClick={() => {
                    setAlertModalOpen(true);
                    onCloseReview();
                  }}
                >
                  ứng tuyển
                </Button>
              </div>
            </>
          ) : (
            <div className="flex justify-center gap-1 py-20">
              Vui lòng{" "}
              <Link
                to="/account.stacky.vn"
                className="text-primary font-semibold hover:underline"
              >
                đăng nhập
              </Link>{" "}
              để ứng tuyển
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

const ItemInfoJob = ({ icon, title, children, className }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="p-3 rounded-full bg-primary">{icon}</div>
      <div className="flex flex-col font-medium">
        <span className="text-text3">{title}</span>
        <span className={className} title={children}>
          {children}
        </span>
      </div>
    </div>
  );
};

export default JobSummary;
