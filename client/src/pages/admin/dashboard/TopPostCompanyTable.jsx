import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TopPostCompanyTable = ({ topPostCompany }) => {
  return (
    <Table className="mt-5">
      <TableHeader className="text-base">
        <TableRow>
          <TableHead className="text-center w-[40%]">Tên công ty</TableHead>
          <TableHead className="text-center w-[40%]">Lĩnh vực</TableHead>
          <TableHead className="text-center w-[20%]">Số bài viết</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topPostCompany?.map((item, index) => (
          <TableRow className="font-medium">
            <TableCell className="text-center">
              <div className="flex items-center gap-2">
                <img
                  src={item?.orgImage}
                  alt=""
                  className="min-w-8 min-h-8 max-w-8 max-h-8 rounded-full border border-gray-200"
                />
                <span className="text-justify">{item?.orgName}</span>
              </div>
            </TableCell>
            <TableCell className="text-justify">{item?.orgIndustry}</TableCell>
            <TableCell className="text-center">
              <span className="text-primary px-2 py-1 bg-[#ead6fd] rounded-md">
                {item?.numberOfPost}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TopPostCompanyTable;
