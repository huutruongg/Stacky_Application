import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import IconPlus from "@/components/icons/IconPlus";
import IconDelete from "@/components/icons/IconDelete";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import axiosInstance from "@/lib/authorizedAxios";
import toast from "react-hot-toast";

const MAX_IMAGES = 5; // Max number of images allowed
const MAX_FILE_SIZE = 5 * 1024 * 1024; // Max file size in bytes (2MB)
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"]; // Allowed file types

const ImageSlideUploader = forwardRef(({ value, onChange, id }, ref) => {
  const initialImages = Array.isArray(value) ? value.map(url => ({
    url,
    preview: url,
    isUploading: false
  })) : [];

  const [uploadedImages, setUploadedImages] = useState(initialImages);
  const [isHovered, setIsHovered] = useState(
    Array(initialImages.length).fill(false)
  );

  useEffect(() => {
    if (Array.isArray(value)) {
      const formattedImages = value.map(url => ({
        url,
        preview: url,
        isUploading: false
      }));
      setUploadedImages(formattedImages);
      setIsHovered(Array(value.length).fill(false));
    }
  }, [value]);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    // Validation
    for (const file of files) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error(
          "Định dạng tệp không hợp lệ. Chỉ cho phép các tệp JPEG, PNG và GIF."
        );
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Kích thước tệp vượt quá giới hạn 5MB.");
        continue;
      }
      if (uploadedImages.length >= MAX_IMAGES) {
        toast.error(`Bạn chỉ có thể tải lên tối đa ${MAX_IMAGES} ảnh.`);
        break;
      }

      try {
        // Hiển thị preview trước
        const reader = new FileReader();
        reader.onload = async (e) => {
          const preview = e.target.result;

          // Thêm ảnh preview vào state
          setUploadedImages((prev) => [
            ...prev,
            {
              preview,
              isUploading: true,
            },
          ]);

          // Upload file
          const formData = new FormData();
          formData.append("files", file);

          try {
            const uploadResponse = await axiosInstance.post(
              "/upload/recruiter-images",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            const urlImage = uploadResponse.data.urlImages[0];

            // Cập nhật state với URL thật từ server
            setUploadedImages((prev) =>
              prev.map((img, idx) => {
                if (idx === prev.length - 1) {
                  return {
                    ...img,
                    url: urlImage,
                    isUploading: false,
                  };
                }
                return img;
              })
            );

            // Cập nhật URLs cho parent component
            const newUrls = [...uploadedImages.map(img => img.url), urlImage];
            onChange(newUrls);
            toast.success("Tải ảnh lên thành công!");
          } catch (error) {
            console.error("Failed to upload image:", error);
            toast.error("Không thể tải ảnh lên. Vui lòng thử lại.");

            // Xóa ảnh preview nếu upload thất bại
            setUploadedImages((prev) => prev.slice(0, -1));
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error reading file:", error);
        toast.error("Có lỗi xảy ra khi đọc file. Vui lòng thử lại.");
      }
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    onChange(updatedImages.map(img => img.url));
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      setUploadedImages([]);
      onChange([]);
    },
  }));

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex p-2 w-full h-52 bg-gray-100 rounded-lg border border-primary">
        <div
          className={`flex ${
            uploadedImages.length === 0 ? "w-full" : "w-2/5 pr-5"
          }`}
        >
          <label
            htmlFor={id}
            className="w-full h-auto border border-primary rounded-md cursor-pointer flex flex-col justify-center items-center bg-gray-100 hover:bg-gray-200"
          >
            <div className="flex flex-col justify-center items-center w-full h-full opacity-60">
              <span className="mb-2 font-medium text-primary">Thêm ảnh</span>
              <IconPlus className={"w-6 h-6"} color={"#48038C"} />
            </div>
          </label>
          <input
            type="file"
            id={id}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>

        <div
          className={`flex ${
            uploadedImages.length === 0 ? "hidden" : "w-[415px] h-full"
          }`}
        >
          {uploadedImages.length !== 0 && (
            <Swiper
              slidesPerView={"auto"}
              pagination={{
                clickable: true,
              }}
              spaceBetween={10}
              grabCursor={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              scrollbar={{ hide: false }}
              modules={[Scrollbar, Pagination]}
              className={`${
                uploadedImages.length === 0 ? "" : "w-full h-full rounded-md"
              }`}
            >
              {uploadedImages.map((image, index) => (
                <SwiperSlide key={index} className="w-[350px] rounded-md">
                  <div
                    className="relative w-full h-full rounded-md"
                    onMouseEnter={() => {
                      const newHovered = [...isHovered];
                      newHovered[index] = true;
                      setIsHovered(newHovered);
                    }}
                    onMouseLeave={() => {
                      const newHovered = [...isHovered];
                      newHovered[index] = false;
                      setIsHovered(newHovered);
                    }}
                  >
                    <img
                      src={image.url || image.preview}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full object-cover rounded-md"
                    />
                    {image.isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                        <div className="loading-spinner text-white">
                          Đang tải...
                        </div>
                      </div>
                    )}
                    {isHovered[index] && (
                      <button
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                      >
                        <IconDelete color={"#929090"} />
                      </button>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
});

export default ImageSlideUploader;
