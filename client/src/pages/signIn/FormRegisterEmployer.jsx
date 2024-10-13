import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Form, FormField } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/Checkbox";
import Button from "@/components/button/Button";
import axiosInstance from "@/lib/authorizedAxios";
import toast from "react-hot-toast";
import InputField from "@/components/fieldForm/InputField";
import SelectField from "@/components/fieldForm/SelectField";
import { registerEmployerSchema } from "@/constants/validationFormRegisterEmployer";

const FormRegisterEmployer = () => {
  const form = useForm({
    resolver: zodResolver(registerEmployerSchema),
    defaultValues: {
      privateEmail: "",
      password: "",
      phoneNumber: "",
      orgTaxNumber: "",
      orgName: "",
      orgField: "",
      orgScale: "",
      orgAddress: "",
    },
  });

  const termsAccepted = form.watch("termsAccepted");

  const onSubmit = async (data) => {
    try {
      registerEmployerSchema.parse(data); // Validate the form data
      const { confirmPassword, ...formData } = data; // Extract fields to exclude
      const response = await axiosInstance.post(
        `/auth/signup/recruiter`,
        formData
      );
      toast.success("Đăng kí thành công!!!");
      // console.log("Response Data:", response.data); // Log the successful response
    } catch (error) {
      // Handle error
      if (error.response) {
        if (error.response.status === 409) {
          // Nếu email đã tồn tại
          toast.error("Email này đã tồn tại! Vui lòng nhập email khác.");
        } else {
          toast.error("Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.");
        }
        // console.error(
        //   "Request failed with status code:",
        //   error.response.status
        // );
        // console.error("Response data:", error.response.data);
      } else {
        console.error("Error in request setup:", error.message);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="bg-secondary rounded-lg p-5">
      <h2 className="w-fit text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#48038C] to-[#00F0FF]">
        Đăng ký tài khoản nhà tuyển dụng
      </h2>
      <Form {...form}>
        <form
          className="space-y-5 mb-5 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <p className="text-primary font-semibold mt-5 mb-2">
            Thông tin đăng nhập
          </p>
          <InputField
            control={form.control}
            name="privateEmail"
            placeholder="Email"
            labelName={"Email"}
          />
          <InputField
            control={form.control}
            name="phoneNumber"
            placeholder="Số điện thoại"
            labelName={"Số điện thoại"}
          />
          <InputField
            control={form.control}
            name="password"
            placeholder="Mật khẩu"
            type="password"
            labelName={"Mật khẩu"}
          />
          <InputField
            control={form.control}
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            type="password"
            labelName={"Xác nhận mật khẩu"}
          />

          <p className="text-primary font-semibold mt-5 mb-2">
            Thông tin công ty
          </p>
          <InputField
            control={form.control}
            name="orgTaxNumber"
            placeholder="Mã số thuế"
            labelName={"Mã số thuế"}
          />
          <InputField
            control={form.control}
            name="orgName"
            placeholder="Tên công ty hiển thị"
            labelName={"Tên công ty "}
          />

          <SelectField
            control={form.control}
            name="orgField"
            labelName={"Lĩnh vực"}
            placeholder="Lĩnh vực"
            options={[
              { value: "technology", label: "Công nghệ" },
              { value: "finance", label: "Tài chính" },
              { value: "education", label: "Giáo dục" },
            ]}
          />
          <SelectField
            control={form.control}
            name="orgScale"
            labelName={"Kỹ năng công ty"}
            placeholder="Kỹ năng công ty"
            options={[
              { value: "Quản lý", label: "Quản lý" },
              { value: "Phần mềm", label: "Phần mềm" },
              { value: "marketing", label: "Marketing" },
            ]}
          />
          <SelectField
            control={form.control}
            name="orgAddress"
            labelName={"Trụ sở công ty"}
            placeholder="Trụ sở công ty"
            options={[
              { value: "Hà Nội", label: "Hà Nội" },
              { value: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
              { value: "Đà Nẵng", label: "Đà Nẵng" },
            ]}
          />

          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <div className="flex gap-2">
                <Checkbox
                  className="h-5 w-5"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label className="leading-6">
                  Tôi đã đọc và chấp nhận{" "}
                  <a href="#" className="text-primary hover:underline">
                    Điều Khoản Sử Dụng
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-primary hover:underline">
                    Chính Sách Bảo Mật
                  </a>{" "}
                  của Stacky
                </Label>
              </div>
            )}
          />

          <div className="flex items-center text-center">
            <Button
              kind="primary"
              className="w-full disabled:opacity-50"
              type="submit"
              disabled={!termsAccepted}
            >
              Đăng ký
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormRegisterEmployer;
