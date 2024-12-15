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
  const [hasExperience, setHasExperience] = useState(false);
  const [status, setStatus] = useState({ isLoading: true, error: null });

  const form = useForm({
    resolver: zodResolver(profileCVSchema(hasExperience)),
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(`candidate/get-candidate`);
        const experienceExists = result.experiences?.length !== 0;

        setHasExperience(experienceExists);

        form.reset({
          fullName: result.fullName || "",
          jobPosition: result.jobPosition || "",
          publicEmail: result.publicEmail || "",
          phoneNumber: result.phoneNumber || "",
          gender: result.gender ? "true" : "false",
          avatarUrl: result.avatarUrl || "",
          birthDate: result.birthDate ? new Date(result.birthDate) : null,
          address: result.address || "",
          githubUrl: result.githubUrl || "",
          linkedinUrl: result.linkedinUrl || "",
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
          professionalSkills: result.professionalSkills || "",
          educations: (result.educations || []).map((edu) => ({
            schoolName: edu.schoolName || "",
            startDate: edu.startDate ? new Date(edu.startDate) : null,
            finishDate: edu.finishDate ? new Date(edu.finishDate) : null,
            fieldName: edu.fieldName || "",
          })),
          experiences: experienceExists
            ? result.experiences.map((exp) => ({
                companyName: exp.companyName || "",
                startDate: exp.startDate ? new Date(exp.startDate) : null,
                endDate: exp.endDate ? new Date(exp.endDate) : null,
                jobPosition: exp.jobPosition || "",
                previousJobDetails: exp.previousJobDetails || "",
              }))
            : [],
        });

        setStatus({ isLoading: false, error: null });
      } catch (error) {
        console.error("Error while fetching job data:", error);
        setStatus({ isLoading: false, error });
      }
    };
    getData();
  }, [form, user.userId]);

  const onUpdate = async (data) => {
    console.log(data);
    const formattedData = {
      ...data,
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

    try {
      await axiosInstance.put("/candidate/update-info", formattedData);
      toast.success("Cập nhật thành công.");
      window.location.reload();
    } catch (error) {
      toast.error("Cập nhật thất bại");
    }
  };

  if (status.isLoading) return <div>Loading...</div>;
  if (status.error)
    return <div>Error fetching data: {status.error.message}</div>;

  return (
    <div className="page-container my-10">
      <Panel
        title="Tạo hồ sơ xin việc"
        children="Tạo nhanh hồ sơ chuyên nghiệp để ứng tuyển vào công việc bạn mong muốn."
      />
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
            hasExperience={hasExperience}
            setHasExperience={setHasExperience}
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
  );
};

export default CvInformationPage;
