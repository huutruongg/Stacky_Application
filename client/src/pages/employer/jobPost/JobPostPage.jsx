import React, { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/button/Button";
import { postJobSchema } from "@/constants/validationFormPostJob";
import axiosInstance from "@/lib/authorizedAxios";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/shared/AlertModal";
import { Modal } from "@/components/ui/modal";
import ModalReviewJob from "./ModalReviewJob";
import ModalPostPay from "./ModalPostPay";
import FormBasicInfo from "./FormBasicInfo";
import FormRequirement from "./FormRequirement";
import FormLanguageAbility from "./FormLanguageAbility";
import FormBenefit from "./FormBenefit";
import FormJobDescription from "./FormJobDescription";
import FormApllyDeadline from "./FormApllyDeadline";

const JobPostPage = () => {
  const [openReview, setOpenReview] = useState(false);
  const [openPostPay, setOpenPostPay] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const jobPostPrice = 100000;
  const [balanceData, setBalanceData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance.get(`/payment/get-payment-info`);
        setBalanceData(result.data.balance);
      } catch (error) {
        console.error("Error while fetching payment data:", error);
      }
    };
    fetchData();
  }, [balanceData]);

  console.log(balanceData);

  const form = useForm({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      jobImage: null,
      jobTitle: "",
      typeOfWork: "",
      genderRequired: "",
      location: "",
      jobSalary: "",
      candidatesLimit: 0,
      educationRequired: "",
      yearsOfExperience: "",
      typeOfIndustry: "",
      staffLevel: "",
      certificateRequired: "",
      professionalSkills: "",
      languagesRequired: [{ language: "", level: "" }],
      jobBenefit: "",
      leavePolicy: "",
      jobDescription: "",
      workEnvironment: "",
      applicationDeadline: null,
      jobSchedule: "",
    },
  });

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Kiểm tra điều kiện số dư
      if (balanceData < jobPostPrice) {
        toast.error("Số tiền không đủ. Vui lòng nạp thêm tiền.");
        return;
      }

      // Kiểm tra dữ liệu form
      const missingFields = [];
      if (!data.jobTitle) missingFields.push("Tiêu đề công việc");
      if (!data.typeOfWork) missingFields.push("Loại hình công việc");
      if (!data.genderRequired) missingFields.push("Yêu cầu giới tính");
      if (!data.location) missingFields.push("Địa điểm");
      if (!data.jobSalary) missingFields.push("Mức lương");
      if (data.candidatesLimit <= 0)
        missingFields.push("Giới hạn số lượng ứng viên");
      if (!data.educationRequired)
        missingFields.push("Trình độ học vấn yêu cầu");
      if (!data.yearsOfExperience)
        missingFields.push("Kinh nghiệm làm việc yêu cầu");
      if (!data.typeOfIndustry) missingFields.push("Ngành nghề");
      if (!data.staffLevel) missingFields.push("Cấp bậc");
      if (!data.professionalSkills) missingFields.push("Kỹ năng chuyên môn");
      if (
        !data.languagesRequired ||
        data.languagesRequired.some((lang) => !lang.language || !lang.level)
      ) {
        missingFields.push("Ngôn ngữ và trình độ yêu cầu");
      }
      if (!data.jobBenefit) missingFields.push("Lợi ích công việc");
      if (!data.jobDescription) missingFields.push("Mô tả công việc");
      if (!data.applicationDeadline) missingFields.push("Hạn chót ứng tuyển");
      if (!data.jobSchedule) missingFields.push("Thời gian làm việc");

      if (missingFields.length > 0) {
        toast.error(
          `Các trường sau đây còn thiếu: ${missingFields.join(", ")}`
        );
        return;
      }

      // Thực hiện gọi API nếu cả hai điều kiện đúng
      await axiosInstance.patch("/payment/pay-for-job-post", {
        balance: balanceData,
        jobPostPrice,
      });

      await axiosInstance.post("/job-post/create-job-post", { data });

      setOpenReview(false);
      toast.success("Tạo bài viết thành công!!!");
      const result = await axiosInstance.get(`/payment/get-payment-info`);
      setBalanceData(result.data.balance);
      form.reset(); // Reset form sau khi tạo bài viết thành công
      window.location.reload();
    } catch (error) {
      console.error("Unexpected Error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const formData = form.watch();

  const renderModalFooter = (onClose, onSubmitText, onSubmit) => (
    <div className="sticky bg-white bottom-0 flex items-center justify-center gap-5 py-5">
      <Button
        className="text-center px-10 border-2 border-primary text-primary hover:opacity-60"
        type="button"
        onClick={onClose}
      >
        Tiếp tục chỉnh sửa
      </Button>
      <Button
        kind="primary"
        className="text-center px-10"
        type="button"
        isLoading={isLoading}
        onClick={onSubmit}
      >
        {onSubmitText}
      </Button>
    </div>
  );

  return (
    <Form {...form}>
      <form
        className="space-y-5 mt-5 w-full"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormBasicInfo form={form} />
        <FormRequirement form={form} />
        <FormLanguageAbility form={form} />
        <FormBenefit form={form} />
        <FormJobDescription form={form} />
        <FormApllyDeadline form={form} />

        {/* Preview and Submit Buttons */}
        <div className="sticky bottom-0 py-5 bg-white flex items-center justify-center gap-5">
          <Button
            kind="primary"
            className="text-center px-10"
            type="button"
            onClick={() => setOpenReview(true)}
          >
            Xem trước
          </Button>
          <Button
            kind="primary"
            className="text-center px-10"
            type="button"
            onClick={() => setOpenPostPay(true)}
          >
            Đăng bài viết
          </Button>
        </div>

        {/* Modals */}
        <Modal
          isOpen={openReview}
          onClose={() => setOpenReview(false)}
          className="bg-white max-w-[1000px]"
          title="Xem trước bài viết"
        >
          <ModalReviewJob
            jobData={formData}
            modalClose={() => setOpenReview(false)}
          />
          {renderModalFooter(
            () => setOpenReview(false),
            "Đăng bài viết",
            () => {
              setOpenReview(false);
              setOpenPostPay(true);
            }
          )}
        </Modal>

        <Modal
          isOpen={openPostPay}
          onClose={() => setOpenPostPay(false)}
          className="bg-white max-w-[1000px]"
          title="Xác nhận thanh toán"
        >
          <ModalPostPay jobData={formData} />
          {renderModalFooter(
            () => setOpenPostPay(false),
            "Thanh toán",
            () => {
              setAlertModalOpen(true);
              setOpenPostPay(false);
            }
          )}
        </Modal>

        <AlertModal
          isOpen={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
          isLoading={isLoading}
          onConfirm={() => {
            form.handleSubmit(handleSubmit)();
            setAlertModalOpen(false);
          }}
        />
      </form>
    </Form>
  );
};

export default JobPostPage;
