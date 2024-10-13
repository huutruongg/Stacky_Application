import React from "react";
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
import useAuth from "@/hooks/useAuth";

const JobPostPage = () => {
  const { user } = useAuth();
  console.log(user.userId);

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
      languages: [{ language: "", level: "" }],
      jobBenefit: "",
      leavePolicy: "",
      jobDescription: "",
      workEnvironment: "",
      applicationDeadline: null,
      jobSchedule: null,
    },
  });

  const onSubmit = async (data) => {
    const { jobImage, ...restData } = data;
    console.log(jobImage);

    // Create FormData
    const formData = new FormData();

    // If the user has selected an image, append it to FormData
    if (jobImage && jobImage.file) {
      formData.append("files", jobImage.file); // Append each file to 'files' field
      console.log("FormData with file:", jobImage.file);
    }

    try {
      // Send request to the backend
      const imageResponse = await axiosInstance.post(
        "/upload/recruiter-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct header
          },
        }
      );

      const jobImageUrl = imageResponse.data.urlImages[0];
      console.log({
        ...restData,
        jobImage: jobImageUrl, // URL của ảnh đã upload
      });

      const response = await axiosInstance.post(
        "/job-posting/create-job-posting",
        {
          recruiterId: user.userId,
          jobImage: jobImageUrl, // URL của ảnh đã upload
          ...restData,
        }
      );

      console.log("Upload successful", response.data);
      toast.success("Tạo bài viết thành công!!!");
    } catch (error) {
      console.error("Lỗi khi upload file", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };
  return (
    <div className="page-container relative mt-5">
      {/* Panel section */}
      <Panel
        title={"Tạo tin tuyển dụng"}
        children={
          "Điền thông tin vị trí tuyển dụng và các yêu cầu công việc cần thiết."
        }
        className={"sticky top-[84px] z-40"}
      />
      <div className="custom-panel"></div>
      <div className="grid grid-cols-12 gap-5">
        <div className="sticky top-[208px] left-0 h-[calc(100vh-208px)] overflow-y-auto grid col-start-1 col-end-4 border-2 border-primary bg-secondary rounded-t-xl fixed-navbar">
          <NavbarEmployer />
        </div>
        {/* Form section */}
        <div className="grid col-start-4 col-end-13 w-full gap-5">
          <Form {...form}>
            <form
              className="space-y-5 my-5 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormBasicInfo form={form} />
              <FormRequirement form={form} />
              <FormLanguageAbility form={form} />
              <FormBenefit form={form} />
              <FormJobDescription form={form} />
              <FormApllyDeadline form={form} />
              <div className="flex justify-center">
                <Button
                  kind="primary"
                  className="w-fit px-10 disabled:opacity-50"
                  type="submit"
                >
                  Lưu CV
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
