import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/button/Button";
import { companyInfoSchema } from "@/constants/validationFormCompanyInfo";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/authorizedAxios";
import FormCompanyBasicInfo from "./FormCompanyBasicInfo";
import FormIntroduceCompany from "./FormIntroduceCompany";
import FormLocation from "./FormLocation";
import FormCompanyDescription from "./FormCompanyDescription";

const CompanyInfoPage = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      orgImage: "",
      orgName: "",
      orgScale: "",
      orgIntroduction: "",
      orgField: "",
      orgFacebookLink: "",
      orgLinkedinLink: "",
      orgYoutubeLink: "",
      orgAddress: "",
      orgBenefit: "",
      orgCoverImage: "",
      orgImages: [],
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      // Uncomment to submit form data to the backend
      await axiosInstance.put("/recruiter/update-company-info", data);
      toast.success("Công ty đã được lưu thành công!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Đã xảy ra lỗi khi lưu công ty.");
    } finally {
      setLoading(false); // Reset loading state after completion
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-5 my-5 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormCompanyBasicInfo form={form} />
        <FormIntroduceCompany form={form} />
        <FormLocation form={form} />
        <FormCompanyDescription form={form} />
        <div className="flex justify-center">
          <Button
            kind="primary"
            className="text-center px-10 disabled:opacity-50"
            type="submit"
            isLoading={loading} // Apply loading state here
          >
            Lưu hồ sơ
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyInfoPage;
