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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Button from "@/components/button/Button";
import IconPlusMath from "@/components/icons/IconPlusMath";

const FormCertification = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  const handleAddCertification = (e) => {
    e.preventDefault();
    append({
      certificationName: "",
      certificationDate: null,
      certificationDetails: "",
    });
  };

  const handleRemoveCertification = (index, e) => {
    e.preventDefault();
    remove(index);
  };

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField>Chứng chỉ</TitleField>
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="w-full grid col-start-1 col-end-10 gap-5 mt-5">
          {fields.map((certification, index) => (
            <div key={certification.id} className="space-y-4 mb-5">
              <FormField
                control={form.control}
                name={`certifications.${index}.certificationName`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <Label
                          htmlFor={`certificationName-${index}`}
                          className="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5"
                        >
                          Tên chứng chỉ
                        </Label>
                        <Input
                          placeholder="Vui lòng mô tả dự án bạn đã tham gia"
                          {...field}
                          id={`certificationName-${index}`}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`certifications.${index}.certificationDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <Label
                          htmlFor={`certificationDate-${index}`}
                          className="flex items-center justify-between min-w-44 max-w-44 pr-3"
                        >
                          Thời gian đạt
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
                name={`certifications.${index}.certificationDetails`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <Label
                          htmlFor={`certificationDetails-${index}`}
                          className="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5"
                        >
                          Thông tin chi tiết
                        </Label>
                        <Textarea
                          placeholder="Thông tin chi tiết chứng chỉ"
                          {...field}
                          id={`certificationDetails-${index}`}
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
                    onClick={(e) => handleRemoveCertification(index, e)}
                  >
                    Xóa chứng chỉ
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center justify-center">
            <Button
              kind="primary"
              className="flex items-center gap-3 w-fit px-5"
              onClick={handleAddCertification}
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

export default FormCertification;
