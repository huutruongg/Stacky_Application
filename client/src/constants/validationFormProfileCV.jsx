import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const profileCVSchema = (checkExp) =>
  z.object({
    fullName: z.string().nonempty("Họ và Tên không được để trống"),
    jobPosition: z.string().nonempty("Vị trí ứng tuyển không được để trống"),
    publicEmail: z
      .string()
      .email("Địa chỉ email không hợp lệ")
      .nonempty("Email không được để trống"),
    phoneNumber: z.string().nonempty("Số điện thoại không được để trống"),
    gender: z.string().min(1, "Giới tính không được để trống"),
    birthDate: z
      .date()
      .nullable()
      .refine((date) => !date || date <= new Date(), {
        message: "Ngày sinh không được là ngày trong tương lai",
      })
      .refine((date) => date !== null, {
        message: "Ngày sinh không được để trống",
      }),
    avatarUrl: z
      .object({
        file: z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, {
          message: "Kích thước hình ảnh tối đa là 5MB.",
        }),
        preview: z.string().nonempty("Vui lòng chọn một ảnh."),
      })
      .refine((image) => ACCEPTED_IMAGE_MIME_TYPES.includes(image.file.type), {
        message: "Chỉ hỗ trợ các định dạng .jpg, .jpeg, .png và .webp.",
      })
      .optional(),
    address: z.string().optional(),
    githubUrl: z
      .string()
      .optional()
      .refine((value) => !value || value.startsWith("https://github.com/"), {
        message:
          "URL GitHub không hợp lệ. URL phải bắt đầu với https://github.com/",
      }),
    linkedinUrl: z.string().optional(),
    personalDescription: z
      .string()
      .nonempty("Giới thiệu bản thân không được để trống"),

    // Languages
    languages: z
      .array(
        z.object({
          language: z.string().optional(),
          level: z.string().optional(),
        })
      )
      .optional(),

    // Projects
    projects: z
      .array(
        z.object({
          projectName: z.string().optional(),
          projectTime: z.string().optional(),
          urlRepo: z.string().optional(),
          projectDescription: z.string().optional(),
        })
      )
      .optional(),

    // Certifications
    certifications: z
      .array(
        z.object({
          certificateName: z.string().optional(),
          dateOfReceipt: z
            .date()
            .nullable()
            .refine((date) => !date || date <= new Date(), {
              message: "Ngày cấp chứng chỉ không được là ngày trong tương lai",
            })
            .optional(),
          certificateDetail: z.string().optional(),
        })
      )
      .optional(),

    // Programming Skills
    programmingSkills: z.string().optional(),

    // Education
    educations: z
      .array(
        z.object({
          schoolName: z.string().nonempty("Tên trường không được để trống"),
          startDate: z
            .date()
            .nullable()
            .refine((date) => !date || date <= new Date(), {
              message: "Ngày bắt đầu không được là ngày trong tương lai",
            })
            .refine((date) => date !== null, {
              message: "Ngày bắt đầu không được để trống",
            }),
          finishDate: z
            .date()
            .nullable()
            .refine((date) => !date || date <= new Date(), {
              message: "Ngày kết thúc không được là ngày trong tương lai",
            })
            .refine((date) => date !== null, {
              message: "Ngày kết thúc không được để trống",
            }),
          fieldName: z.string().nonempty("Chuyên ngành không được để trống"),
        })
      )
      .optional(),

    // Work Experiences
    experiences: checkExp
      ? z.array(
          z.object({
            companyName: z.string().nonempty("Tên công ty không được để trống"),
            startDate: z
              .date()
              .nullable()
              .refine((date) => !date || date <= new Date(), {
                message:
                  "Ngày bắt đầu làm việc không được là ngày trong tương lai",
              })
              .refine((date) => date !== null, {
                message: "Ngày bắt đầu làm việc không được để trống",
              }),
            endDate: z
              .date()
              .nullable()
              .refine((date) => !date || date <= new Date(), {
                message:
                  "Ngày kết thúc làm việc không được là ngày trong tương lai",
              })
              .refine((date) => date !== null, {
                message: "Ngày kết thúc làm việc không được để trống",
              }),
            jobPosition: z
              .string()
              .nonempty("Vị trí làm việc không được để trống"),
            previousJobDetails: z
              .string()
              .nonempty("Mô tả công việc không được để trống"),
          })
        )
      : z.array(z.any()).optional(),
  });
