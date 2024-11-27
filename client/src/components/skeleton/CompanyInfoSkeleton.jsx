import React from "react";
import { Skeleton } from "../ui/skeleton";

const CompanyInfoSkeleton = () => {
  return (
    <div className="overflow-hidden">
      <Skeleton className="w-[100%] h-28 rounded-t-lg  border-b bg-gray-300" />
      <div className="relative">
        <div className="absolute top-[-35px] left-[20px] flex items-center justify-center w-[70px] h-[70px] overflow-hidden">
          <Skeleton className="h-[100%] w-[100%] object-contain rounded-lg bg-gray-300" />
        </div>
      </div>
      <div className="mt-10 flex flex-col p-3 gap-3 text-sm">
        <Skeleton className="h-[16px] w-[100%] bg-gray-300" />
        <Skeleton className="h-[16px] w-[100%] bg-gray-300" />
        <Skeleton className="h-[16px] w-[100%] bg-gray-300" />
        <Skeleton className="h-[16px] w-[100%] bg-gray-300" />
        <Skeleton className="h-[16px] w-[100%] bg-gray-300" />
        <Skeleton className="h-[16px] w-[100%] bg-gray-300" />
      </div>
    </div>
  );
};

export default CompanyInfoSkeleton;
