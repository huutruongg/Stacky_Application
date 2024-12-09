import { z } from "zod";

export const companyInfoSchema = z.object({
  orgImage: z
    .string()
    .url("Vui lòng nhập một URL hợp lệ cho ảnh công ty.")
    .optional()
    .nullable(),
  orgName: z
    .string()
    .min(1, "Tên công ty là bắt buộc")
    .refine(
      (data) => data.trim() === data,
      "Tên công ty không được chứa khoảng trắng đầu và cuối"
    ),
  orgScale: z
    .string()
    .min(1, "Quy mô công ty là bắt buộc")
    .refine(
      (data) => data.trim() === data,
      "Tên công ty không được chứa khoảng trắng đầu và cuối"
    ),
  orgIntroduction: z.string().min(1, "Giới thiệu công ty là bắt buộc"),
  orgField: z
    .string()
    .min(1, "Ngành nghề chính của công ty là bắt buộc")
    .refine(
      (data) => data.trim() === data,
      "Ngành nghề chính công ty không được chứa khoảng trắng đầu và cuối"
    ),
  orgFacebookLink: z
    .string()
    .url("Vui lòng nhập một URL hợp lệ cho Facebook.")
    .optional()
    .nullable(),
  orgLinkedinLink: z
    .string()
    .url("Vui lòng nhập một URL hợp lệ cho LinkedIn.")
    .optional()
    .nullable(),
  orgYoutubeLink: z
    .string()
    .url("Vui lòng nhập một URL hợp lệ cho YouTube.")
    .optional()
    .nullable(),
  orgAddress: z
    .string()
    .min(1, "Địa điểm công ty là bắt buộc")
    .refine(
      (data) => data.trim() === data,
      "Địa điểm công ty không được chứa khoảng trắng đầu và cuối"
    ),
  orgBenefits: z.string().min(1, "Lợi ích của công ty là bắt buộc"),
  orgCoverImage: z
    .string()
    .url("Vui lòng nhập một URL hợp lệ cho ảnh bìa.")
    .optional()
    .nullable(),
  orgImages: z.array(z.string()).optional().default([]),
});
