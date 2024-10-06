import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export const registerEmployerSchema = z
  .object({
    privateEmail: z
      .string()
      .email("Email không hợp lệ")
      .nonempty("Email là bắt buộc"),
    password: z
      .string()
      .regex(passwordRegex, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z.string().nonempty("Xác nhận mật khẩu là bắt buộc"),
    phoneNumber: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
    orgTaxNumber: z.string().min(10, { message: "Số thuế là bắt buộc" }),
    orgName: z.string().min(1, { message: "Tên công ty là bắt buộc" }),
    orgField: z
      .string()
      .nonempty({ message: "Vui lòng chọn lĩnh vực công ty" }),
    orgScale: z.string().nonempty({ message: "Vui lòng chọn quy mô công ty" }),
    orgAddress: z
      .string()
      .nonempty({ message: "Vui lòng chọn địa chỉ công ty" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["confirmPassword"], // Chỉ định lỗi cho trường confirmPassword
  });
