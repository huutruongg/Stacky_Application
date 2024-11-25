import { z } from "zod";
import { baseSchemas } from "./baseShemas";

export const registerEmployerSchema = z
  .object({
    privateEmail: baseSchemas.requiredEmail(),
    password: baseSchemas.password(),
    confirmPassword: z.string().nonempty("Xác nhận mật khẩu là bắt buộc"),
    phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
    orgTaxNumber: z.string().min(10, "Số thuế là bắt buộc"),
    orgName: baseSchemas.requiredString("Tên công ty là bắt buộc"),
    orgField: baseSchemas.requiredString("Vui lòng chọn lĩnh vực công ty"),
    orgScale: baseSchemas.requiredString("Vui lòng chọn quy mô công ty"),
    orgAddress: baseSchemas.requiredString("Vui lòng chọn địa chỉ công ty"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });
