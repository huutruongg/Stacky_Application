import { z } from "zod";

export const profileCVSchema = (hasExperience) =>
  z.object({
    fullName: z
      .string()
      .nonempty("Họ và Tên không được để trống")
      .refine(
        (data) => /^[A-Za-z][A-Za-z0-9_]{7,29}$/.test(data),
        "Họ và Tên không hợp lệ"
      ).regex(/^[^\s]+$/, "Họ và Tên không được chứa khoảng trắng"),
    jobPosition: z.string().nonempty("Vị trí ứng tuyển không được để trống").regex(/^[^\s]+$/, "Vị trí không được chứa khoảng trắng"),
    publicEmail: z
      .string()
      .email("Địa chỉ email không hợp lệ")
      .nonempty("Email không được để trống")
      .regex(/^[^\s]+$/, "Email không được chứa khoảng trắng"),
    phoneNumber: z
      .string()
      .regex(
        /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g,
        "Số điện thoại không hợp lệ"
      )
      .min(10, "Số điện thoại không hợp lệ"),
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
    avatarUrl: z.string().optional().nullable(),
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
    professionalSkills: z.string().optional(),

    // Education
    educations: z
      .array(
        z.object({
          schoolName: z.string().nonempty("Tên trường không được để trống").regex(/^[^\s]+$/, "Tên trường không được chứa khoảng trắng"),
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
          fieldName: z.string().nonempty("Chuyên ngành không được để trống").regex(/^[^\s]+$/, "Chuyên ngành không được chứa khoảng trắng"),
        })
      )
      .optional(),

    // Work Experiences
    experiences: hasExperience
      ? z.array(
          z.object({
            companyName: z.string().nonempty("Tên công ty không được để trống").regex(/^[^\s]+$/, "Tên công ty không được chứa khoảng trắng"),
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
              .nonempty("Vị trí làm việc không được để trống").regex(/^[^\s]+$/, "Vị trí không được chứa khoảng trắng"),
            previousJobDetails: z
              .string()
              .nonempty("Mô tả công việc không được để trống").regex(/^[^\s]+$/, "Mô tả không được chứa khoảng trắng"),
          })
        )
      : z.array(z.any()).optional(),
  });
