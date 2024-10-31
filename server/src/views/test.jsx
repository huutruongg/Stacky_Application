import React, { useState, useRef } from 'react';

const ImageUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const dropzoneRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const handleFileInputChange = (event) => {
    handleFiles(event.target.files);
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (newFiles.length === 0 && files.length > 0) {
      alert('Only image files are allowed');
    }

    const promises = newFiles.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          file.preview = e.target.result;
          resolve(file);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then(results => {
        setSelectedFiles(prevFiles => [...prevFiles, ...results]);
      })
      .catch(error => {
        console.error('Error reading files:', error);
      });

  };

  const removeFile = (file) => {
    setSelectedFiles(prevFiles => prevFiles.filter(f => f !== file));
    URL.revokeObjectURL(file.preview);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/upload/recruiter-images', { // Replace with your actual upload endpoint
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        alert('Images uploaded successfully!');
        setSelectedFiles([]);
      } else {
        alert('Failed to upload images: ' + result.error);
      }

      console.log(result.urlImages); // Log uploaded image URLs
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('An error occurred while uploading images.');
    } finally {
      setIsUploading(false);
    }
  };



  return (
    <div>
      <h1>Upload Recruiter Images</h1>

      <div
        ref={dropzoneRef}
        className="dropzone"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.accept = 'image/*';
          input.onchange = handleFileInputChange;
          input.click();
        }}
      >
        <p>Drop files to upload, or click here to browse.</p>
      </div>

      <div className="image-container">
        {selectedFiles.map(file => (
          <div key={file.name} className="image-box">
            <img src={file.preview} alt={file.name} />
            <button className="remove-button" onClick={() => removeFile(file)}>
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        className="upload-button"
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || isUploading}
      >
        {isUploading ? 'Uploading...' : 'Submit'}
      </button>
    </div>
  );
};

export default ImageUploader;

// npm install react-dropzone
