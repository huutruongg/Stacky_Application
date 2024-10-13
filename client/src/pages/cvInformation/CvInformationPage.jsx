import React, { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/hooks/useAuth";

const CvInformationPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkExp, setCheckExp] = useState(true);

  console.log(checkExp);

  const handleCheckExp = (data) => {
    setCheckExp(data);
  };
  // Initialize the form with default values and schema validation
  const form = useForm({
    resolver: zodResolver(profileCVSchema(checkExp)),
    defaultValues: {
      fullName: "", // String for full name
      jobPosition: "", // String for job position
      publicEmail: "", // String for email
      phoneNumber: "", // String for phone number
      gender: "", // String for gender
      avatarUrl: "", // String for avatar URL
      birthDate: null, // Date object or null for birthDate
      address: "", // String for address
      linkedinUrl: "", // String for LinkedIn URL
      githubUrl: "", // String for GitHub URL
      personalDescription: "", // String for personal description
      languages: [
        { language: "", level: "" }, // Ensure correct key name 'level' instead of 'proficiency'
      ],
      projects: [
        {
          projectName: "", // Project name as string
          projectTime: "", // Change key to 'projectTime' to match JSON
          urlRepo: "", // GitHub repository URL to match 'urlRepo' in JSON
          projectDescription: "", // Match key 'projectDescription' in JSON
        },
      ],
      certifications: [
        {
          certificateName: "", // Match key 'certificateName' in JSON
          dateOfReceipt: null, // Date object or null, match 'dateOfReceipt'
          certificateDetail: "", // Match key 'certificateDetail'
        },
      ],
      programmingSkills: "", // If this is a string, keep as is. If it should be an array of skills, change to: `programmingSkills: []`
      educations: [
        {
          schoolName: "", // Match key 'schoolName' in JSON
          startDate: null, // Match key 'startDate' for education first date
          finishDate: null, // Match key 'finishDate' for education end date
          fieldName: "", // Match key 'fieldName' in JSON
        },
      ],
      experiences: checkExp
        ? [
            {
              companyName: "",
              startDate: null,
              endDate: null,
              jobPosition: "",
              previousJobDetails: "",
            },
          ]
        : [],
    },
  });

  useEffect(() => {
    const getData = async () => {
      try {
        // Gọi API với type là 'job-postings' và phân trang
        const result = await fetchData(`/get-candidate-details/${user.userId}`);
        setJobData(result); // Giả sử API trả về dữ liệu trong result.data
        setLoading(false);
      } catch (error) {
        console.error("Error while fetching jobs data:", error);
        setError(error); // Cập nhật lỗi
        setLoading(false);
      }
    };
    getData();
  }, [currentPage]);

  const onUpdate = async (data) => {
    const formattedData = {
      ...data,
      // Convert date of birth to a more readable format
      birthDate: data.birthDate
        ? new Date(data.birthDate).toLocaleDateString("en-US")
        : "",
      certifications: data.certifications.map((cert) => ({
        ...cert,
        dateOfReceipt: cert.dateOfReceipt
          ? new Date(cert.dateOfReceipt).toLocaleDateString("en-US")
          : "",
      })),
      educations: data.educations.map((edu) => ({
        ...edu,
        startDate: edu.startDate
          ? new Date(edu.startDate).toLocaleDateString("en-US")
          : "",
        finishDate: edu.finishDate
          ? new Date(edu.finishDate).toLocaleDateString("en-US")
          : "",
      })),
      experiences: data.experiences.map((exp) => ({
        ...exp,
        startDate: exp.startDate
          ? new Date(exp.startDate).toLocaleDateString("en-US")
          : "",
        endDate: exp.endDate
          ? new Date(exp.endDate).toLocaleDateString("en-US")
          : "",
      })),
    };

    // Log or process the form data, including languages and projects
    console.log("Form Data:", formattedData);
    const { avatarUrl, ...restData } = formattedData;
    console.log(avatarUrl);

    // Create FormData
    const formDataImage = new FormData();

    // If the user has selected an image, append it to FormData
    if (avatarUrl && avatarUrl.file) {
      formDataImage.append("files", avatarUrl.file); // Append each file to 'files' field
      console.log("FormData with file:", avatarUrl.file);
    }
    try {
      // Send request to the backend
      const imageResponse = await axiosInstance.post(
        "/upload/recruiter-images",
        formDataImage,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct header
          },
        }
      );

      const avatarUrl = imageResponse.data.urlImages[0];
      console.log(avatarUrl);

      console.log({
        userId: user.userId,
        avatarUrl: avatarUrl, // URL của ảnh đã upload
        ...restData, // URL của ảnh đã upload
      });

      const response = await axiosInstance.put("/candidate/submit-profile", {
        userId: user.userId,
        avatarUrl: avatarUrl, // URL của ảnh đã upload
        ...restData,
      });
      toast({
        title: "Cập nhật thương hiệu",
        description: "Cập nhật thương hiệu thành công",
      });
    } catch (error) {
      console.log(error.message);

      toast({
        title: "Cập nhật thương hiệu thất bại",
        description: `${error.message}`,
        variant: "destructive",
      });
    }
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
