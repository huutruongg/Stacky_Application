import InputField from "@/components/fieldForm/InputField";
import IconPassword from "@/components/icons/IconPassword";
import React, { useState } from "react"; // Import useState
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/button/Button";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/lib/authorizedAxios";
import toast from "react-hot-toast"; // Import toast for notifications

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL
  const [isSuccess, setIsSuccess] = useState(false); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  console.log(userId);

  const form = useForm({
    resolver: zodResolver(
      z
        .object({
          password: z.string().regex(passwordRegex, {
            message:
              "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
          }),
          confirmPassword: z.string().nonempty("Xác nhận mật khẩu là bắt buộc"),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Mật khẩu và xác nhận mật khẩu không khớp",
          path: ["confirmPassword"], // Specify error for confirmPassword field
        })
    ),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data.password);
    try {
      const password = data.password;
      const response = await axiosInstance.post(
        `/recruiter/reset-password/${userId}`,
        { password }
      );

      if (response.data.success) {
        setIsSuccess(true);
        toast.success("Đã đặt lại mật khẩu thành công!");
        navigate("/account.stacky.vn");
      } else {
        setErrorMessage(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại!");
      toast.error("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="min-w-[600px] max-w-[650px] p-5 bg-secondary rounded-xl flex flex-col justify-center items-center gap-5">
        <h1 className="w-fit text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#48038C] to-[#00F0FF]">
          Cài đặt lại mật khẩu
        </h1>
        <span>Liên kết tài khoản của bạn để tiếp tục sử dụng dịch vụ</span>
        {isSuccess && (
          <div className="text-green-600">
            Mật khẩu đã được đặt lại thành công!
          </div>
        )}
        {errorMessage && <div className="text-red-600">{errorMessage}</div>}
        <div className="w-full">
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
                type="password"
              />
              <InputField
                control={form.control}
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                icon={<IconPassword />}
                classNameInput="w-full relative"
                labelName={"Nhập lại mật khẩu"}
                classNameLabel={"ant-form-item-required"}
                type="password"
              />
              <div className="flex items-center justify-center w-full">
                <Button
                  kind="primary"
                  className="px-10 disabled:opacity-50"
                  type="submit"
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
