import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import Panel from "@/components/panel/Panel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/button/Button";
import NavbarEmployer from "@/components/navbarEmployer/NavbarEmployer";
import FormBasicInfo from "./FormBasicInfo";
import { postJobSchema } from "@/constants/validationFormPostJob";
import FormRequirement from "./FormRequirement";
import FormLanguageAbility from "./FormLanguageAbility";
import FormBenefit from "./FormBenefit";
import FormJobDescription from "./FormJobDescription";
import FormApllyDeadline from "./FormApllyDeadline";
import axiosInstance from "@/lib/authorizedAxios";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/shared/AlertModal";
import { Modal } from "@/components/ui/modal";
import ModalReviewJob from "./ModalReviewJob";

const JobPostPage = () => {
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCloseReview = () => setOpenReview(false);

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
      jobSchedule: null,
    },
  });

  const formData = form.watch();

  console.log(formData);

  const onSubmit = async (data) => {
    const { jobImage, ...restData } = data;
    const formData = new FormData();

    if (jobImage?.file) {
      formData.append("files", jobImage.file);
    }

    try {
      setLoading(true);

      let jobImageUrl = "";
      if (jobImage?.file) {
        const imageResponse = await axiosInstance.post(
          "/upload/recruiter-images",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        jobImageUrl = imageResponse.data.urlImages[0];
      }

      const response = await axiosInstance.post("/job-post/create-job-post", {
        jobImage: jobImageUrl,
        ...restData,
      });

      console.log("Upload successful", response.data);
      toast.success("Tạo bài viết thành công!!!");
    } catch (error) {
      console.error("Lỗi khi upload file", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container relative mt-5">
      <Panel
        title={"Tạo tin tuyển dụng"}
        children={
          "Điền thông tin vị trí tuyển dụng và các yêu cầu công việc cần thiết."
        }
        className={"sticky top-[84px] z-40"}
      />
      <div className="custom-panel"></div>
      <div className="grid grid-cols-12 gap-5">
        <div className="sticky top-[208px] left-0 h-[calc(100vh-208px)] overflow-y-auto grid col-start-1 col-end-4 border-2 border-primary bg-secondary rounded-t-xl">
          <NavbarEmployer />
        </div>

        <div className="grid col-start-4 col-end-13 w-full">
          <Form {...form}>
            <form
              className="space-y-5 mt-5 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormBasicInfo form={form} />
              <FormRequirement form={form} />
              <FormLanguageAbility form={form} />
              <FormBenefit form={form} />
              <FormJobDescription form={form} />
              <FormApllyDeadline form={form} />

              <div className="flex items-center justify-end w-full">
                <AlertModal
                  isOpen={open}
                  onClose={() => setOpen(false)}
                  loading={loading}
                />
                <Modal
                  isOpen={openReview}
                  onClose={onCloseReview}
                  className={"bg-white max-w-[1000px]"}
                  title="Review Job Post"
                >
                  <ModalReviewJob
                    jobData={formData}
                    modalClose={onCloseReview}
                  />
                  <div className="sticky bg-white bottom-0 flex items-center justify-center gap-5 py-5">
                    <Button
                      className="text-center px-10 disabled:opacity-50 border-2 border-primary text-primary hover:opacity-60"
                      type="button"
                      onClick={() => setOpenReview(false)}
                    >
                      Tiếp tục chỉnh sửa
                    </Button>
                    <Button
                      kind="primary"
                      className="text-center px-10 disabled:opacity-50"
                      type="button" // Changed to 'button' to prevent immediate submission
                      onClick={form.handleSubmit(onSubmit)} // Ensure this calls the onSubmit function
                      isLoading={loading} // Set loading state
                    >
                      Đăng bài viết
                    </Button>
                  </div>
                </Modal>
              </div>

              <div className="sticky bottom-0 py-5 bg-white flex items-center justify-center gap-5">
                <Button
                  kind="primary"
                  className="text-center px-10 disabled:opacity-50"
                  type="button"
                  onClick={() => setOpenReview(true)}
                >
                  Xem trước
                </Button>
                <Button
                  kind="primary"
                  className="text-center px-10 disabled:opacity-50"
                  type="submit"
                  isLoading={loading}
                >
                  Đăng bài viết
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default JobPostPage;
