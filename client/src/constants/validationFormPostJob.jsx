import { z } from "zod";

// Define the validation schema for a job posting form
export const postJobSchema = z.object({
  jobImage: z.string().nonempty("Ảnh công việc không được để trống"),
  jobTitle: z
    .string()
    .min(1, "Tên công việc không được để trống")
    .regex(
      /^[a-zA-Z0-9\s&,.()'-/[^a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]{2,50}$/,
      "Tên công việc phải có từ 2 đến 50 ký tự và chỉ được chứa ký tự chữ, số, khoảng trắng và một số ký tự đặc biệt (&,.()'-)"
    )
    .refine(
      (data) => data.trim() === data,
      "Tên công việc không được chứa khoảng trắng đầu và cuối"
    ),
  typeOfWork: z
    .string()
    .min(1, "Loại hình công việc không được để trống")
    .refine(
      (data) => data.trim() === data,
      "Loại hình công việc không được chứa khoảng trắng đầu và cuối"
    ),
  genderRequired: z.string().min(1, "Giới tính không được để trống"),
  location: z
    .string()
    .min(1, "Địa điểm làm việc không được để trống")
    .regex(
      /^[a-zA-Z0-9\s&,.()'-/[^a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]{2,100}$/,
      "Địa điểm làm việc phải có từ 2 đến 100 ký tự và chỉ được chứa ký tự chữ, số, khoảng trắng và một số ký tự đặc biệt (&,.()'-)"
    )
    .refine(
      (data) => data.trim() === data,
      "Địa điểm không được chứa khoảng trắng đầu và cuối"
    ),
  jobSalary: z
    .string()
    .min(1, "Mức lương không được để trống")
    .refine(
      (data) => data.trim() === data,
      "Mức lương không được chứa khoảng trắng đầu và cuối"
    ),
  candidatesLimit: z
    .string()
    .min(1, "Số lượng tuyển dụng không được để trống")
    .transform((value) => Number(value))
    .refine((value) => Number.isInteger(value) && value > 0, {
      message: "Số lượng tuyển dụng phải là số nguyên dương",
    }),
  educationRequired: z
    .string()
    .min(1, "Trình độ học vấn không được để trống")
    .refine(
      (data) => data.trim() === data,
      "Trình độ học vấn không được chứa khoảng trắng đầu và cuối"
    ),
  yearsOfExperience: z
    .string()
    .min(1, "Kinh nghiệm làm việc không được để trống")
    .refine(
      (data) => data.trim() === data,
      "Kinh nghiệm không được chứa khoảng trắng đầu và cuối"
    ),
  typeOfIndustry: z
    .string()
    .min(1, "Ngành nghề yêu cầu không được để trống")
    .regex(
      /^[a-zA-Z0-9\s&,.()'-/[^a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]{2,100}$/,
      "Ngành nghề yêu cầu phải có từ 2 đến 100 ký tự và chỉ được chứa ký tự chữ, số, khoảng trắng và một số ký tự đặc biệt (&,.()'-)"
    )
    .refine(
      (data) => data.trim() === data,
      "Ngành nghề không được chứa khoảng trắng đầu và cuối"
    ),
  staffLevel: z
    .string()
    .min(1, "Vị trí tuyển dụng không được để trống")
    .regex(
      /^[a-zA-Z0-9\s&,.()'-/[^a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]{2,50}$/,
      "Vị trí tuyển dụng phải có từ 2 đến 50 ký tự và chỉ được chứa ký tự chữ, số, khoảng trắng và một số ký tự đặc biệt (&,.()'-)"
    )
    .refine(
      (data) => data.trim() === data,
      "Vị trí không được chứa khoảng trắng đầu và cuối"
    ),
  certificateRequired: z.string().optional(),
  professionalSkills: z
    .string()
    .min(1, "Kỹ năng chuyên môn không được để trống")
    .refine(
      (data) => data.trim() === data,
      "Kỹ năng không được chứa khoảng trắng đầu và cuối"
    ),
  languagesRequired: z
    .array(
      z.object({
        language: z.string().min(1, "Ngôn ngữ không được để trống"),
        level: z.string().min(1, "Trình độ ngôn ngữ không được để trống"),
      })
    )
    .optional(),
  jobBenefit: z
    .string()
    .min(1, "Mô tả lợi ích nhân viên không được để trống")
    .refine(
      (data) => data.trim() === data,
      "Mô tả lợi ích nhân viên không được chứa khoảng trắng đầu và cuối"
    ),
  leavePolicy: z.string().optional(),
  jobDescription: z
    .string()
    .min(1, "Mô tả công việc không được để trống")
    .refine(
      (data) => data.trim() === data,
      "Mô tả công việc không được chứa khoảng trắng đầu và cuối"
    ),
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
    .string()
    .min(1, "Thời gian làm việc không được để trống")
    .refine(
      (data) => data.trim() === data,
      "Thời gian làm việc không được chứa khoảng trắng đầu và cuối"
    ),
});
