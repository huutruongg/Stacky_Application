import React from "react";
import ItemJobSuggest from "@/components/itemJob/ItemJobSuggest";
import TitleField from "@/components/titleField/TitleField";
import PaginationDemo from "@/components/pagination/Pagination";

const JobsInteresting = () => {
  return (
    <div className="mb-10">
      <TitleField children={"Công việc hấp dẫn"}></TitleField>
      <div className="grid grid-cols-3 items-center gap-5">
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
      </div>
      <div className="mt-5">
        <PaginationDemo
          PerPage={"newsPerPage"}
          dataBase={"sortedProducts"}
          currentPage={"currentPage"}
          onPageChange={"handlePageChange"}
        ></PaginationDemo>
      </div>
    </div>
  );
};

export default JobsInteresting;
