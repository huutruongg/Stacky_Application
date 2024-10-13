import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import TitleField from "@/components/titleField/TitleField";
import ImageUploader from "@/components/uploadImage/ImageUploader";
import InputField from "@/components/fieldForm/InputField";

const FormCompanyBasicInfo = ({ form }) => {
  const commonInputProps = {
    className: "flex items-center",
    classNameLabel:
      "flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required",
  };

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Thông tin cơ bản"} />
      <div className="grid grid-cols-12 gap-10">
        <div className="grid col-start-1 col-end-3 w-full gap-5">
          <FormField
            control={form.control}
            name="jobImage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <div className="grid col-start-4 col-end-13 w-full h-fit gap-5">
          <InputField
            control={form.control}
            name="jobTitle"
            placeholder="Tên công ty"
            labelName="Tên công ty"
            id="jobTitle"
            {...commonInputProps}
          />
          <InputField
            control={form.control}
            name="jobSize"
            placeholder="Quy mô công ty"
            labelName="Quy mô công ty"
            id="jobSize"
            {...commonInputProps}
          />
        </div> */}
      </div>
    </div>
  );
};

export default FormCompanyBasicInfo;
