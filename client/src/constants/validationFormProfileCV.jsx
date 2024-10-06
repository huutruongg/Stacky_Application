import { z } from "zod";

export const profileCVSchema = z.object({
  name: z.string().nonempty("Họ và Tên không được để trống"),
  position: z.string().nonempty("Vị trí ứng tuyển không được để trống"),
  email: z
    .string()
    .email("Địa chỉ email không hợp lệ")
    .nonempty("Email không được để trống"),
  phone: z.string().nonempty("Số điện thoại không được để trống"),
  gender: z.string().nonempty("Giới tính không được để trống"),
  dob: z
    .date()
    .nullable()
    .refine((date) => !date || date <= new Date(), {
      message: "Ngày sinh không được là ngày trong tương lai",
    })
    .refine((date) => date !== null, {
      message: "Ngày sinh không được để trống",
    }),
  avatar: z.string().optional(),
  address: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  introduction: z.string().nonempty("Giới thiệu bản thân không được để trống"),

  // Languages
  languages: z
    .array(
      z.object({
        language: z.string().optional(),
        proficiency: z.string().optional(),
      })
    )
    .optional(),

  // Projects
  projects: z
    .array(
      z.object({
        projectName: z.string().optional(),
        projectDuration: z.string().optional(),
        githubLink: z.string().optional(),
        projectIntroduction: z.string().optional(),
      })
    )
    .optional(),

  // Certifications
  certifications: z
    .array(
      z.object({
        certificationName: z.string().optional(),
        certificationDate: z
          .date()
          .nullable()
          .refine((date) => !date || date <= new Date(), {
            message: "Ngày cấp chứng chỉ không được là ngày trong tương lai",
          })
          .optional(),
        certificationDetails: z.string().optional(),
      })
    )
    .optional(),

  // Programming Skills
  programmingSkills: z.string().optional(),
  
  // Education
  educations: z
    .array(
      z.object({
        educationName: z.string().nonempty("Tên trường không được để trống"),
        educationFirstDate: z
          .date()
          .nullable()
          .refine((date) => !date || date <= new Date(), {
            message: "Ngày bắt đầu không được là ngày trong tương lai",
          })
          .refine((date) => date !== null, {
            message: "Ngày bắt đầu không được để trống",
          }),
        educationEndDate: z
          .date()
          .nullable()
          .refine((date) => !date || date <= new Date(), {
            message: "Ngày kết thúc không được là ngày trong tương lai",
          })
          .refine((date) => date !== null, {
            message: "Ngày kết thúc không được để trống",
          }),
        educationMajor: z
          .string()
          .nonempty("Chuyên ngành không được để trống"),
      })
    )
    .optional(),
  
  // Work Experiences
  workExperiences: z
    .array(
      z.object({
        companyName: z.string().nonempty("Tên công ty không được để trống"),
        companyFirstDate: z
          .date()
          .nullable()
          .refine((date) => !date || date <= new Date(), {
            message: "Ngày bắt đầu làm việc không được là ngày trong tương lai",
          })
          .refine((date) => date !== null, {
            message: "Ngày bắt đầu làm việc không được để trống",
          }),
        companyEndDate: z
          .date()
          .nullable()
          .refine((date) => !date || date <= new Date(), {
            message: "Ngày kết thúc làm việc không được là ngày trong tương lai",
          })
          .refine((date) => date !== null, {
            message: "Ngày kết thúc làm việc không được để trống",
          }),
        workPosition: z
          .string()
          .nonempty("Vị trí làm việc không được để trống"),
        workDescription: z
          .string()
          .nonempty("Mô tả công việc không được để trống"),
      })
    )
    .optional(),
});
