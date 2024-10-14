import React from "react";
import { Skeleton } from "../ui/skeleton";

const JobSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 p-4">
      <Skeleton className="h-12 w-12 bg-gray-300" />
      <div className="space-y-2">
        <Skeleton className="bg-gray-300 h-[16px] w-[250px]" />
        <Skeleton className="bg-gray-300 h-[16px] w-[250px]" />
      </div>
    </div>
  );
};

export default JobSkeleton;
