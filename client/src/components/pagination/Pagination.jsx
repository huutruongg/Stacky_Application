import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationDemo = ({ dataBase, currentPage, onPageChange, PerPage }) => {
  const [newsPerPage] = useState(PerPage);

  // Tính tổng số trang dựa trên dữ liệu
  const totalPages = Math.ceil(dataBase.length / newsPerPage);

  // Tạo danh sách số trang
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Chọn trang mới
  const choosePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  // Chuyển đến trang tiếp theo
  const nextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Quay lại trang trước
  const previousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={previousPage}
            disabled={currentPage === 1}
            aria-label="Previous Page"
            className={
              currentPage === 1
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {/* Chỉ hiển thị một số trang xung quanh trang hiện tại */}
        {pageNumbers.map((number) => (
          <PaginationItem key={number} onClick={() => choosePage(number)}>
            <PaginationLink
              className={
                currentPage === number
                  ? "bg-primary text-white"
                  : "hover:text-primary"
              }
              href={`#${number}`}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={nextPage}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
            className={
              currentPage === totalPages
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationDemo;
