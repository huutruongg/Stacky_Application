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
import IconDelete from "@/components/icons/IconDelete";
import PaginationDemo from "@/components/pagination/Pagination";

const PostManagerPage = () => {
  return (
    <div className="p-5 my-5 mr-5 bg-white rounded-md">
      <h3 className="text-2xl font-semibold">Quản lý Bài viết</h3>
      <div className="flex flex-col items-center gap-5">
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[5%]">SST</TableHead>
              <TableHead className="text-center w-[20%]">Tiêu đề</TableHead>
              <TableHead className="text-center w-[20%]">
                Công ty đăng tuyển
              </TableHead>
              <TableHead className="text-center w-[20%]">
                Ngành nghề tuyển dụng
              </TableHead>
              <TableHead className="text-center w-[5%]">SL</TableHead>
              <TableHead className="text-center w-[10%]">Ngày đăng</TableHead>
              <TableHead className="text-center w-[10%]">Hạn nộp đơn</TableHead>
              <TableHead className="text-center w-[15%]">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="font-medium">
              <TableCell className="text-center">1</TableCell>
              <TableCell className="text-center line-clamp-1 leading-10">
                Phát triển Phần mềm
              </TableCell>
              <TableCell className="text-center">
                Công ty TNHH Phần mềm FPT
              </TableCell>
              <TableCell className="text-center">Developer</TableCell>
              <TableCell className="text-center">100</TableCell>
              <TableCell className="text-center">01/01/2024</TableCell>
              <TableCell className="text-center">01/01/2024</TableCell>
              <TableCell className="text-center text-accepted">
                Đang mở
              </TableCell>
              <TableCell className="text-center">
                <div className="p-1 bg-[#ead6fd] rounded-md hover:opacity-70 cursor-pointer">
                  <IconDelete className="w-6 h-6" color={"#48038C"} />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <PaginationDemo
          PerPage={"newsPerPage"}
          dataBase={"companyData"}
          currentPage={"currentPage"}
          onPageChange={"handlePageChange"}
        />
      </div>
    </div>
  );
};

export default PostManagerPage;
