import React from "react";
import TitleField from "@/components/titleField/TitleField";
import TextareaField from "@/components/fieldForm/TextareaField";
import SelectField from "@/components/fieldForm/SelectField";
import InputField from "@/components/fieldForm/InputField";

const FormIntroduceCompany = ({ form }) => {
  const commonInputProps = {
    className: "flex items-center",
    classNameLabel:
      "flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required",
  };

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children="Giới thiệu" />
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="w-full grid col-start-1 col-end-13 gap-5 mt-5">
          <TextareaField
            control={form.control}
            name="orgIntroduction"
            labelName="Giới thiệu"
            placeholder="Nhập giới thiệu ở đây"
            {...commonInputProps}
            id="introduction"
            htmlFor="introduction"
          />
          <SelectField
            control={form.control}
            name="orgField"
            labelName="Ngành nghề"
            placeholder="Chọn ngành nghề"
            {...commonInputProps}
            options={[
              { value: "fullTime", label: "Full-time" },
              { value: "partTime", label: "Part-time" },
              { value: "contract", label: "Hợp đồng" },
              { value: "internship", label: "Thực tập sinh" },
              { value: "freelance", label: "Freelance" },
            ]}
          />
          <InputField
            control={form.control}
            name="orgFacebookLink"
            placeholder="Nhập link Facebook"
            labelName="Link Facebook"
            {...commonInputProps}
          />
          <InputField
            control={form.control}
            name="orgLinkedinLink"
            placeholder="Nhập link LinkedIn"
            labelName="Link LinkedIn"
            {...commonInputProps}
          />
          <InputField
            control={form.control}
            name="orgYoutubeLink"
            placeholder="Nhập link YouTube"
            labelName="Link YouTube"
            {...commonInputProps}
          />
        </div>
      </div>
    </div>
  );
};

export default FormIntroduceCompany;
