import React from "react";
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
import { Input } from "@/components/ui/input";
import Button from "@/components/button/Button";
import IconPlusMath from "@/components/icons/IconPlusMath";

const FormEducation = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  const handleAddEducation = (e) => {
    e.preventDefault();
    append({
      educationName: "",
      educationFirstDate: null,
      educationEndDate: null,
      educationMajor: "",
    });
  };

  const handleRemoveEducation = (index, e) => {
    e.preventDefault();
    remove(index);
  };
  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Học vấn"} />
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="grid col-start-1 col-end-10 w-full gap-5">
          {fields.map((education, index) => (
            <div key={education.id} className="space-y-4 mb-5">
              <FormField
                control={form.control}
                name={`educations.${index}.educationName`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <Label
                          htmlFor={`educationName-${index}`}
                          className="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
                        >
                          Tên trường cơ sở đào tạo chính quy
                        </Label>
                        <Input
                          placeholder="Vui lòng nhập tên trường"
                          {...field}
                          id={`educationName-${index}`}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-10">
                <FormField
                  control={form.control}
                  name={`educations.${index}.educationFirstDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center">
                          <Label
                            htmlFor={`educationFirstDate-${index}`}
                            className="flex items-center justify-between min-w-44 max-w-44 pr-3 ant-form-item-required"
                          >
                            Thời gian làm việc
                          </Label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(date) => {
                                if (date && date.isValid()) {
                                  field.onChange(date.toDate());
                                } else {
                                  field.onChange(null);
                                }
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
                  name={`educations.${index}.educationEndDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center">
                          <Label
                            htmlFor={`educationEndDate-${index}`}
                            className="flex items-center justify-between max-w-44 mr-10"
                          >
                            đến
                          </Label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(date) => {
                                if (date && date.isValid()) {
                                  field.onChange(date.toDate());
                                } else {
                                  field.onChange(null);
                                }
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
              <FormField
                control={form.control}
                name={`educations.${index}.educationMajor`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <Label
                          htmlFor={`educationMajor-${index}`}
                          className="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
                        >
                          Ngành học
                        </Label>
                        <Input
                          placeholder="Vui lòng nhập ngành học"
                          {...field}
                          id={`educationMajor-${index}`}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.length > 1 && (
                <div className="flex justify-end">
                  <button
                    className="h-fit px-3 py-1 bg-primary text-white rounded-lg hover:opacity-80"
                    onClick={(e) => handleRemoveEducation(index, e)}
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="flex items-center justify-center">
            <Button
              kind="primary"
              className="flex items-center gap-3 w-fit px-5"
              onClick={handleAddEducation}
            >
              <span>Thêm học vấn khác</span>
              <IconPlusMath />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEducation;
