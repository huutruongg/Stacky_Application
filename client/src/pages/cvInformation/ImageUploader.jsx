import { useState, forwardRef, useImperativeHandle } from "react";
import IconPlus from "@/components/icons/IconPlus";
import IconDelete from "@/components/icons/IconDelete";

const ImageUploader = forwardRef(({ value, onChange }, ref) => {
  const [uploadedImage, setUploadedImage] = useState(value || null);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        onChange(reader.result); // Update form state
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setUploadedImage(null);
    onChange(null); // Update form state
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      setUploadedImage(null);
      onChange(null);
    },
  }));

  return (
    <div className="flex flex-col items-center">
      <div className="p-5 bg-gray-100 rounded-lg border border-gray-300">
        <label
          htmlFor="upload"
          className="relative w-40 h-52 border border-gray-300 rounded-md cursor-pointer flex flex-col justify-center items-center bg-gray-100 hover:bg-gray-200"
        >
          {uploadedImage ? (
            <div
              className="relative w-full h-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-full object-cover rounded-md"
              />
              {isHovered && (
                <button
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                >
                  <IconDelete />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="mb-2">Thêm ảnh</span>
              <IconPlus />
            </div>
          )}
        </label>
        <input
          type="file"
          id="upload"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
});

export default ImageUploader;
