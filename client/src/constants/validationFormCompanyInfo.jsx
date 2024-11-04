import { z } from "zod";

export const companyInfoSchema = z.object({
  orgImage: z
    .string()
    .url("Vui lòng nhập một URL hợp lệ cho ảnh công ty.")
    .optional(),
  orgName: z.string().min(1, "Tên công ty là bắt buộc"),
  orgScale: z.string().min(1, "Quy mô công ty là bắt buộc"),
  orgIntroduction: z.string().min(1, "Giới thiệu công ty là bắt buộc"),
  orgField: z.string().min(1, "Ngành nghề chính của công ty là bắt buộc"),
  orgFacebookLink: z
    .string()
    .url("Vui lòng nhập một URL hợp lệ cho Facebook.")
    .optional(),
  orgLinkedinLink: z
    .string()
    .url("Vui lòng nhập một URL hợp lệ cho LinkedIn.")
    .optional(),
  orgYoutubeLink: z
    .string()
    .url("Vui lòng nhập một URL hợp lệ cho YouTube.")
    .optional(),
  orgAddress: z.string().min(1, "Địa điểm công ty là bắt buộc"),
  orgBenefit: z.string().min(1, "Lợi ích của công ty là bắt buộc"),
  orgCoverImage: z
    .string()
    .url("Vui lòng nhập một URL hợp lệ cho ảnh bìa.")
    .optional(),
  orgImages: z
    .array(z.string().url("Vui lòng nhập một URL hợp lệ cho hình ảnh."))
    .optional(),
});
