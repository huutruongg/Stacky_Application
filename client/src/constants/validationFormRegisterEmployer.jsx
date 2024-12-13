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
      .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Số điện thoại không hợp lệ")
      .min(10, "Số điện thoại không hợp lệ"),
    orgTaxNumber: z
      .string()
      .regex(/^\d{9,12}$/, "Số thuế không hợp lệ")
      .refine(
        (data) => data.trim() === data,
        "Số thuế không được chứa khoảng trắng đầu và cuối"
      ),
    orgName: z
      .string()
      .regex(
        /^[a-zA-Z0-9\s&,.()/[^a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]{2,50}$/,
        "Tên công ty phải có từ 2 đến 50 ký tự và chỉ được chứa ký tự chữ, số, khoảng trắng và một số ký tự đặc biệt (&,.()'-)"
      )
      .refine(
        (data) => data.trim() === data,
        "Tên công ty không được chứa khoảng trắng đầu và cuối"
      ),
    orgField: baseSchemas
      .requiredString("Vui lòng chọn lĩnh vực công ty")
      .refine(
        (data) => data.trim() === data,
        "Lĩnh vực công ty không được chứa khoảng trắng đầu và cuối"
      ),
    orgScale: baseSchemas
      .requiredString("Vui lòng chọn quy mô công ty")
      .refine(
        (data) => data.trim() === data,
        "Quy mô công ty không được chứa khoảng trắng đầu và cuối"
      ),
    orgAddress: z
      .string()
      .regex(
        /^[a-zA-Z0-9À-ỹ\s,.'()-]{3,255}$/,
        "Địa chỉ công ty phải có từ 3 đến 255 ký tự và chỉ được chứa ký tự chữ, số, khoảng trắng và một số ký tự đặc biệt (,.'()-)"
      )
      .refine(
        (data) => data.trim() === data,
        "Địa chỉ công ty không được chứa khoảng trắng ở đầu hoặc cuối"
      )
      .refine(
        (data) => !/[,.()'-]{2,}/.test(data),
        "Địa chỉ công ty không được chứa các ký tự đặc biệt liên tiếp (,, .. --)"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });
