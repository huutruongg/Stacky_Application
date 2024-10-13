import React from "react";
import TitleField from "@/components/titleField/TitleField";
import TextareaField from "@/components/fieldForm/TextareaField";

const FormIntroduceYourself = ({ form }) => {
  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Giới thiệu bản thân"} />
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="w-full grid col-start-1 col-end-10 gap-5 mt-5">
          <TextareaField
            control={form.control}
            name={`personalDescription`}
            labelName={"Giới thiệu bản thân"}
            placeholder="giới thiệu bản thân ở đây"
            className={"flex items-center"}
            classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
            id={`personalDescription`}
            htmlFor={`personalDescription`}
          />
        </div>
      </div>
    </div>
  );
};

export default FormIntroduceYourself;
