import React from "react";
import TitleField from "@/components/titleField/TitleField";
import InputField from "@/components/fieldForm/InputField";

const FormProgrammingSkills = ({ form }) => {
  return (
    <div className="bg-secondary p-5 rounded-xl">
      {/* Section Title */}
      <TitleField children={"Kỹ năng lập trình"} />
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="grid col-start-1 col-end-10 w-full gap-5">
          <InputField
            control={form.control}
            name={`programmingSkills`}
            labelName={"Các kỹ năng lập trình"}
            placeholder="Vui lòng nhập tên kỹ năng. VD: Java, Python,…"
            className={"flex items-center"}
            classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
            id={`programmingSkills`}
            htmlFor={`programmingSkills`}
          />
        </div>
      </div>
    </div>
  );
};

export default FormProgrammingSkills;
