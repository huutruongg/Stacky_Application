import InputField from "@/components/fieldForm/InputField";
import TitleField from "@/components/titleField/TitleField";
import React from "react";

const FormLocation = ({ form }) => {
  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Địa chỉ"} />
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="w-full grid col-start-1 col-end-13 gap-5 mt-5">
          {/* Hiring Quantity Field */}
          <InputField
            control={form.control}
            name="orgAddress"
            placeholder="Thêm địa chỉ công ty của bạn"
            labelName="Thêm địa chỉ"
            className={"flex items-center"}
            classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
          />
        </div>
      </div>
    </div>
  );
};

export default FormLocation;
