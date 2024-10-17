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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) {
        console.warn("User is not available");
        return;
      }
      try {
        const response = await axiosInstance.get(
          `/job-posting/job-saved/${user.userId}`
        );
        setJobSaveData(response.data.result || []); // Assuming result holds the job data
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [user]);

  const value = useMemo(
    () => ({ jobSaveData, loading }),
    [jobSaveData, loading]
  );

  return (
    <JobSaveContext.Provider value={value}>{children}</JobSaveContext.Provider>
  );
};
