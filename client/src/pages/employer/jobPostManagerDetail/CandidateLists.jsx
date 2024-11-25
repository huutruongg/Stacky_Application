import IconDelete from "@/components/icons/IconDelete";
import IconEye from "@/components/icons/IconEye";
import TitleField from "@/components/titleField/TitleField";
import imgAvatar from "@/components/image/avatarImg.png";
import React, { useEffect, useState } from "react";
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

const emailSchema = z.object({
  text: z.string(),
});

const CandidateLists = ({ data, candidatesLimit }) => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const onCloseReview = () => setOpenReview(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      text: "",
    },
  });
  console.log(selectedCandidates);

  const handleSelectAll = () => {
    setSelectedCandidates(data.map((candidate) => candidate.publicEmail));
  };

  const handleSelectCandidate = (email) => {
    setSelectedCandidates((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/email/send-email`, {
        to: selectedCandidates,
        subject: "Gửi mail",
        text: formData.text,
      });
      console.log(response);
      setOpenReview(false);
      setSelectedCandidates([]);
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="bg-secondary rounded-xl text-sm">
        <div className="flex justify-between items-center py-2 rounded-tl-xl rounded-tr-xl text-transparent bg-gradient-to-r from-[#48038C] to-[#e59fff]">
          <h3 className="text-xl ml-5 text-white">Thông tin giao dịch</h3>
          <div className="flex items-center justify-center gap-10 mr-10">
            <Buttonchild
              className="px-4 py-1"
              type="button"
              kind="primary"
              onClick={() => setOpenReview(true)}
              disabled={selectedCandidates.length === 0}
            >
              Gửi gmail
            </Buttonchild>
            <Select>
              <SelectTrigger className="w-[185px] h-8 border-primary text-white rounded-md">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Chấp nhận">
                    <div className="flex items-center gap-2">
                      <IconAccept className="w-6 h-6" color="#22C55E" />
                      <span>Chấp nhận</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Từ chối">
                    <div className="flex items-center gap-2">
                      <IconClose className="w-6 h-6" color="#EB5757" />
                      <span>Từ chối</span>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex items-center justify-center w-32 gap-2">
              <Checkbox
                id="terms"
                className="w-5 h-5"
                onClick={handleSelectAll}
              />
              <span className="text-white font-medium">Chọn tất cả</span>
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
          {data.length > 0 ? (
            data.map((item, index) => (
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
              />
            ))
          ) : (
            <div className="text-center text-base pt-5 pb-10 text-primary">
              Chưa có ứng viên nào ứng tuyển
            </div>
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
      {/* Modal for Sending Email */}
      <div className="flex items-center justify-end w-full">
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          loading={loading}
        />
        <Modal
          isOpen={openReview}
          onClose={onCloseReview}
          className="bg-white max-w-[600px]"
          title="Gửi Mail"
          description={"Gửi Email cho ứng viên mà bạn ứng tuyển"}
        >
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ModalSendEmail form={form} modalClose={onCloseReview} />
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
                isLoading={loading}
              >
                Gửi Mail
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Form>
  );
};

const ItemCandidate = ({
  index,
  name,
  aiScore,
  githubScore,
  description,
  date,
  avatarUrl,
  candidatesLimit,
  onClick,
  handleSelectCandidate,
  publicEmail,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col gap-5 text-sm bg-white rounded-lg border hover:border-primary">
      {/* Candidate Info Card */}
      <div className="absolute">
        <div className="relative w-10 h-10 border-l-[20px] border-l-primary border-t-[20px] border-t-primary border-r-[20px] border-r-transparent border-b-[20px] border-b-transparent rounded-tl-lg">
          <div className="absolute w-7 h-5 z-10 text-center text-white top-[-19px] left-[-22px] rounded-sm">
            {index + 1}
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-3 pl-9 pr-3 py-3">
        <div className="min-w-[80px] max-w-[80px] flex items-center justify-center rounded-md">
          <a href="#" className="cursor-pointer">
            <img
              src={avatarUrl ? avatarUrl : imgAvatar}
              alt=""
              className="rounded-md object-cover border"
            />
          </a>
        </div>
        <div className="flex flex-col justify-around gap-1 w-full">
          <div className="flex gap-10 items-center justify-between">
            <div className="flex gap-10 items-center">
              <div
                className="cursor-pointer line-clamp-1 overflow-hidden text-ellipsis font-medium hover:text-primary hover:underline"
                onClick={() => navigate(`/job-detail/`)}
              >
                {name}
              </div>
              {candidatesLimit ? (
                <IconAccept className="w-6 h-6" color="#22C55E" />
              ) : (
                <IconClose className="w-6 h-6" color="#EB5757" />
              )}
            </div>
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-300 rounded-full"></div>
                <span>{aiScore}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>{githubScore}</span>
              </div>
              <Checkbox
                id="candidate-select"
                className="w-5 h-5 mr-5"
                onClick={() => handleSelectCandidate(publicEmail)}
              />
            </div>
          </div>
          <a
            href="/company"
            className="w-fit line-clamp-1 overflow-hidden text-xs text-text3 hover:underline max-w-[400px]"
          >
            {description}
          </a>
          <div className="flex items-center justify-between">
            <span className="px-5 text-text2 bg-[#EDEAF0] rounded-xl py-[2px]">
              Ngày nộp đơn: {date}
            </span>
            <div className="flex items-center gap-2">
              <Buttonchild
                kind="ghost"
                className="flex items-center gap-2 text-sm px-3 py-1"
              >
                <IconDelete className="w-5 h-5" color="#fff" />
                Xóa
              </Buttonchild>
              <Buttonchild
                kind="primary"
                className="flex items-center text-sm gap-2 px-3 py-1"
                onClick={onClick}
              >
                <IconEye className="w-5 h-5" color="#fff" />
                Xem chi tiết
              </Buttonchild>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateLists;
