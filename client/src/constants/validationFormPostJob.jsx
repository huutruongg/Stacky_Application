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
    .object({
      file: z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "Kích thước hình ảnh tối đa là 5MB.",
      }),
      preview: z.string().nonempty("Vui lòng chọn một ảnh."),
    })
    .refine((image) => ACCEPTED_IMAGE_MIME_TYPES.includes(image.file.type), {
      message: "Chỉ hỗ trợ các định dạng .jpg, .jpeg, .png và .webp.",
    }),
  // Other fields...
  jobTitle: z.string().min(1, "Tên công việc là bắt buộc"),
  typeOfWork: z.string().min(1, "Loại hình công việc là bắt buộc"),
  genderRequired: z.string().min(1, "Giới tính là bắt buộc"),
  location: z.string().min(1, "Địa điểm làm việc là bắt buộc"),
  jobSalary: z.string().min(1, "Mức lương là bắt buộc"),
  candidatesLimit: z.string().min(1, "Số lượng tuyển dụng phải lớn hơn 0"),
  educationRequired: z.string().min(1, "Trình độ học vấn là bắt buộc"),
  yearsOfExperience: z.string().min(1, "Kinh nghiệm làm việc là bắt buộc"),
  typeOfIndustry: z.string().min(1, "Ngành nghề yêu cầu là bắt buộc"),
  staffLevel: z.string().min(1, "Vị trí tuyển dụng là bắt buộc"),
  certificateRequired: z.string().min(1, "Chứng chỉ cần thiết là bắt buộc"),
  professionalSkills: z.string().min(1, "Kỹ năng chuyên môn là bắt buộc"),
  languages: z
    .array(
      z.object({
        language: z.string().optional(),
        level: z.string().optional(),
      })
    )
    .optional(),
  jobBenefit: z.string().min(1, "Mô tả lợi ích nhân viên là bắt buộc"),
  leavePolicy: z.string().optional(),
  jobDescription: z.string().min(1, "Mô tả công việc là bắt buộc"),
  workEnvironment: z.string().optional(),
  applicationDeadline: z
    .date()
    .nullable()
    .refine((date) => date !== null, {
      message: "Ngày kết thúc nộp hồ sơ không được để trống",
    }),
  jobSchedule: z
    .date()
    .nullable()
    .refine((date) => date !== null, {
      message: "Ngày làm việc dự kiến không được để trống",
    }),
});
