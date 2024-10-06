import React from "react";
import Footer from "@/components/shared/footer/Footer";
import Heading from "@/components/shared/header/Heading";
import SearchJob from "@/components/shared/searchJob/SearchJob";
import CompanyInfo from "./CompanyInfo";
import GeneralInfo from "./GeneralInfo";
import JobSuggest from "./JobSuggest";
import JobSummary from "./JobSummary";
import JobDescription from "./JobDescription";
import JobContact from "./JobContact";

const JobDetailPage = () => {
  return (
    <div>
      <div className="flex justify-center items-center bg-primary py-4">
        <SearchJob></SearchJob>
      </div>
      <div className="page-container grid grid-cols-12 gap-7 py-10">
        <div className="grid col-start-1 col-end-9 gap-7 h-fit">
          <JobSummary></JobSummary>
          <JobDescription></JobDescription>
          <JobContact></JobContact>
        </div>
        <div className="grid col-start-9 col-end-13 gap-7 h-fit">
          <CompanyInfo></CompanyInfo>
          <GeneralInfo></GeneralInfo>
          <JobSuggest></JobSuggest>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
