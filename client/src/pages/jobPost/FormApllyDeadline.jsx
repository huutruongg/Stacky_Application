import TitleField from "@/components/titleField/TitleField";
import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import dayjs from "dayjs";

const FormApllyDeadline = ({ form }) => {
  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Hạn nộp hồ sơ"} />
      <div className="flex flex-col gap-5 w-full">
        <FormField
          control={form.control}
          name={`applicationDeadline`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center">
                  <Label
                    htmlFor={`applicationDeadline`}
                    className="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required "
                  >
                    Ngày kết thúc nộp hồ sơ
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
          name={`jobSchedule`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center">
                  <Label
                    htmlFor={`jobSchedule`}
                    className="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
                  >
                    Thời gian làm việc dự kiến
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
    </div>
  );
};

export default FormApllyDeadline;
