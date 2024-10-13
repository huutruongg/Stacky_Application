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
import SelectField from "@/components/fieldForm/SelectField";

const FormBasicInfo = ({ form }) => {
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
                    onChange={field.onChange} // Đăng ký onChange
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid col-start-4 col-end-13 w-full gap-5">
          {/* Job Name Field */}
          <InputField
            control={form.control}
            name="jobTitle"
            placeholder="tên công việc"
            labelName="Tên công việc"
            id="jobTitle"
            {...commonInputProps}
          />

          {/* Job Type Field */}
          <SelectField
            control={form.control}
            name={`typeOfWork`} // Adjust field name structure
            labelName={"Loại hình công việc"}
            placeholder="Chọn loại hình công việc"
            {...commonInputProps}
            options={[
              { value: "fullTime", label: "Full-time" },
              { value: "partTime", label: "Part-time" },
              { value: "contract", label: "Hợp đồng" },
              { value: "internShip", label: "Thực tập sinh" },
              { value: "freelance", label: "Freelance" },
            ]}
          />

          {/* Job Type Field */}
          <SelectField
            control={form.control}
            name={`genderRequired`} // Adjust field name structure
            labelName={"Giới Tính"}
            placeholder="Chọn giới tính"
            {...commonInputProps}
            options={[
              { value: "men", label: "Nam" },
              { value: "women", label: "Nữ" },
              { value: "men/women", label: "Nam / Nữ" },
            ]}
          />

          {/* Work Location Field */}
          <InputField
            control={form.control}
            name="location"
            placeholder="địa chỉ làm việc"
            labelName="Địa điểm làm việc"
            id="location"
            {...commonInputProps}
          />

          {/* Salary Field */}
          <InputField
            control={form.control}
            name="jobSalary"
            placeholder="VD: 10 - 15 triệu, Thỏa thuận"
            labelName="Mức lương"
            id="jobSalary"
            {...commonInputProps}
          />

          {/* Hiring Quantity Field */}
          <InputField
            control={form.control}
            type="number"
            name="candidatesLimit"
            placeholder="số lượng cần tuyển dụng"
            labelName="Số lượng tuyển dụng"
            id="candidatesLimit"
            {...commonInputProps}
          />
        </div>
      </div>
    </div>
  );
};

export default FormBasicInfo;
