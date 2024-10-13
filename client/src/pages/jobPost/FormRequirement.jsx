import InputField from "@/components/fieldForm/InputField";
import SelectField from "@/components/fieldForm/SelectField";
import TitleField from "@/components/titleField/TitleField";
import React from "react";

const FormRequirement = ({ form }) => {
  const commonInputProps = {
    className: "flex items-center",
    classNameLabel:
      "flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required",
  };

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Yêu cầu chung"} />
      <div className="flex flex-col gap-5 w-full">
        {/* Job Type Field */}
        <div className="flex flex-col gap-5 w-[500px]">
          <SelectField
            control={form.control}
            name={`educationRequired`} // Changed field name
            labelName={"Trình độ học vấn"}
            placeholder="Chọn trình độ học vấn"
            {...commonInputProps}
            options={[
              { value: "university", label: "Đại học" },
              { value: "college", label: "Cao đẳng" },
              { value: "highSchool", label: "Trung cấp" },
              { value: "certificate", label: "Chứng chỉ" },
              { value: "notRequired", label: "Không yêu cầu" },
            ]}
          />
          <SelectField
            control={form.control}
            name={`yearsOfExperience`} // Changed field name
            labelName={"Kinh nghiệm làm việc"}
            placeholder="Chọn kinh nghiệm làm việc"
            {...commonInputProps}
            options={[
              { value: "notRequired", label: "Không yêu cầu" }, // Changed value for "Không yêu cầu"
              { value: "1-2Years", label: "1 - 2 năm" },
              { value: "2-5Years", label: "2 - 5 năm" },
              { value: "moreThan5Years", label: "Trên 5 năm" },
            ]}
          />
          <SelectField
            control={form.control}
            name={`typeOfIndustry`} // Changed field name
            labelName={"Ngành nghề yêu cầu"}
            placeholder="Chọn ngành nghề yêu cầu"
            {...commonInputProps}
            options={[
              { value: "IT", label: "Công nghệ thông tin" },
              { value: "marketing", label: "Tiếp thị" },
              { value: "finance", label: "Tài chính" },
              { value: "engineering", label: "Kỹ thuật" },
              { value: "other", label: "Khác" },
            ]}
          />
        </div>
        <InputField
          control={form.control}
          name="staffLevel"
          placeholder="Vị trí tuyển dụng"
          labelName="Vị trí tuyển dụng"
          id="staffLevel"
          {...commonInputProps}
        />
        <InputField
          control={form.control}
          name="certificateRequired"
          placeholder="Chứng chỉ cần thiết"
          labelName="Chứng chỉ cần thiết"
          id="certificateRequired"
          {...commonInputProps}
        />
        <InputField
          control={form.control}
          name="professionalSkills"
          placeholder="Kỹ năng chuyên môn"
          labelName="Kỹ năng chuyên môn"
          id="professionalSkills"
          {...commonInputProps}
        />
      </div>
    </div>
  );
};

export default FormRequirement;
