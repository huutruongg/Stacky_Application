import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Define the validation schema for a job posting form
export const postJobSchema = z.object({
  jobImage: z
    .string()
    .url("Vui lòng nhập một URL hợp lệ cho ảnh công việc.")
    .optional(),
  jobTitle: z
    .string()
    .min(1, "Tên công việc là bắt buộc")
    .refine(
      (data) => data.trim() === data,
      "Tên công việc không được chứa khoảng trắng đầu và cuối"
    ),
  typeOfWork: z
    .string()
    .min(1, "Loại hình công việc là bắt buộc")
    .refine(
      (data) => data.trim() === data,
      "Loại hình công việc không được chứa khoảng trắng đầu và cuối"
    ),
  genderRequired: z.string().min(1, "Giới tính là bắt buộc"),
  location: z
    .string()
    .min(1, "Địa điểm làm việc là bắt buộc")
    .refine(
      (data) => data.trim() === data,
      "Địa điểm không được chứa khoảng trắng đầu và cuối"
    ),
  jobSalary: z
    .string()
    .transform((value) => Number(value))
    .refine((value) => Number.isInteger(value) && value > 0, {
      message: "Mức lương phải là số nguyên dương",
    }),
  candidatesLimit: z
    .string()
    .transform((value) => Number(value))
    .refine((value) => Number.isInteger(value) && value > 0, {
      message: "Số lượng tuyển dụng phải là số nguyên dương",
    }),
  educationRequired: z
    .string()
    .min(1, "Trình độ học vấn là bắt buộc")
    .refine(
      (data) => data.trim() === data,
      "Trình độ học vấn không được chứa khoảng trắng đầu và cuối"
    ),
  yearsOfExperience: z
    .string()
    .min(1, "Kinh nghiệm làm việc là bắt buộc")
    .refine(
      (data) => data.trim() === data,
      "Kinh nghiệm không được chứa khoảng trắng đầu và cuối"
    ),
  typeOfIndustry: z
    .string()
    .min(1, "Ngành nghề yêu cầu là bắt buộc")
    .refine(
      (data) => data.trim() === data,
      "Ngành nghề không được chứa khoảng trắng đầu và cuối"
    ),
  staffLevel: z
    .string()
    .min(1, "Vị trí tuyển dụng là bắt buộc")
    .refine(
      (data) => data.trim() === data,
      "Vị trí không được chứa khoảng trắng đầu và cuối"
    ),
  certificateRequired: z
    .string()
    .min(1, "Chứng chỉ cần thiết là bắt buộc")
    .refine(
      (data) => data.trim() === data,
      "Chứng chỉ không được chứa khoảng trắng đầu và cuối"
    ),
  professionalSkills: z
    .string()
    .min(1, "Kỹ năng chuyên môn là bắt buộc")
    .refine(
      (data) => data.trim() === data,
      "Kỹ năng không được chứa khoảng trắng đầu và cuối"
    ),
  languagesRequired: z
    .array(
      z.object({
        language: z.string().optional(),
        level: z.string().optional(),
      })
    )
    .optional(),
  jobBenefit: z
    .string()
    .min(1, "Mô tả lợi ích nhân viên là bắt buộc")
    .regex(/^[^\s]+$/, "Mô tả không được chứa khoảng trắng"),
  leavePolicy: z.string().optional(),
  jobDescription: z
    .string()
    .min(1, "Mô tả công việc là bắt buộc")
    .regex(/^[^\s]+$/, "Mô tả không được chứa khoảng trắng"),
  workEnvironment: z.string().optional(),
  applicationDeadline: z
    .date()
    .nullable()
    .refine((date) => date !== null, {
      message: "Thời gian không được để trống",
    })
    .refine((date) => date !== null && date > new Date(), {
      message: "Thời gian kết thúc nộp hồ sơ phải hơn ngày thực tế",
    }),
  jobSchedule: z
    .date()
    .nullable()
    .refine((date) => date !== null, {
      message: "Thời gian làm việc dự kiến không được để trống",
    })
    .refine((date) => date !== null && date > new Date(), {
      message: "Thời gian làm việc dự kiến phải hơn ngày thực tế",
    }),
});
