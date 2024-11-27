import React, { useEffect, useState } from "react";
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
import useAuth from "@/hooks/useAuth";
import { fetchData } from "@/api/fetchData";

const CompanyInfoPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ isLoading: true, error: null });
  const { user } = useAuth();

  const form = useForm({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      orgImages: [], // Thêm giá trị mặc định
    }
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(
          `recruiter/get-company-info/${user.userId}`
        );
        console.log(result);
        // Đảm bảo orgImages luôn là một mảng
        const orgImages = Array.isArray(result.orgImages) ? result.orgImages : [];
        form.reset({
          orgImage: result.orgImage || "",
          orgName: result.orgName || "",
          orgScale: result.orgScale || "",
          orgIntroduction: result.orgIntroduction || "",
          orgField: result.orgField || "",
          orgFacebookLink: result.orgFacebookLink || "",
          orgLinkedinLink: result.orgLinkedinLink || "",
          orgYoutubeLink: result.orgYoutubeLink || "",
          orgAddress: result.orgAddress || "",
          orgBenefits: result.orgBenefits || "",
          orgCoverImage: result.orgCoverImage || "",
          orgImages: orgImages || [],
        });

        setStatus({ isLoading: false, error: null });
      } catch (error) {
        console.error("Error while fetching job data:", error);
        setStatus({ isLoading: false, error });
      }
    };
    getData();
  }, [form, user.userId]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Đảm bảo orgImages là mảng trước khi gửi
      const formData = {
        ...data,
        orgImages: Array.isArray(data.orgImages) ? data.orgImages : [],
      };
      
      await axiosInstance.put("/recruiter/update-company-info", formData);
      console.log(formData);
      
      toast.success("Công ty đã được lưu thành công!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Đã xảy ra lỗi khi lưu công ty.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status.isLoading) return <div>Loading...</div>;
  if (status.error)
    return <div>Error fetching data: {status.error.message}</div>;

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
            isLoading={isLoading}
          >
            Lưu hồ sơ
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyInfoPage;
