import { z } from "zod";
import { baseSchemas } from "./baseShemas";

export const registerEmployerSchema = z
  .object({
    privateEmail: baseSchemas
      .requiredEmail()
      .regex(/^[^\s]+$/, "Email không được chứa khoảng trắng"),
    password: baseSchemas.password(),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
    phoneNumber: z
      .string()
      .regex(
        /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g,
        "Số điện thoại không hợp lệ"
      )
      .min(10, "Số điện thoại không hợp lệ"),
    orgTaxNumber: z
      .string()
      .min(10, "Số thuế là bắt buộc")
      .regex(/^[^\s]+$/, "Số thuế không được chứa khoảng trắng"),
    orgName: baseSchemas
      .requiredString("Tên công ty là bắt buộc")
      .regex(/^[^\s]+$/, "Tên công ty không được chứa khoảng trắng"),
    orgField: baseSchemas
      .requiredString("Vui lòng chọn lĩnh vực công ty")
      .regex(/^[^\s]+$/, "Lĩnh vực công ty không được chứa khoảng trắng"),
    orgScale: baseSchemas
      .requiredString("Vui lòng chọn quy mô công ty")
      .regex(/^[^\s]+$/, "Quy mô công ty không được chứa khoảng trắng"),
    orgAddress: baseSchemas
      .requiredString("Vui lòng chọn địa chỉ công ty")
      .regex(/^[^\s]+$/, "Địa chỉ công ty không được chứa khoảng trắng"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });
