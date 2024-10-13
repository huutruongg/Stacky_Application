import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ onUpload }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("files", imageFile);

    try {
      const response = await axios.post("/upload/recruiter-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedImageUrl = response.data.urlImages[0];
      setImageUrl(uploadedImageUrl); // Store the image URL
      onUpload(uploadedImageUrl); // Pass the image URL to the parent component
      console.log("Image uploaded:", uploadedImageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Uploaded" width="100" />
          <p>Image URL: {imageUrl}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
