import { useState, forwardRef, useImperativeHandle } from "react";
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

const ImageSlideUploader = forwardRef(({ value = [], onChange, id }, ref) => {
  const [uploadedImages, setUploadedImages] = useState(value || []);
  const [isHovered, setIsHovered] = useState(Array(value.length).fill(false));
  const [tempImage, setTempImage] = useState(null);
  console.log(uploadedImages);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    let newImages = [];

    // Validation
    files.forEach((file) => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error(
          "Định dạng tệp không hợp lệ. Chỉ cho phép các tệp JPEG, PNG và GIF."
        );
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Kích thước tệp vượt quá giới hạn 5MB.");
        return;
      }
      if (uploadedImages.length + newImages.length >= MAX_IMAGES) {
        toast.error(`Bạn chỉ có thể tải lên tối đa ${MAX_IMAGES} ảnh.`);
        return;
      }

      // If file passes all validations
      newImages.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          const formData = new FormData();

          reader.onload = async () => {
            const imageData = {
              file,
              preview: reader.result,
            };
            setTempImage(imageData.preview);

            formData.append("files", file);
            try {
              const uploadResponse = await axiosInstance.post(
                "/upload/recruiter-images",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );
              const urlImage = uploadResponse.data.urlImages[0];
              resolve({ ...imageData, url: urlImage });
            } catch (error) {
              console.error("Failed to upload image:", error);
              resolve(null);
            }
          };

          reader.readAsDataURL(file);
        })
      );
    });

    Promise.all(newImages).then((imageDataArray) => {
      const successfulUploads = imageDataArray.filter((img) => img !== null);
      const updatedImages = [...uploadedImages, ...successfulUploads];

      setUploadedImages(updatedImages);
      onChange(updatedImages.map((img) => img.url)); // Pass only URLs to parent
    });
  };

  const handleDeleteImage = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    onChange(updatedImages.map((img) => img.url));
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
                      src={tempImage || image.preview}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full object-cover rounded-md"
                    />
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
