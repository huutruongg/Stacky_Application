import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import TitleField from "@/components/titleField/TitleField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"; // Import dayjs for handling date parsing
import { Label } from "@/components/ui/label";
import InputField from "@/components/fieldForm/InputField";
import ImageUploader from "@/components/uploadImage/ImageUploader";
import SelectField from "@/components/fieldForm/SelectField";

const FormProfile = ({ form }) => {
  const commonInputProps = {
    className: "flex items-center",
    classNameLabel:
      "flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required",
  };

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Thông tin cá nhân"} />
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="grid col-start-1 col-end-9 w-full gap-5">
          {/* Name Field */}
          <InputField
            control={form.control}
            name="fullName"
            placeholder="họ và tên"
            labelName="Họ và Tên"
            id="fullName"
            {...commonInputProps}
          />

          {/* Current Position/Applied Position */}
          <InputField
            control={form.control}
            name="jobPosition"
            placeholder="vị trí"
            labelName="Vị trí hiện tại / Vị trí ứng tuyển"
            id="jobPosition"
            {...commonInputProps}
          />

          {/* Email Field */}
          <InputField
            control={form.control}
            name="publicEmail"
            placeholder="email"
            labelName="Email"
            id="publicEmail"
            {...commonInputProps}
          />

          {/* Phone Field */}
          <InputField
            control={form.control}
            name="phoneNumber"
            placeholder="số điện thoại"
            labelName="Điện thoại"
            id="phoneNumber"
            {...commonInputProps}
          />

          {/* Type Field */}
          <SelectField
            control={form.control}
            name="gender" // Adjust field name structure
            labelName={"Giới Tính"}
            placeholder="Chọn giới tính"
            {...commonInputProps}
            options={[
              { value: "men", label: "Nam" },
              { value: "women", label: "Nữ" },
              { value: "men/women", label: "Nam / Nữ" },
            ]}
          />
        </div>

        <div className="grid col-start-9 col-end-13 w-full">
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    value={field.value}
                    onChange={field.onChange} // Register the field's onChange
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-full grid col-start-1 col-end-10 gap-5 mt-5">
          {/* Date of Birth Field */}
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Label
                      htmlFor="birthDate"
                      className="ant-form-item-required flex items-center justify-between min-w-44 max-w-44 pr-3"
                    >
                      Ngày sinh
                    </Label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={field.value ? dayjs(field.value) : null} // dayjs object or null
                        onChange={(date) => {
                          // Check if date is valid before updating
                          if (date && date.isValid()) {
                            field.onChange(date.toDate()); // Convert to native Date object
                          } else {
                            field.onChange(null); // Set to null if invalid
                          }
                        }}
                        maxDate={dayjs()} // Giới hạn ngày tối đa là hôm nay
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-root": {
                            height: "48px",
                            borderRadius: "12px",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid #424242",
                          },
                          "& .MuiInputBase-input": {
                            paddingLeft: "24px",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Address Field */}
          <InputField
            control={form.control}
            name="address"
            placeholder="địa chỉ"
            classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
            className={"flex items-center"}
            labelName="Địa chỉ"
            id="address"
          />

          {/* Github Field */}
          <InputField
            control={form.control}
            name="githubUrl"
            placeholder="Github profile URL"
            className={"flex items-center"}
            classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
            labelName="Github"
            id="githubUrl"
          />

          {/* LinkedIn Field */}
          <InputField
            control={form.control}
            name="linkedinUrl"
            placeholder="LinkedIn profile URL"
            className={"flex items-center"}
            classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5"
            labelName="LinkedIn"
            id="linkedinUrl"
          />
        </div>
      </div>
    </div>
  );
};

export default FormProfile;
