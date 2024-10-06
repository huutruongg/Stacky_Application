import Footer from "@/components/shared/footer/Footer";
import Heading from "@/components/shared/header/Heading";
import React from "react";
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

const CvInformationPage = () => {
  // Initialize the form with default values and schema validation
  const form = useForm({
    resolver: zodResolver(profileCVSchema),
    defaultValues: {
      name: "",
      position: "",
      email: "",
      phone: "",
      gender: "",
      dob: null,
      avatar: "", // Initialize avatar as an empty string
      address: "",
      linkedin: "",
      github: "",
      introduction: "",
      languages: [{ language: "", proficiency: "" }], // Ensure it's initialized as an array with an object
      projects: [
        {
          projectName: "",
          projectDuration: "",
          githubLink: "",
          projectIntroduction: "",
        },
      ], // Initialize projects as an array with an object
      certifications: [
        {
          certificationName: "",
          certificationDate: null,
          certificationDetails: "",
        },
      ], // Initialize certifications array
      programmingSkills: "", // Initialize programmingSkills as an array with an empty string
      educations: [
        {
          educationName: "",
          educationFirstDate: null,
          educationEndDate: null,
          educationMajor: "",
        },
      ],
      workExperiences: [
        {
          companyName: "",
          companyFirstDate: null,
          companyEndDate: null,
          workPosition: "",
          workDescription: "",
        },
      ],
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      // Convert date of birth to a more readable format
      dob: data.dob ? new Date(data.dob).toLocaleDateString("en-US") : "",
      certifications: data.certifications.map((cert) => ({
        ...cert,
        certificationDate: cert.certificationDate
          ? new Date(cert.certificationDate).toLocaleDateString("en-US")
          : "",
      })),
      educations: data.educations.map((edu) => ({
        ...edu,
        educationFirstDate: edu.educationFirstDate
          ? new Date(edu.educationFirstDate).toLocaleDateString("en-US")
          : "",
        educationEndDate: edu.educationEndDate
          ? new Date(edu.educationEndDate).toLocaleDateString("en-US")
          : "",
      })),
      workExperiences: data.workExperiences.map((exp) => ({
        ...exp,
        companyFirstDate: exp.companyFirstDate
          ? new Date(exp.companyFirstDate).toLocaleDateString("en-US")
          : "",
        companyEndDate: exp.companyEndDate
          ? new Date(exp.companyEndDate).toLocaleDateString("en-US")
          : "",
      })),
    };

    // Log or process the form data, including languages and projects
    console.log("Form Data:", formattedData);
  };

  return (
    <div>
      <div className="page-container my-10">
        {/* Panel section */}
        <Panel
          title={"Tạo hồ sơ xin việc"}
          children={
            "Tạo nhanh hồ sơ chuyên nghiệp để ứng tuyển vào công việc bạn mong muốn."
          }
        />

        {/* Form section */}
        <Form {...form}>
          <form
            className="space-y-4 my-10 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormProfile form={form} />
            <FormIntroduceYourself form={form} />
            <FormLanguageAbility form={form} />
            <FormProject form={form} />
            <FormCertification form={form} />
            <FormProgrammingSkills form={form} />
            <FormEducation form={form} />
            <FormWorkExperience form={form} />
            {/* Submit button */}
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
