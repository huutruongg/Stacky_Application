import React from "react";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TitleField from "@/components/titleField/TitleField";
import Button from "@/components/button/Button";
import IconPlusMath from "@/components/icons/IconPlusMath";
import { useFieldArray } from "react-hook-form"; // Import this to manage dynamic fields
import Buttonchild from "@/components/button/Buttonchild";

const SelectField = ({
  control,
  name,
  placeholder,
  options,
  labelName,
  classNameLabel,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex">
              <Label
                htmlFor={name}
                className={`flex items-center w-36 leading-5 ${classNameLabel}`}
              >
                {labelName}
              </Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="relative min-w-[180px] max-w-[200px] border border-border rounded-xl shadow-none hover:bg-secondary">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FormLanguageAbility = ({ form }) => {
  // Initialize field array for dynamic form fields
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "languages", // Name should match the form's field name
  });

  const handleAddLanguage = (e) => {
    e.preventDefault(); // Prevent form submission on button click
    append({ language: "", level: "" });
  };

  const handleRemoveLanguage = (index, e) => {
    e.preventDefault(); // Prevent form submission on button click
    remove(index); // Remove language at the specified index
  };

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Khả năng ngoại ngữ"} />
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="w-full grid col-start-1 col-end-10 gap-5 mt-5">
          {fields.map((language, index) => (
            <div
              className="flex justify-between items-center gap-5"
              key={language.id}
            >
              {/* Language Select Field */}
              <SelectField
                control={form.control}
                name={`languages.${index}.language`} // Adjust field name structure
                labelName={"Ngoại ngữ"}
                classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
                placeholder="Chọn ngoại ngữ"
                options={[
                  { value: "english", label: "Tiếng Anh" },
                  { value: "french", label: "Tiếng Pháp" },
                  { value: "japanese", label: "Tiếng Nhật" },
                  { value: "korean", label: "Tiếng Hàn" },
                  { value: "vietnamese", label: "Tiếng Việt" },
                ]}
              />
              {/* Proficiency Level Select Field */}
              <SelectField
                control={form.control}
                name={`languages.${index}.level`} // Adjust field name structure
                labelName={"Mức độ thông thạo"}
                classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
                placeholder="Chọn mức độ"
                options={[
                  { value: "beginner", label: "Sơ cấp" },
                  { value: "intermediate", label: "Trung cấp" },
                  { value: "advanced", label: "Cao cấp" },
                  { value: "native", label: "Bản ngữ" },
                ]}
              />
              {fields.length > 0 ? (
                <div className="flex justify-end">
                  <Buttonchild
                    kind="primary"
                    className={`h-fit px-3 py-1`}
                    onClick={(e) => handleRemoveLanguage(index, e)} // Handle remove
                  >
                    Xóa
                  </Buttonchild>
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
          <div className="flex items-center justify-center">
            <Button
              kind="primary"
              className="flex items-center gap-3 w-fit px-5"
              onClick={handleAddLanguage} // Handle add
            >
              <span>Thêm ngôn ngữ khác</span>
              <IconPlusMath />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLanguageAbility;
