import React, { useEffect, useState } from "react";
import ItemJobSuggest from "@/components/itemJob/ItemJobSuggest";
import TitleField from "@/components/titleField/TitleField";
import { fetchData } from "@/api/fetchData";

const JobSuggest = () => {
  const [jobData, setJobData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        // Gọi API với type là 'job-postings' và phân trang
        const result = await fetchData(`job-posting/job-postings`);
        setJobData(result); // Giả sử API trả về dữ liệu trong result.data
        setIsLoading(false);
      } catch (error) {
        console.error("Error while fetching jobs data:", error);
        setError(error); // Cập nhật lỗi
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-secondary rounded-xl">
      <TitleField
        children={"Gợi ý việc làm phù hợp"}
        className={"mt-5 ml-5"}
      ></TitleField>
      <div className="flex flex-col gap-2 p-2">
        {jobData.length > 0 &&
          jobData
            .slice(0, 4)
            .map((item, index) => (
              <ItemJobSuggest jobData={item} key={index} />
            ))}
      </div>
    </div>
  );
};

export default JobSuggest;
