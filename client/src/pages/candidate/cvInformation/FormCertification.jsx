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
import Button from "@/components/button/Button";
import IconPlusMath from "@/components/icons/IconPlusMath";
import InputField from "@/components/fieldForm/InputField";
import TextareaField from "@/components/fieldForm/TextareaField";
import Buttonchild from "@/components/button/Buttonchild";

const CertificationField = ({
  form,
  index,
  onRemove,
  isRemovable,
}) => (
  <div className="space-y-5 mb-5">
    <InputField
      control={form.control}
      name={`certifications.${index}.certificateName`}
      labelName="Tên chứng chỉ"
      placeholder="Mô tả dự án bạn đã tham gia"
      className="flex items-center"
      classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
      id={`certificateName-${index}`}
      htmlFor={`certificateName-${index}`}
    />
    <FormField
      control={form.control}
      name={`certifications.${index}.dateOfReceipt`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex items-center">
              <Label
                htmlFor={`dateOfReceipt-${index}`}
                className="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
              >
                Thời gian đạt
              </Label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date && date.isValid() ? date.toDate() : null)
                  }
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
    <TextareaField
      control={form.control}
      name={`certifications.${index}.certificateDetail`}
      labelName="Thông tin chi tiết"
      placeholder="Thông tin chi tiết chứng chỉ"
      className="flex items-center"
      classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
      id={`certificateDetail-${index}`}
      htmlFor={`certificateDetail-${index}`}
    />
    {isRemovable && (
      <div className="flex justify-end">
        <Buttonchild
          kind="primary"
          className="h-fit px-3 py-1 bg-primary text-white rounded-lg hover:opacity-80"
          onClick={onRemove}
        >
          Xóa chứng chỉ
        </Buttonchild>
      </div>
    )}
  </div>
);

const FormCertification = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  const handleAddCertification = (e) => {
    e.preventDefault();
    append({
      certificateName: "",
      dateOfReceipt: null,
      certificateDetail: "",
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
          {fields.map((field, index) => (
            <CertificationField
              key={field.id}
              form={form}
              index={index}
              isRemovable={fields.length > 0}
              onRemove={(e) => handleRemoveCertification(index, e)}
            />
          ))}
          <div className="flex items-center justify-center">
            <Button
              kind="primary"
              className="flex items-center gap-3 w-fit px-5"
              onClick={handleAddCertification}
            >
              <span>Thêm chứng chỉ</span>
              <IconPlusMath />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCertification;
