import React, { useState } from "react";
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
import IconEye from "@/components/icons/IconEye";
import { AlertModal } from "@/components/shared/AlertModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/button/Button";
import ViewAccount from "./ViewAccount";

const AccountManagerPage = () => {
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onCloseReview = () => setOpenReview(false);
  const handleOpenReview = () => setOpenReview(true);

  return (
    <div className="p-5 my-5 mr-5 bg-white rounded-md">
      <h3 className="text-2xl font-semibold">Quản lý Bài viết</h3>
      <div className="flex flex-col items-center gap-5">
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[5%]">SST</TableHead>
              <TableHead className="text-center w-[25%]">Tên</TableHead>
              <TableHead className="text-center w-[35%]">
                Email/Github
              </TableHead>
              <TableHead className="text-center w-[15%]">
                Ngày đăng ký
              </TableHead>
              <TableHead className="text-center w-[20%]">Chức năng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="font-medium">
              <TableCell className="text-center">1</TableCell>
              <TableCell className="text-center line-clamp-1 leading-10">
                <div className="flex items-center gap-2">
                  <img
                    src="https://dyl347hiwv3ct.cloudfront.net/app/uploads/2023/09/img-favicon.png"
                    alt=""
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <span>Nguyễn Văn Trần Anh</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                nguyenvana@email.com
              </TableCell>
              <TableCell className="text-center">01/01/2024</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center items-center gap-5">
                  <div className="p-1 bg-[#ead6fd] rounded-md hover:opacity-70 cursor-pointer">
                    <IconDelete className="w-6 h-6" color={"#48038C"} />
                  </div>
                  <div className="p-1 bg-[#ead6fd] rounded-md hover:opacity-70 cursor-pointer">
                    <IconEye
                      className="w-6 h-6"
                      color={"#48038C"}
                      onClick={handleOpenReview}
                    />
                  </div>
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
        {/* Modal for Sending Email */}
        <div className="flex items-center justify-end w-full">
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            isLoading={isLoading}
          />
          <Modal
            isOpen={openReview}
            onClose={onCloseReview}
            className="bg-white max-w-[600px]"
            title="Thông Tin Cá Nhân"
          >
            <ViewAccount />
            <div className="flex justify-center gap-5 py-5">
              <Button
                kind="secondary"
                className="text-center px-10 disabled:opacity-50"
                type="button"
                onClick={() => setOpenReview(false)}
              >
                Khóa/Mở Khóa Công Ty
              </Button>
              <Button
                kind="primary"
                className="text-center px-10 disabled:opacity-50"
                type="submit"
                isLoading={isLoading}
              >
                Xoá tài khoản
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AccountManagerPage;
