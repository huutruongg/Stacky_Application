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
          <TableRow className="font-medium" key={index}>
            <TableCell className="text-center">
              <div className="flex items-center gap-2">
                <img
                  src={item?.orgImage}
                  alt=""
                  className="overflow-hidden object-cover min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] border rounded-md"
                />
                <span className="text-justify">{item?.orgName}</span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <span className="text-justify">{item?.typeOfIndustry}</span>
            </TableCell>
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
