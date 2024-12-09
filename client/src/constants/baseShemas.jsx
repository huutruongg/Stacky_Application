import { z } from "zod";

export const baseSchemas = {
  requiredString: (message) =>
    z
      .string()
      .min(1, message)
      .refine(
        (data) => data.trim() === data,
        "Tên công ty không được chứa khoảng trắng đầu và cuối"
      ),

  requiredEmail: (message) =>
    z
      .string()
      .email(message || "Email không hợp lệ")
      .min(1, "Email không được để trống")
      .regex(/^[^\s]+$/, "Email không được chứa khoảng trắng"),

  optionalUrl: (message) => z.string().url(message).optional().nullable(),

  requiredDate: (message) =>
    z
      .date()
      .nullable()
      .refine((date) => date !== null, {
        message: message || "Ngày không được để trống",
      })
      .refine((date) => !date || date <= new Date(), {
        message: "Ngày không được là ngày trong tương lai",
      }),

  optionalArray: (schema) => z.array(schema).optional().nullable().default([]),

  password: () =>
    z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt"
      ),
};
