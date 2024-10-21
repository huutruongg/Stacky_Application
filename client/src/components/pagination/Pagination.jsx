import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationDemo = ({ dataBase, currentPage, onPageChange, PerPage }) => {
  // Tính tổng số trang
  const totalPages = Math.ceil(dataBase.length / PerPage);

  // Giới hạn số trang hiển thị quanh trang hiện tại
  const maxPageNumbersToShow = 3;
  const startPage = Math.max(
    1,
    currentPage - Math.floor(maxPageNumbersToShow / 2)
  );
  const endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  // Chuyển trang
  const choosePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const previousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Nút "Trang trước" */}
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

        {/* Hiển thị các trang */}
        {startPage > 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => choosePage(1)}>1</PaginationLink>
            {startPage > 2 && <span className="px-2">...</span>}
          </PaginationItem>
        )}

        {pageNumbers.map((number) => (
          <PaginationItem key={number}>
            <PaginationLink
              onClick={() => choosePage(number)}
              className={
                currentPage === number
                  ? "rounded-full text-primary border-[2px] border-primary"
                  : "rounded-full hover:text-primary"
              }
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}

        {endPage < totalPages && (
          <PaginationItem>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <PaginationLink onClick={() => choosePage(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Nút "Trang sau" */}
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
