import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import TitleField from "@/components/titleField/TitleField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Button from "@/components/button/Button";
import IconPlusMath from "@/components/icons/IconPlusMath";
import InputField from "@/components/fieldForm/InputField";
import TextareaField from "@/components/fieldForm/TextareaField";

const FormWorkExperience = ({ form, checkNoExperience }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  const [noExperience, setNoExperience] = useState(true);

  // console.log(noExperience);

  const handleCheckExp = () => {
    setNoExperience(false);
    checkNoExperience(noExperience); // Truyền dữ liệu lên component cha
  };

  const handleCheckInExp = () => {
    setNoExperience(true);
    checkNoExperience(noExperience); // Truyền dữ liệu lên component cha
  };

  const handleAddWorkExperiences = (e) => {
    e.preventDefault();
    append({
      companyName: "",
      startDate: null,
      endDate: null,
      jobPosition: "",
      previousJobDetails: "",
    });
  };

  const handleRemoveWorkExperiences = (index, e) => {
    e.preventDefault();
    remove(index);
  };

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <div className="flex gap-10">
        <TitleField children={"Kinh nghiệm việc làm"} />
        <div className="flex gap-5 items-center justify-center">
          <Button
            className={`flex items-center gap-3 w-fit px-5 ${
              noExperience
                ? "bg-primary text-white"
                : "bg-white text-text1 border border-text3"
            }`}
            onClick={handleCheckInExp}
          >
            Chưa có kinh nghiệm
          </Button>
          <Button
            className={`flex items-center gap-3 w-fit px-5 ${
              !noExperience
                ? "bg-primary text-white"
                : "bg-white text-text1 border border-text3"
            }`}
            onClick={handleCheckExp}
          >
            Đã có kinh nghiệm
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="grid col-start-1 col-end-10 w-full gap-5">
          {noExperience ? (
            <div className="mt-5 text-gray-700">
              Với các bạn chưa có kinh nghiệm có thể bổ sung các dự án tại
              trường hoặc dự án cá nhân tại mục Dự án.
            </div>
          ) : (
            fields.map((workExperience, index) => (
              <div key={workExperience.id} className="space-y-5 mb-5">
                <InputField
                  control={form.control}
                  name={`experiences.${index}.companyName`}
                  labelName={"Tên công ty"}
                  placeholder="Tên công ty"
                  className={"flex items-center"}
                  classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
                  id={`experiences.${index}.companyName`}
                  htmlFor={`experiences.${index}.companyName`}
                />

                <div className="flex items-center gap-10">
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center">
                            <Label
                              htmlFor={`startDate-${index}`}
                              className="flex items-center justify-between min-w-44 max-w-44 pr-3 ant-form-item-required"
                            >
                              Thời gian làm việc
                            </Label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                value={field.value ? dayjs(field.value) : null}
                                onChange={(date) => {
                                  field.onChange(date ? date.toDate() : null);
                                }}
                                maxDate={dayjs()}
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
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center">
                            <Label
                              htmlFor={`endDate-${index}`}
                              className="flex items-center justify-between max-w-44 mr-10"
                            >
                              đến
                            </Label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                value={field.value ? dayjs(field.value) : null}
                                onChange={(date) => {
                                  field.onChange(date ? date.toDate() : null);
                                }}
                                maxDate={dayjs()}
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
                </div>
                <InputField
                  control={form.control}
                  name={`experiences.${index}.jobPosition`}
                  labelName={"Vị trí công việc"}
                  placeholder="Vị trí công việc"
                  className={"flex items-center"}
                  classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
                  id={`experiences.${index}.jobPosition`}
                  htmlFor={`experiences.${index}.jobPosition`}
                />
                <TextareaField
                  control={form.control}
                  name={`experiences.${index}.previousJobDetails`}
                  labelName={"Chi tiết công việc và vai trò vị trí"}
                  placeholder="chi tiết các công việc đã làm tại đây. Dự án/ trách nhiệm đã đảm nhận."
                  className={"flex items-center"}
                  classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
                  id={`experiences.${index}.previousJobDetails`}
                  htmlFor={`experiences.${index}.previousJobDetails`}
                />
                {fields.length > 1 && (
                  <div className="flex justify-end">
                    <button
                      className="h-fit px-3 py-1 bg-primary text-white rounded-lg hover:opacity-80"
                      onClick={(e) => handleRemoveWorkExperiences(index, e)}
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
          <div className="flex items-center justify-center">
            <Button
              kind="primary"
              className={`flex items-center gap-3 w-fit px-5 ${
                noExperience ? "hidden" : ""
              }`}
              onClick={handleAddWorkExperiences}
            >
              <span>Thêm kinh nghiệm làm việc</span>
              <IconPlusMath />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormWorkExperience;
