import InputField from "@/components/fieldForm/InputField";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/button/Button";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/lib/authorizedAxios";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [companyInfo, setCompanyInfo] = useState(null);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().nonempty("Tên hiển thị không được để trống"),
        email: z.string().email("Email không đúng định dạng"),
        phoneNumber: z.string().nonempty("Số điện thoại không được để trống"),
      })
    ),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await axiosInstance.get(
          `/recruiter/get-company-info/${userId}`
        );
        setCompanyInfo(response.data.result);
      } catch (error) {
        console.error(error);
        toast.error("Đã xảy ra lỗi, vui lòng thử lại!");
      }
    };
    fetchCompanyInfo();
  }, [userId]);

  console.log(companyInfo);

  useEffect(() => {
    if (companyInfo) {
      form.reset({
        name: companyInfo.orgName || "",
        email: companyInfo.orgEmail || "",
        phoneNumber: companyInfo.phoneNumber || "",
      });
    }
  }, [companyInfo, form]);

  const onSubmit = async (data) => {
    console.log(data);

    try {
      const response = await axiosInstance.put(
        `/recruiter/update-company-account`,
        data
      );

      if (response.data.success) {
        toast.success("Thông tin đã được cập nhật thành công!");
        // navigate("/account.stacky.vn");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center my-5">
      <div className="min-w-[600px] max-w-[650px] rounded-xl flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-5 bg-secondary w-full pt-5 px-5 rounded-t-xl">
          <div className="flex flex-col items-center gap-2">
            <h1 className="w-fit text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#48038C] to-[#00F0FF]">
              Cài đặt
            </h1>
            <span>Quản lý thông tin tài khoản của bạn</span>
          </div>
          <div className="flex gap-5 justify-start w-full">
            <NavLink
              to={`/recruiter/profile/${userId}`}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-primary border-b-2 border-primary"
                  : "text-text5 hover:text-primary"
              }
            >
              Tài khoản
            </NavLink>
            <NavLink
              to={`/recruiter/reset-password/${userId}`}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-primary border-b-2 border-primary"
                  : "text-text5 hover:text-primary"
              }
            >
              Thay đổi mật khẩu
            </NavLink>
          </div>
        </div>
        <div className="w-full p-5 bg-secondary rounded-b-xl">
          <Form {...form}>
            <form
              className="space-y-5 mb-5 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <InputField
                control={form.control}
                name="name"
                placeholder="Tên hiển thị"
                classNameInput="w-full relative"
                labelName={"Tên hiển thị"}
                classNameLabel={"ant-form-item-required"}
                type="text"
              />
              <InputField
                control={form.control}
                name="email"
                placeholder="Nhập email"
                classNameInput="w-full relative"
                labelName={"Email"}
                classNameLabel={"ant-form-item-required"}
                type="email"
              />
              <InputField
                control={form.control}
                name="phoneNumber"
                placeholder="Nhập số điện thoại"
                classNameInput="w-full relative"
                labelName={"Nhập số điện thoại"}
                classNameLabel={"ant-form-item-required"}
                type="text"
              />
              <div className="flex items-center justify-center w-full">
                <Button
                  kind="primary"
                  className="px-10 disabled:opacity-50"
                  type="submit"
                >
                  Cập nhật
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
