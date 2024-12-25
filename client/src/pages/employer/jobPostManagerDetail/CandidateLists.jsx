import React, { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import Button from "@/components/button/Button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IconClose from "@/components/icons/IconClose";
import IconAccept from "@/components/icons/IconAccept";
import PaginationDemo from "@/components/pagination/Pagination";
import { useNavigate, useParams } from "react-router-dom";
import { AlertModal } from "@/components/shared/AlertModal";
import ModalSendEmail from "./ModalSendEmail";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/components/ui/modal";
import Buttonchild from "@/components/button/Buttonchild";
import FormatDate from "@/components/format/FormatDate";
import axiosInstance from "@/lib/authorizedAxios";
import toast from "react-hot-toast";
import CandidateListSkeleton from "@/components/skeleton/CandidateListSkeleton";
import io from "socket.io-client";
import ModalSendNotification from "./ModalSendNotification";
import IconPending from "@/components/icons/IconPending";
import IconAll from "@/components/icons/IconAll";
import ItemCandidate from "./ItemCandidate";

const schema = z.object({
  text: z.string(),
  notification: z.string(),
  status: z.string(),
});

const CandidateLists = ({ data, candidatesLimit }) => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onCloseReview = () => setOpenReview(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [dataCandidate, setDataCandidate] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);

  console.log(selectedCandidates);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "",
      notification: "",
      status: "",
    },
  });

  const filteredCandidates = useMemo(() => {
    switch (filterStatus) {
      case "ACCEPTED":
        return dataCandidate.filter((item) => item.status === "ACCEPTED");
      case "REJECTED":
        return dataCandidate.filter((item) => item.status === "REJECTED");
      case "PENDING":
        return dataCandidate.filter((item) => item.status === "PENDING");
      default:
        return dataCandidate;
    }
  }, [dataCandidate, filterStatus]);

  const handleFilterStatus = (status) => {
    setFilterStatus(status.toUpperCase());
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === dataCandidate.length) {
      setSelectedCandidates([]); // Bỏ chọn tất cả
    } else {
      setSelectedCandidates(
        dataCandidate.map((candidate) => ({
          userId: candidate.userId,
          email: candidate.publicEmail, // Include both userId and email
        }))
      ); // Select all candidates
    }
  };

  // const handleSelectAll = () => {
  //   if (selectedCandidates.length === dataCandidate.length) {
  //     setSelectedCandidates([]); // Deselect all candidates
  //   } else {
  //     setSelectedCandidates(dataCandidate.map((candidate) => ({
  //       userId: candidate.userId,
  //       email: candidate.publicEmail // Include both userId and email
  //     }))); // Select all candidates
  //   }
  // };
  const handleSelectCandidate = (email, userId) => {
    setSelectedCandidates((prev) => {
      const isSelected = prev.some(
        (candidate) => candidate.email === email && candidate.userId === userId
      );
      if (isSelected) {
        return prev.filter(
          (candidate) =>
            candidate.email !== email || candidate.userId !== userId
        );
      } else {
        return [...prev, { email, userId }];
      }
    });
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    const userIds = selectedCandidates.map((candidate) => candidate.userId);

    // Register socket for selected candidates
    socket.emit("register", userIds);

    // Listen for incoming notifications
    socket.on("notification", (notification) => {
      setNotifications((prevNotifications) => {
        const updatedNotifications = [...prevNotifications];

        // Check if notification already exists for this userId
        const index = updatedNotifications.findIndex(
          (notif) => notif.userId === notification.userId
        );

        if (index !== -1) {
          // Update the existing notification status
          updatedNotifications[index].status = notification.status;
        } else {
          // Add new notification to the list
          updatedNotifications.push(notification);
        }

        return updatedNotifications;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedCandidates]);

  const createNotification = async (formData) => {
    try {
      const response = await axiosInstance.post(
        `/notification/create-notification`,
        {
          userIds: selectedCandidates.map((candidate) => candidate.userId),
          message: formData.notification,
          jobTitle: data.jobTitle,
        }
      );
      const responseStatus = await axiosInstance.patch(
        `/recruiter/update-candidates-status`,
        {
          jobPostId: jobId,
          candidateIds: selectedCandidates.map((candidate) => candidate.userId),
          status: formData.status,
        }
      );

      // console.log(response);

      if (response.status === 200 || responseStatus.status === 200) {
        toast.success("Gửi thông báo thành công");
      } else {
        toast.error("Gửi thông báo thất bại");
      }
    } catch (error) {
      toast.error("Gửi thông báo thất bại");
    }
  };

  // Gửi thông báo khi nhấn nút
  const handleSendNotification = (formData) => {
    createNotification(formData);
    form.reset();
    setOpenReview(false);
  };

  const handleSendGmail = async (formData) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `/email/send-email-to-candidates`,
        {
          emails: selectedCandidates.map((candidate) => candidate.email),
          jobPostId: data.jobId,
          subject: "Gửi mail",
          text: formData.text,
        }
      );
      console.log(response);
      setOpenReview(false);
      setSelectedCandidates([]);
      toast.success("Gửi mail thành công");
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("Gửi mail thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const resultCandidate = await axiosInstance.get(
          `/recruiter/get-candidates-applied/${jobId}`
        );
        // console.log(result.data.result);
        setDataCandidate(resultCandidate.data.result);
        // console.log(resultCandidate.data.result);
      } catch (error) {
        console.error("Error while fetching job data:", error);
      }
    };
    getData();
  }, []);

  return (
    <Form {...form}>
      <div className="bg-secondary rounded-xl text-sm">
        <div className="flex justify-between items-center gap-2 py-2 rounded-tl-xl rounded-tr-xl text-transparent bg-gradient-to-r from-[#48038C] to-[#e59fff]">
          <h3 className="text-xl ml-5 text-white">Danh sách ứng viên</h3>
          <div className="flex items-center justify-center gap-5 mr-10">
            <Buttonchild
              className="px-4 py-1 disabled:opacity-50 disabled:hover:bg-primary"
              type="button"
              kind="primary"
              onClick={() => {
                setOpenReview(true);
                setIsSendingNotification(true);
              }}
              disabled={selectedCandidates.length === 0}
            >
              Gửi thông báo
            </Buttonchild>
            <Buttonchild
              className="px-4 py-1 disabled:opacity-50 disabled:hover:bg-primary"
              type="button"
              kind="primary"
              onClick={() => {
                setOpenReview(true);
                setIsSendingNotification(false);
              }}
              disabled={selectedCandidates.length === 0}
            >
              Gửi gmail
            </Buttonchild>
            <Select onValueChange={(value) => handleFilterStatus(value)}>
              <SelectTrigger className="w-[180px] h-8 border-primary text-white rounded-md">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <IconAll className="w-6 h-6" color="#fd0000" />
                      <span>Tất cả</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="accepted">
                    <div className="flex items-center gap-2">
                      <IconAccept className="w-6 h-6" color="#22C55E" />
                      <span>Chấp nhận</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <IconPending className="w-6 h-6" color="#48038C" />
                      <span>Đang chờ</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="rejected">
                    <div className="flex items-center gap-2">
                      <IconClose className="w-6 h-6" color="#EB5757" />
                      <span>Từ chối</span>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex items-center w-36 gap-2">
              <Checkbox
                id="terms"
                className="w-5 h-5"
                checked={selectedCandidates.length === dataCandidate.length}
                onClick={handleSelectAll}
              />
              <span className="text-white">
                {selectedCandidates.length === dataCandidate.length
                  ? "Bỏ chọn tất cả"
                  : "Chọn tất cả"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 px-10">
          <div className="flex justify-end gap-10 w-full mt-5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-300 rounded-full"></div>
              <span>Điểm AI phân tích</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Điểm Gitub</span>
            </div>
          </div>
          {!isLoading ? (
            filteredCandidates.length > 0 ? (
              filteredCandidates.map((item, index) => (
                <ItemCandidate
                  index={index}
                  key={index}
                  avatarUrl={item.avatarUrl}
                  name={item.fullName}
                  aiScore={item.totalScore}
                  githubScore={item.githubScore}
                  description={item.personalDescription}
                  date={FormatDate.formatDateTime(item.appliedAt)}
                  userId={item.userId}
                  candidatesLimit={index < candidatesLimit}
                  onClick={() => {
                    navigate(`/candidate-detail/${jobId}/${item.userId}`);
                  }}
                  handleSelectCandidate={handleSelectCandidate}
                  publicEmail={item.publicEmail}
                  StatusNotification={item.status}
                  StatusSendGmail={item.isSent}
                  checked={selectedCandidates
                    .map((item) => item.userId)
                    .includes(item.userId)}
                  // handleDeleteCandidate={handleDeleteCandidate}
                />
              ))
            ) : (
              <div className="text-center text-base pt-5 pb-10 text-primary">
                Chưa có ứng viên nào ứng tuyển
              </div>
            )
          ) : (
            <CandidateListSkeleton />
          )}
          {data.length > 0 ? (
            <div className="mt-5">
              <PaginationDemo
                PerPage="newsPerPage"
                dataBase="jobData"
                currentPage="currentPage"
                onPageChange="handlePageChange"
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="py-5">
        <Button
          kind="primary"
          className="px-10 h-10 bg-primary text-white rounded-xl"
          onClick={() => navigate(`/job-management`)}
        >
          Quay lại
        </Button>
      </div>
      {/* Modal for Sending */}
      {isSendingNotification ? (
        <div className="flex items-center justify-end w-full">
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            isLoading={isLoading}
          />
          <Modal
            isOpen={openReview}
            onClose={onCloseReview}
            className="bg-white max-w-[600px]"
            title="Gửi Thông Báo"
            description={"Gửi thông báo cho ứng viên mà bạn ứng tuyển"}
          >
            <form onSubmit={form.handleSubmit(handleSendNotification)}>
              <ModalSendNotification form={form} />
              <div className="flex justify-center gap-5 py-5">
                <Button
                  kind="secondary"
                  className="text-center px-10 disabled:opacity-50"
                  type="button"
                  onClick={() => setOpenReview(false)}
                >
                  Quay lại
                </Button>
                <Button
                  kind="primary"
                  className="text-center px-10 disabled:opacity-50"
                  type="submit"
                  isLoading={isLoading}
                >
                  Gửi Thông Báo
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      ) : (
        <div className="flex items-center justify-end w-full">
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            isLoading={isLoading}
          />
          <Modal
            isOpen={openReview}
            onClose={onCloseReview}
            className="bg-white max-w-[600px]"
            title="Gửi email"
            description={"Gửi email cho ứng viên mà bạn ứng tuyển"}
          >
            <form onSubmit={form.handleSubmit(handleSendGmail)}>
              <ModalSendEmail form={form} />
              <div className="flex justify-center gap-5 py-5">
                <Button
                  kind="secondary"
                  className="text-center px-10 disabled:opacity-50"
                  type="button"
                  onClick={() => setOpenReview(false)}
                >
                  Quay lại
                </Button>
                <Button
                  kind="primary"
                  className="text-center px-10 disabled:opacity-50"
                  type="submit"
                  isLoading={isLoading}
                >
                  Gửi Email
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </Form>
  );
};

export default CandidateLists;
