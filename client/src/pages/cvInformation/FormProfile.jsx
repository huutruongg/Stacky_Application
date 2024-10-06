import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import ImageUploader from "./ImageUploader";
import dayjs from "dayjs"; // Import dayjs for handling date parsing

const FormProfile = ({ form }) => {
  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Thông tin cá nhân"} />
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="grid col-start-1 col-end-9 w-full gap-5">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Label
                      htmlFor="name"
                      className="flex items-center justify-between ant-form-item-required min-w-44 max-w-44 pr-3 leading-5"
                    >
                      Họ và Tên
                    </Label>
                    <Input placeholder="Vui lòng nhập họ và tên" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Current Position/Applied Position */}
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Label
                      htmlFor="position"
                      className="ant-form-item-required flex items-center justify-between ant-form-item-required min-w-44 max-w-44 pr-3 leading-5"
                    >
                      Vị trí hiện tại / Vị trí ứng tuyển
                    </Label>
                    <Input placeholder="Vui lòng nhập vị trí" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Label
                      htmlFor="email"
                      className="ant-form-item-required flex items-center justify-between ant-form-item-required min-w-44 max-w-44 pr-3 leading-5"
                    >
                      Email
                    </Label>
                    <Input placeholder="Vui lòng nhập email" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Label
                      htmlFor="phone"
                      className="ant-form-item-required flex items-center justify-between ant-form-item-required min-w-44 max-w-44 pr-3 leading-5"
                    >
                      Điện thoại
                    </Label>
                    <Input
                      placeholder="Vui lòng nhập số điện thoại"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender Field */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Label
                      htmlFor="gender"
                      className="ant-form-item-required flex items-center justify-between ant-form-item-required min-w-44 max-w-44 pr-3 leading-5"
                    >
                      Giới tính
                    </Label>
                    <Input placeholder="Vui lòng nhập giới tính" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid col-start-9 col-end-13 w-full">
          <FormField
            control={form.control}
            name="avatar"
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
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Label
                      htmlFor="dob"
                      className="ant-form-item-required flex items-center justify-between ant-form-item-required min-w-44 max-w-44 pr-3"
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
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Label
                      htmlFor="address"
                      className="flex items-center justify-between min-w-44 max-w-44 pr-3"
                    >
                      Địa chỉ
                    </Label>
                    <Input placeholder="Vui lòng nhập địa chỉ" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* LinkedIn Field */}
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Label
                      htmlFor="linkedin"
                      className="flex items-center justify-between min-w-44 max-w-44 pr-3"
                    >
                      LinkedIn
                    </Label>
                    <Input placeholder="LinkedIn profile URL" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Github Field */}
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Label
                      htmlFor="github"
                      className="flex items-center justify-between min-w-44 max-w-44 pr-3"
                    >
                      Github
                    </Label>
                    <Input placeholder="Github profile URL" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FormProfile;
