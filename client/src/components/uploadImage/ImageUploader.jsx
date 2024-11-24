import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import IconPlus from "@/components/icons/IconPlus";
import IconDelete from "@/components/icons/IconDelete";
import axiosInstance from "@/lib/authorizedAxios";
import toast from "react-hot-toast";

// Constants for validation
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUploader = forwardRef(({ value, onChange, id }, ref) => {
  const [uploadedImage, setUploadedImage] = useState(value || null);
  const [isHovered, setIsHovered] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setUploadedImage(value);
  }, [value]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
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

    // Hiển thị ảnh ngay lập tức
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Bắt đầu upload
    setIsUploading(true);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const uploadResponse = await axiosInstance.post(
        "/upload/recruiter-images",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const urlImage = uploadResponse.data.urlImages[0];
      setUploadedImage(urlImage);
      onChange(urlImage);
      toast.success("Tải ảnh lên thành công!");
    } catch (error) {
      toast.error("Không thể tải ảnh lên. Vui lòng thử lại.");
      setTempImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = () => {
    setUploadedImage(null);
    setTempImage(null);
    onChange(null);
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      setUploadedImage(null);
      setTempImage(null);
      onChange(null);
    },
  }));

  return (
    <div className="flex flex-col items-center w-full">
      <div className="p-2 bg-gray-100 rounded-lg border border-primary w-full">
        <label
          htmlFor={id}
          className="relative h-48 border border-primary rounded-md cursor-pointer flex flex-col justify-center items-center bg-gray-100 hover:bg-gray-200 w-full"
        >
          {uploadedImage || tempImage ? (
            <div
              className="relative w-full h-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={tempImage || uploadedImage}
                alt="Uploaded"
                className="w-full h-full min-w-48 object-contain rounded-md"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                  <div className="loading-spinner text-white">Đang tải...</div>
                </div>
              )}
              {isHovered && !isUploading && (
                <button
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                >
                  <IconDelete color={"#929090"} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col w-40 items-center opacity-60">
              <span className="mb-2 font-medium text-primary">Thêm ảnh</span>
              <IconPlus className={"w-6 h-6"} color={"#48038C"} />
            </div>
          )}
        </label>
        <input
          type="file"
          id={id}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
});

export default ImageUploader;
