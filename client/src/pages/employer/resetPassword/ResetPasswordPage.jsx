import InputField from "@/components/fieldForm/InputField";
import IconPassword from "@/components/icons/IconPassword";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/button/Button";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/lib/authorizedAxios";
import toast from "react-hot-toast";
import IconEye from "@/components/icons/IconEye";
import IconEyeHiden from "@/components/icons/IconEyeHiden";
import useAuth from "@/hooks/useAuth";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const ResetPasswordPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const form = useForm({
    resolver: zodResolver(
      z
        .object({
          password: z.string().regex(passwordRegex, {
            message:
              "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
          }),
          confirmPassword: z
            .string()
            .nonempty("Xác nhận mật khẩu không được để trống"),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Mật khẩu và xác nhận mật khẩu không khớp",
          path: ["confirmPassword"],
        })
    ),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(
        `/recruiter/reset-password/${userId}`,
        { password: data.password }
      );

      if (response.data.success) {
        toast.success("Đã đặt lại mật khẩu thành công!");
        setIsSuccess(true);
        if (user) {
          logout();
        } else {
          navigate("/account.stacky.vn");
        }
      } else {
        setErrorMessage(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại!");
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
            <span>Liên kết tài khoản của bạn để tiếp tục sử dụng dịch vụ</span>
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
        {errorMessage && (
          <div className="text-red-600 mt-3">{errorMessage}</div>
        )}
        <div className="w-full p-5 bg-secondary rounded-b-xl">
          <Form {...form}>
            <form
              className="space-y-5 mb-5 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <InputField
                control={form.control}
                name="password"
                placeholder="Mật khẩu"
                icon={<IconPassword />}
                classNameInput="w-full relative"
                labelName={"Mật khẩu"}
                classNameLabel={"ant-form-item-required"}
                type={showPassword ? "text" : "password"}
                onClick={handleShowPassword}
                iconPassword={
                  !showPassword ? (
                    <IconEye
                      className="cursor-pointer w-6 h-6"
                      color={"#686B6E"}
                    />
                  ) : (
                    <IconEyeHiden
                      className="cursor-pointer w-6 h-6"
                      color={"#686B6E"}
                    />
                  )
                }
              />
              <InputField
                control={form.control}
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                icon={<IconPassword />}
                classNameInput="w-full relative"
                labelName={"Nhập lại mật khẩu"}
                classNameLabel={"ant-form-item-required"}
                type={showConfirmPassword ? "text" : "password"}
                onClick={handleShowConfirmPassword}
                iconPassword={
                  showConfirmPassword ? (
                    <IconEye
                      className="cursor-pointer w-6 h-6"
                      color={"#686B6E"}
                    />
                  ) : (
                    <IconEyeHiden
                      className="cursor-pointer w-6 h-6"
                      color={"#686B6E"}
                    />
                  )
                }
              />
              <div className="flex items-center justify-center w-full">
                <Button
                  kind="primary"
                  className="px-10 disabled:opacity-50"
                  type="submit"
                  disabled={isSuccess}
                >
                  Đặt lại mật khẩu
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
