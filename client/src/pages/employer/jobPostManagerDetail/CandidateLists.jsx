import IconDelete from "@/components/icons/IconDelete";
import IconEye from "@/components/icons/IconEye";
import TitleField from "@/components/titleField/TitleField";
import imgAvatar from "@/components/image/avatarImg.png";
import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { AlertModal } from "@/components/shared/AlertModal";
import ModalSendEmail from "./ModalSendEmail";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/components/ui/modal";
import Buttonchild from "@/components/button/Buttonchild";

const emailSchema = z.object({
  email: z.string(),
  // Add additional form fields and validations as needed
});

const CandidateLists = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const onCloseReview = () => setOpenReview(false);

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 mt-5 w-full"
      >
        <div className="bg-secondary rounded-xl p-5 text-sm">
          <TitleField>Danh sách ứng viên</TitleField>
          <div className="flex flex-col gap-5 px-10">
            <div className="flex items-center justify-center gap-10">
              <button
                className="px-4 h-10 bg-primary font-medium text-white rounded-xl hover:bg-[#00F0FF]"
                type="button"
                onClick={() => setOpenReview(true)}
              >
                Gửi gmail
              </button>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Chấp nhận">
                      <div className="flex items-center gap-3">
                        <IconAccept className="w-6 h-6" color="#22C55E" />
                        <span>Chấp nhận</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Từ chối">
                      <div className="flex items-center gap-3">
                        <IconClose className="w-6 h-6" color="#EB5757" />
                        <span>Từ chối</span>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="flex items-center justify-center gap-2">
                <Checkbox id="terms" className="w-5 h-5" />
                <span className="text-primary font-medium">Chọn tất cả</span>
              </div>
            </div>
            <div className="flex flex-col gap-5 text-sm bg-white p-3 rounded-lg border hover:border-primary">
              {/* Candidate Info Card */}
              <div className="flex justify-between gap-5">
                <div className="min-w-[80px] max-w-[80px] rounded-md">
                  <a href="#">
                    <img src={imgAvatar} alt="" className="rounded-md" />
                  </a>
                </div>
                <div className="flex flex-col justify-around gap-1 w-full">
                  <div className="flex gap-10 items-center justify-between">
                    <div className="flex gap-10 items-center">
                      <div
                        className="cursor-pointer line-clamp-1 overflow-hidden text-ellipsis font-medium hover:text-primary hover:underline"
                        onClick={() => navigate(`/job-detail/`)}
                      >
                        Trần Đức Minh
                      </div>
                      <IconAccept className="w-6 h-6" color="#22C55E" />
                      <IconClose className="w-6 h-6" color="#EB5757" />
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full">
                        #1
                      </span>
                      <Checkbox
                        id="candidate-select"
                        className="w-5 h-5 mr-5"
                      />
                    </div>
                  </div>
                  <a
                    href="/company"
                    className="w-fit line-clamp-1 overflow-hidden text-xs text-text3 hover:underline"
                  >
                    Lập trình viên Python với 3 năm kinh nghiệm, kỹ năng xử lý
                    dữ liệu mạnh
                  </a>
                  <div className="flex items-center justify-between">
                    <span className="px-5 text-text2 bg-[#EDEAF0] rounded-xl py-[2px]">
                      Ngày nộp đơn: 2024-10-10
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
                        onClick={() => navigate(`/candidate-detail`)}
                      >
                        <IconEye className="w-5 h-5" color="#fff" />
                        Xem chi tiết
                      </Buttonchild>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <PaginationDemo
                PerPage="newsPerPage"
                dataBase="jobData"
                currentPage="currentPage"
                onPageChange="handlePageChange"
              />
            </div>
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
          </Modal>
        </div>
      </form>
    </Form>
  );
};

export default CandidateLists;
