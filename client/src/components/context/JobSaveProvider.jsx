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
    fetchSavedJobs();
  }, [user]);

  const value = useMemo(
    () => ({ jobSaveData, isLoading }),
    [jobSaveData, isLoading]
  );

  return (
    <JobSaveContext.Provider value={value}>{children}</JobSaveContext.Provider>
  );
};
