import { z } from "zod";

export const profileCVSchema = (hasExperience) =>
  z.object({
    fullName: z
      .string()
      .nonempty("Họ và Tên không được để trống")
      .refine(
        (data) => /^[A-ZÀ-ỹ][a-zà-ỹ]*(?: [A-ZÀ-ỹ][a-zà-ỹ]*){1,50}$/.test(data),
        "Họ và Tên không hợp lệ"
      ),
    jobPosition: z
      .string()
      .nonempty("Vị trí ứng tuyển không được để trống")
      .regex(
        /^[a-zA-Z0-9À-ỹ\s,.'()-]{2,50}$/,
        "Vị trí ứng tuyển phải có từ 2 đến 50 ký tự và chỉ được chứa ký tự chữ, số, khoảng trắng và một số ký tự đặc biệt (&,.()'-)"
      )
      .refine(
        (data) => data.trim() === data,
        "Vị trí ứng tuyển không được chứa khoảng trắng đầu và cuối"
      ),
    publicEmail: z
      .string()
      .email("Địa chỉ email không hợp lệ")
      .nonempty("Email không được để trống")
      .refine(
        (data) => data.trim() === data,
        "Email không được chứa khoảng trắng đầu và cuối"
      ),
    phoneNumber: z
      .string()
      .nonempty("Số điện thoại không được để trống") // Ensures the field is not empty
      .min(10, "Số điện thoại phải có ít nhất 10 ký tự") // Validates the minimum length
      .refine(
        (data) => /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(data),
        "Số điện thoại không hợp lệ"
      ),
    birthDate: z
      .date()
      .nullable()
      .refine((date) => !date || date <= new Date(), {
        message: "Ngày sinh không được là ngày trong tương lai",
      })
      .refine((date) => date !== null, {
        message: "Ngày sinh không được để trống",
      })
      .refine(
        (date) => {
          const today = new Date();
          const birthDate = new Date(date);
          let age = today.getFullYear() - birthDate.getFullYear();
          let m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age >= 18;
        },
        {
          message: "Bạn phải đủ 18 tuổi để đăng ký",
        }
      ),
    avatarUrl: z.string().optional().nullable(),
    address: z
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
    githubUrl: z
      .string()
      .nonempty("URL GitHub không được để trống")
      .refine((value) => !value || value.startsWith("https://github.com/"), {
        message:
          "URL GitHub không hợp lệ. URL phải bắt đầu với https://github.com/",
      }),
    linkedinUrl: z
      .string()
      .optional()
      .refine(
        (value) => !value || value.startsWith("https://www.linkedin.com/"),
        {
          message:
            "URL LinkedIn không hợp lệ. URL phải bắt đầu với https://www.linkedin.com/",
        }
      ),
    personalDescription: z
      .string()
      .nonempty("Giới thiệu bản thân không được để trống"),

    // Languages
    languages: z
      .array(
        z.object({
          language: z.string().min(1, "Ngôn ngữ không được để trống"),
          level: z.string().min(1, "Trình độ ngôn ngữ không được để trống"),
        })
      )
      .optional(),

    // Programming Skills
    professionalSkills: z.string().optional(),

    // Education
    educations: z
      .array(
        z.object({
          schoolName: z
            .string()
            .nonempty("Tên trường không được để trống")
            .regex(
              /^[a-zA-ZÀ-ỹ\s]{2,100}$/,
              "Tên trường phải có từ 2 đến 100 ký tự và chỉ được chứa ký tự chữ, số, khoảng trắng và một số ký tự đặc biệt (&,.()'-)"
            )
            .refine(
              (data) => data.trim() === data,
              "Tên trường không được chứa khoảng trắng đầu và cuối"
            ),
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
          fieldName: z
            .string()
            .regex(
              /^[a-zA-ZÀ-ỹ\s]{2,50}$/,
              "Chuyên ngành phải có từ 2 đến 50 ký tự và chỉ được chứa ký tự chữ, số, khoảng trắng và một số ký tự đặc biệt (&,.()'-)"
            )
            .nonempty("Chuyên ngành không được để trống"),
        })
      )
      .optional(),

    // Work Experiences
    experiences: hasExperience
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
              .regex(
                /^[a-zA-ZÀ-ỹ\s]{2,50}$/,
                "Vị trí làm việc phải có từ 2 đến 50 ký tự và chỉ được chứa ký tự chữ, số, khoảng trắng và một số ký tự đặc biệt (&,.()'-)"
              )
              .nonempty("Vị trí làm việc không được để trống"),
            previousJobDetails: z
              .string()
              .nonempty("Mô tả công việc không được để trống"),
          })
        )
      : z.array(z.any()).optional(),
    certifications: z
      .array(
        z.object({
          certificateName: z
            .string()
            .nonempty("Tên chứng chỉ không được để trống")
            .min(3, "Tên chứng chỉ phải có ít nhất 3 ký tự")
            .max(100, "Tên chứng chỉ không được quá 100 ký tự"),
          dateOfReceipt: z
            .date()
            .nullable()
            .refine((date) => !date || date <= new Date(), {
              message: "Ngày cấp chứng chỉ không được là ngày trong tương lai",
            })
            .refine((date) => date !== null, {
              message: "Ngày cấp chứng chỉ không được để trống",
            }),
          certificateDetail: z
            .string()
            .nonempty("Thông tin chi tiết không được để trống")
            .min(10, "Thông tin chi tiết phải có ít nhất 10 ký tự"),
        })
      )
      .optional(),

    projects: z
      .array(
        z.object({
          projectName: z
            .string()
            .nonempty("Tên dự án không được để trống")
            .min(3, "Tên dự án phải có ít nhất 3 ký tự")
            .max(100, "Tên dự án không được quá 100 ký tự"),
          projectTime: z
            .string()
            .nonempty("Thời gian dự án không được để trống")
            .regex(
              /^\d{1,2}\/\d{4}-\d{1,2}\/\d{4}$/,
              "Thời gian dự án phải có định dạng hợp lệ (MM/YYYY-MM/YYYY)"
            )
            .refine((date) => date !== null, {
              message: "Thời gian dự án không được để trống",
            }),
          urlRepo: z
            .string()
            .nonempty("URL GitHub không được để trống")
            .refine((value) => !value || value.startsWith("https://"), {
              message: "URL GitHub phải bắt đầu với https://",
            }),
          projectDescription: z
            .string()
            .nonempty("Mô tả dự án không được để trống")
            .min(10, "Mô tả dự án phải có ít nhất 10 ký tự"),
        })
      )
      .optional(),
  });
