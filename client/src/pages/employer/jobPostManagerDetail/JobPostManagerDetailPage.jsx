import React from "react";
import ReviewJobPost from "./ReviewJobPost";
import CandidateLists from "./CandidateLists";

const JobPostManagerDetailPage = () => {
  return (
    <div className="space-y-5 mt-5 w-full">
      <ReviewJobPost />
      <CandidateLists />
    </div>
  );
};

export default JobPostManagerDetailPage;
