import React, { useCallback, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import IconEmail from "@/components/icons/IconEmail";
import IconPassword from "@/components/icons/IconPassword";
import IconEye from "@/components/icons/IconEye";
import IconEyeHiden from "@/components/icons/IconEyeHiden";
import Button from "@/components/button/Button";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { LoginRecruiterSchema } from "@/constants/validationFormLoginRecruiter";
import axiosInstance from "@/lib/authorizedAxios";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import InputField from "@/components/fieldForm/InputField";
import { Modal } from "@/components/ui/modal";
import ModalResetPassword from "./ModalResetPassword";
import { AlertModal } from "@/components/shared/AlertModal";
import IconTick from "@/components/icons/IconTick";
import { decodeJWT } from "@/utils/jwt";

const FormSignInEmployer = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Sử dụng login từ context
  const [loading, setLoading] = useState(false); // Loading state
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const onClose = () => setIsOpen(false);
  const onCloseUpdate = () => setOpenUpdate(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  // Sử dụng hook form với zod validation
  const form = useForm({
    resolver: zodResolver(LoginRecruiterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Hàm xử lý submit, sử dụng useCallback để tránh re-creation của hàm
  const onSubmit = useCallback(
    async (values) => {
      setLoading(true); // Bắt đầu loading
      try {
        const { email, password } = values;

        // Gửi request đăng nhập
        const { data } = await axiosInstance.post(`/auth/login`, {
          privateEmail: email,
          password,
        });

        const response = await axiosInstance.get("/auth/get-access-token", {
          withCredentials: true,
        });
        const accessToken = response.data.accessToken;

        const decodedAccessToken = decodeJWT(accessToken);
        const { userId, email: userEmail, role: roleName } = decodedAccessToken;

        const userInfo = { userId, email: userEmail, role: roleName };

        login(userInfo, accessToken); // Sử dụng hàm login từ context để lưu user và token

        // Điều hướng sau khi đăng nhập thành công
        navigate("/company-profile");
      } catch (error) {
        console.error("Login failed:", error);
        toast.error(
          "Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại."
        );
      } finally {
        setLoading(false); // Kết thúc loading
      }
    },
    [login, navigate]
  );

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <Form {...form}>
        <form
          className="space-y-5 mb-5 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <InputField
            control={form.control}
            name="email"
            placeholder="Email"
            icon={<IconEmail />}
            classNameInput="w-full relative"
            labelName={"Email"}
          />
          <InputField
            control={form.control}
            name="password"
            placeholder="Mật khẩu"
            icon={<IconPassword />}
            classNameInput="w-full relative"
            labelName={"Mật khẩu"}
            type={showPassword ? "text" : "password"}
            onClick={handleShowPassword}
            iconPassword={
              !showPassword ? (
                <IconEye className="cursor-pointer w-6 h-6" color={"#686B6E"} />
              ) : (
                <IconEyeHiden
                  className="cursor-pointer w-6 h-6"
                  color={"#686B6E"}
                />
              )
            }
          />
          <div className="w-full">
            <Button
              kind="primary"
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}{" "}
              {/* Show loading state */}
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex items-center justify-end w-full">
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          loading={loading}
        />
        <Modal
          isOpen={openUpdate}
          onClose={onCloseUpdate}
          className={"!bg-white !px-1 min-w-[600px]"}
          title="Quên mật khẩu"
          icon={<IconTick color={"#48038C"} className={"w-10 h-10"} />}
          description="Hãy kiểm tra email của bạn. Sau đó nhấn vào link trong hộp thư để đổi lại mật khẩu."
        >
          <ModalResetPassword modalClose={onCloseUpdate} />
        </Modal>
        <button
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#48038C] to-[#00F0FF] hover:decoration-primary hover:underline hover:decoration-1"
          onClick={() => setOpenUpdate(true)}
        >
          Quên mật khẩu?
        </button>
      </div>
    </div>
  );
};

export default FormSignInEmployer;
