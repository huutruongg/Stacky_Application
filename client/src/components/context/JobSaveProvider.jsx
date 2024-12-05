import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/lib/authorizedAxios";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

const JobSaveContext = createContext();

export const useJobSave = () => {
  return useContext(JobSaveContext);
};

export const JobSaveProvider = ({ children }) => {
  const { user } = useAuth();
  const [jobSaveData, setJobSaveData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // State để trigger re-fetch

  const refreshSavedJobs = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) {
        console.warn("User is not available");
        return;
      }
      try {
        const response = await axiosInstance.get(`job-post/get-job-saved`);
        setJobSaveData(response.data.result || []); // Assuming result holds the job data
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true); // Đặt lại loading mỗi khi gọi API
    fetchSavedJobs();
  }, [user, refreshKey]); // Thêm `refreshKey` vào dependencies

  const removeJob = (jobId) => {
    setJobSaveData((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
  };

  const value = useMemo(
    () => ({ jobSaveData, isLoading, refreshSavedJobs, removeJob }),
    [jobSaveData, isLoading]
  );

  return (
    <JobSaveContext.Provider value={value}>{children}</JobSaveContext.Provider>
  );
};
