import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Define the validation schema for a job posting form
export const companyInfoSchema = z.object({
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
  // testeditor: z.string().min(1, "Tên công việc là bắt buộc"),
});
