import React, { useState } from "react";
import Button from "@/components/button/Button";
import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";
import { Form } from "@/components/ui/form";
import axiosInstance from "@/lib/authorizedAxios";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/fieldForm/InputField";
import { z } from "zod";
import toast from "react-hot-toast";

const ModalResetPassword = ({ modalClose }) => {
  const [emailSent, setEmailSent] = useState(false);
  const form = useForm({
    resolver: zodResolver(
      z.object({
        privateEmail: z
          .string()
          .email("Email không hợp lệ")
          .nonempty("Email là bắt buộc"),
      })
    ),
    defaultValues: {
      privateEmail: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(
        `/recruiter/forgot-password`,
        data
      );
      setEmailSent(true); // Đánh dấu email đã được gửi
      toast.success("Đã gửi email.");
      // const userId = response.data.userId; // Assuming this contains the userId
      // navigate(`/recruiter/reset-password/${userId}`);
    } catch (error) {
      console.error(error.status);
      if (error.status === 404) {
        toast.error("Email không tồn tại!");
      } else if (error.status === 403) {
        toast.error(
          "Account này chưa được đăng ký là Employer, bạn vui lòng thử lại với tài khoản khác."
        );
      }
    }
  };

  return (
    <div className="flex flex-col gap-10 mt-5 px-10">
      {!emailSent ? (
        <div className="">
          <div className="flex flex-col gap-3">
            <Form {...form}>
              <form
                className="space-y-10 mb-5 w-full"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <InputField
                  control={form.control}
                  name="privateEmail"
                  placeholder="Nhập email"
                  labelName={"Email"}
                />
                <div className="flex items-center justify-center w-full ">
                  <Button
                    kind="primary"
                    className="px-10 disabled:opacity-50"
                    type="submit"
                  >
                    Gửi link để tạo lại mật khẩu
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <div className="flex items-center justify-between w-full">
            <ItemModalClose
              children={"Quay lại đăng nhập"}
              onClick={modalClose}
            />
            <ItemModalClose
              children={"Đăng ký tài khoản mới"}
              onClick={modalClose}
            />
          </div>
        </div>
      ) : (
        <div className="p-5 bg-[#daffe7] text-accepted font-normal rounded-md">
          <span>
            Gửi thành công, vui lòng kiểm tra hòm thư của bạn để tiến hành thay
            đổi mật khẩu!
          </span>
        </div>
      )}
    </div>
  );
};

const ItemModalClose = ({ children, onClick = () => {} }) => {
  return (
    <Link
      to="/account.stacky.vn"
      className="text-transparent bg-clip-text bg-gradient-to-r from-[#48038C] to-[#00F0FF]"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default ModalResetPassword;
