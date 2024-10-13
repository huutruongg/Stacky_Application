import InputField from "@/components/fieldForm/InputField";
import TextareaField from "@/components/fieldForm/TextareaField";
import TitleField from "@/components/titleField/TitleField";
import React from "react";

const FormBenefit = ({ form }) => {
  const commonInputProps = {
    className: "flex items-center",
    classNameLabel:
      "flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5",
  };

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Phúc lợi"} />
      <div className="flex flex-col gap-5 w-full">
        <TextareaField
          control={form.control}
          name={`jobBenefit`}
          labelName={"Phúc lợi dành cho nhân viên"}
          placeholder="Phúc lợi dành cho nhân viên"
          id={`jobBenefit`}
          htmlFor={`jobBenefit`}
          className="flex items-center"
          classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
        />
        <InputField
          control={form.control}
          name="leavePolicy"
          placeholder="Chế độ nghĩ phép"
          labelName="Chế độ nghĩ phép"
          id="leavePolicy"
          {...commonInputProps}
        />
      </div>
    </div>
  );
};

export default FormBenefit;
