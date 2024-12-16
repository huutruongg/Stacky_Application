import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import TitleField from "@/components/titleField/TitleField";
import ImageUploader from "@/components/uploadImage/ImageUploader";
import InputField from "@/components/fieldForm/InputField";
import SelectField from "@/components/fieldForm/SelectField";

const FormCompanyBasicInfo = ({ form }) => {
  const [orgImage, setOrgImage] = useState(null); // Changed to null

  useEffect(() => {
    const orgImage = form.getValues("orgImage");

    if (orgImage) {
      setOrgImage(orgImage); // Set the image preview if available
    }
  }, [form]);

  const commonInputProps = {
    className: "flex items-center",
    classNameLabel:
      "flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required",
  };

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Thông tin cơ bản"} />
      <div className="grid grid-cols-12 gap-5 px-10 items-center">
        <div className="grid col-start-1 col-end-6 w-full gap-5">
          <FormField
            control={form.control}
            name="orgImage"
            className="w-full"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    id="orgImage" // Unique ID for cover image
                    value={orgImage}
                    onChange={(images) => {
                      setOrgImage(images);
                      field.onChange(images);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid col-start-6 col-end-13 w-full h-fit gap-5">
          <InputField
            control={form.control}
            name="orgName"
            placeholder="Tên công ty"
            labelName="Tên công ty"
            id="orgName"
            {...commonInputProps}
          />

          <SelectField
            control={form.control}
            name="orgScale" // Adjust field name structure
            labelName={"Quy mô công ty"}
            placeholder="Chọn quy mô công ty"
            {...commonInputProps}
            options={[
              { value: "10-24", label: "10-24" },
              { value: "25-99", label: "25-99" },
              { value: "100-499", label: "100-499" },
              { value: "Hơn 1000", label: "Hơn 1000" },
              { value: "1000-4999", label: "1000-4999" },
              { value: "5000-9999", label: "5000-9999" },
              { value: "10000-19999", label: "10000-19999" },
              { value: "Hơn 20000", label: "Hơn 20000" },
            ]}
          />
          <InputField
            control={form.control}
            name="orgEmail"
            placeholder="Email"
            labelName="Email công ty"
            id="orgEmail"
            {...commonInputProps}
          />
        </div>
      </div>
    </div>
  );
};

export default FormCompanyBasicInfo;
