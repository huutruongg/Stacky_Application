import React from "react";
import ItemJobSuggest from "@/components/itemJob/ItemJobSuggest";
import TitleField from "@/components/titleField/TitleField";

const JobSuggest = () => {
  return (
    <div className="bg-secondary rounded-xl">
      <TitleField
        children={"Gợi ý việc làm phù hợp"}
        className={"mt-5 ml-5"}
      ></TitleField>
      <div className="flex flex-col gap-2 p-2">
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
        <ItemJobSuggest></ItemJobSuggest>
      </div>
    </div>
  );
};

export default JobSuggest;
