const useImageUpload = (options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    maxFiles = 5,
    endpoint = '/upload/recruiter-images'
  } = options;

  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = useCallback((file) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Định dạng file không hợp lệ');
    }
    if (file.size > maxSize) {
      throw new Error('Kích thước file quá lớn');
    }
  }, [allowedTypes, maxSize]);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('files', file);
    
    const response = await axiosClient.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data.urlImages[0];
  };

  const handleUpload = async (fileList) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newFiles = Array.from(fileList);
      
      if (files.length + newFiles.length > maxFiles) {
        throw new Error(`Chỉ được tải lên tối đa ${maxFiles} file`);
      }

      // Validate all files first
      newFiles.forEach(validateFile);
      
      // Upload files and get URLs
      const uploadedUrls = await Promise.all(
        newFiles.map(uploadFile)
      );

      setFiles(prev => [...prev, ...uploadedUrls]);
      return uploadedUrls;
      
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    files,
    isLoading,
    error,
    handleUpload,
    reset: () => setFiles([])
  };
}; 