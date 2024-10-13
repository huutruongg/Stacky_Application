import InputField from "@/components/fieldForm/InputField";
import TextareaField from "@/components/fieldForm/TextareaField";
import TitleField from "@/components/titleField/TitleField";
import React from "react";

const FormJobDescription = ({ form }) => {
  const commonInputProps = {
    className: "flex items-center",
    classNameLabel:
      "flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5",
  };

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Công việc chi tiết"} />
      <div className="flex flex-col gap-5 w-full">
        <TextareaField
          control={form.control}
          name={`jobDescription`}
          labelName={"Mô tả công việc"}
          placeholder="Mô tả công việc"
          id={`jobDescription`}
          htmlFor={`jobDescription`}
          className="flex items-center"
          classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
        />
        <InputField
          control={form.control}
          name="workEnvironment"
          placeholder="Môi trường làm việc"
          labelName="Môi trường làm việc"
          id="workEnvironment"
          {...commonInputProps}
        />
      </div>
    </div>
  );
};

export default FormJobDescription;
