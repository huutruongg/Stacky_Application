import React, { useEffect, useState } from "react";
import FormProfile from "./FormProfile";
import Panel from "@/components/panel/Panel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import Button from "@/components/button/Button";
import { profileCVSchema } from "@/constants/validationFormProfileCV";
import FormIntroduceYourself from "./FormIntroduceYourself";
import FormLanguageAbility from "./FormLanguageAbility";
import FormProject from "./FormProject";
import FormCertification from "./FormCertification";
import FormProgrammingSkills from "./FormProgrammingSkills";
import FormEducation from "./FormEducation";
import FormWorkExperience from "./FormWorkExperience";
import axiosInstance from "@/lib/authorizedAxios";
import useAuth from "@/hooks/useAuth";
import { fetchData } from "@/api/fetchData";
import toast from "react-hot-toast";

const CvInformationPage = () => {
  const { user } = useAuth();
  const [checkExp, setCheckExp] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize the form with schema validation
  const form = useForm({
    resolver: zodResolver(profileCVSchema(checkExp)),
  });

  const handleCheckExp = (data) => {
    setCheckExp(data);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(
          `candidate/get-candidate-details/${user.userId}`
        );

        // Reset form with data from API
        form.reset({
          fullName: result.fullName || "",
          jobPosition: result.jobPosition || "",
          publicEmail: result.publicEmail || "",
          phoneNumber: result.phoneNumber || "",
          gender: result.gender ? "men" : "women",
          avatarUrl:
            {
              preview: result.avatarUrl || "",
              file: null, // No file since it's a URL
            } || "",
          birthDate: result.birthDate ? new Date(result.birthDate) : null,
          address: result.address || "",
          linkedinUrl: result.linkedinUrl || "",
          githubUrl: result.githubUrl || "",
          personalDescription: result.personalDescription || "",
          languages: result.languages || [{ language: "", level: "" }],
          projects: result.projects || [
            {
              projectName: "",
              projectTime: "",
              urlRepo: "",
              projectDescription: "",
            },
          ],
          certifications: (result.certifications || []).map((cert) => ({
            certificateName: cert.certificateName || "",
            dateOfReceipt: cert.dateOfReceipt
              ? new Date(cert.dateOfReceipt)
              : null,
            certificateDetail: cert.certificateDetail || "",
          })),
          programmingSkills: result.programmingSkills || "",
          educations: (result.educations || []).map((edu) => ({
            schoolName: edu.schoolName || "",
            startDate: edu.startDate ? new Date(edu.startDate) : null,
            finishDate: edu.finishDate ? new Date(edu.finishDate) : null,
            fieldName: edu.fieldName || "",
          })),
          experiences: checkExp
            ? (result.experiences || []).map((exp) => ({
                companyName: exp.companyName || "",
                startDate: exp.startDate ? new Date(exp.startDate) : null,
                endDate: exp.endDate ? new Date(exp.endDate) : null,
                jobPosition: exp.jobPosition || "",
                previousJobDetails: exp.previousJobDetails || "",
              }))
            : [],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error while fetching job data:", error);
        setError(error);
        setLoading(false);
      }
    };
    getData();
  }, [form, user.userId, checkExp]);

  const onUpdate = async (data) => {
    const formattedData = {
      ...data,
      birthDate: data.birthDate || null,
      certifications: data.certifications.map((cert) => ({
        ...cert,
        dateOfReceipt: cert.dateOfReceipt || null,
      })),
      educations: data.educations.map((edu) => ({
        ...edu,
        startDate: edu.startDate || null,
        finishDate: edu.finishDate || null,
      })),
      experiences: data.experiences.map((exp) => ({
        ...exp,
        startDate: exp.startDate || null,
        endDate: exp.endDate || null,
      })),
    };

    const { avatarUrl, ...restData } = formattedData;

    try {
      let uploadedAvatarUrl = avatarUrl.preview; // Use the preview URL by default
      if (avatarUrl.file) {
        const formDataImage = new FormData();
        formDataImage.append("files", avatarUrl.file);

        const imageResponse = await axiosInstance.post(
          "/upload/recruiter-images",
          formDataImage,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        uploadedAvatarUrl = imageResponse.data.urlImages[0];
      }

      await axiosInstance.put("/candidate/submit-profile", {
        userId: user.userId,
        avatarUrl: uploadedAvatarUrl,
        ...restData,
      });
      toast.success("Cập nhật thành công.");
    } catch (error) {
      toast.error("Cập nhật thất bại");
    }
  };

  // Handle loading state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div>
      <div className="page-container my-10">
        <Panel
          title={"Tạo hồ sơ xin việc"}
          children={
            "Tạo nhanh hồ sơ chuyên nghiệp để ứng tuyển vào công việc bạn mong muốn."
          }
        />

        {/* Form section */}
        <Form {...form}>
          <form
            className="space-y-5 my-10 w-full"
            onSubmit={form.handleSubmit(onUpdate)}
          >
            <FormProfile form={form} />
            <FormIntroduceYourself form={form} />
            <FormEducation form={form} />
            <FormProgrammingSkills form={form} />
            <FormWorkExperience
              form={form}
              checkNoExperience={handleCheckExp}
            />
            <FormLanguageAbility form={form} />
            <FormProject form={form} />
            <FormCertification form={form} />
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
  );
};

export default CvInformationPage;
