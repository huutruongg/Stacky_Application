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
  const [newsPerPage, setNewsPerPage] = useState(PerPage);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(dataBase.length / newsPerPage); i++) {
    pageNumbers.push(i);
  }

  // console.log(pageNumbers);
  // console.log(Math.ceil(dataBase.length / newsPerPage));

  const choosePage = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const nextPage = () => {
    onPageChange(currentPage + 1);
  };

  const previousPage = () => {
    onPageChange(currentPage - 1);
  };
  // console.log(currentPage);
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
        {pageNumbers.map((number) => (
          <PaginationItem key={number} onClick={() => choosePage(number)}>
            <PaginationLink
              className={currentPage === number ? "bg-primary text-white" : ""}
              href={`#${number}`}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => nextPage()}
            disabled={currentPage === Math.ceil(dataBase.length / newsPerPage)}
            aria-label="Next Page"
            className={
              currentPage === Math.ceil(dataBase.length / newsPerPage)
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
