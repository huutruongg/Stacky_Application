import React from "react";
import { Skeleton } from "../ui/skeleton";

const CandidateListSkeleton = () => {
  return (
    <div className="relative flex flex-col gap-5 text-sm bg-white rounded-lg border hover:border-primary">
      <div className="flex justify-between gap-3 pl-9 pr-3 py-3">
        <div className="min-w-[80px] max-w-[80px] flex items-center justify-center rounded-lg border">
          <Skeleton className="h-[100%] w-[100%] object-contain rounded-lg bg-gray-300" />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-[20px] w-[100%] bg-gray-300" />
          <Skeleton className="h-[20px] w-[100%] bg-gray-300" />
          <div className="w-full flex items-center gap-2">
            <Skeleton className="h-[20px] w-[100%] bg-gray-300" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-[20px] w-[100px] bg-gray-300" />
              <Skeleton className="h-[20px] w-[100px] bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateListSkeleton;
