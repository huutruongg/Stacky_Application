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

const FormLanguageAbility = ({ form }) => {
  // Initialize field array for dynamic form fields
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "languages", // Name should match the form's field name
  });

  const handleAddLanguage = (e) => {
    e.preventDefault(); // Prevent form submission on button click
    append({ language: "", proficiency: "" });
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
              <FormField
                control={form.control}
                name={`languages.${index}.language`} // Adjust field name structure
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex">
                        <Label
                          htmlFor={`language-${index}`}
                          className="flex items-center w-32 leading-5"
                        >
                          Ngoại ngữ
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="relative min-w-[180px] max-w-[200px] border border-border rounded-xl shadow-none hover:bg-secondary">
                            <SelectValue placeholder="Chọn ngôn ngữ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="english">Tiếng Anh</SelectItem>
                              <SelectItem value="french">Tiếng Pháp</SelectItem>
                              <SelectItem value="japanese">
                                Tiếng Nhật
                              </SelectItem>
                              <SelectItem value="korean">Tiếng Hàn</SelectItem>
                              <SelectItem value="vietnamese">
                                Tiếng Việt
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Proficiency Level Select Field */}
              <FormField
                control={form.control}
                name={`languages.${index}.proficiency`} // Adjust field name structure
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex">
                        <Label
                          htmlFor={`proficiency-${index}`}
                          className="flex items-center w-32 leading-5"
                        >
                          Mức độ thông thạo
                        </Label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="relative min-w-[180px] max-w-[200px] border border-border rounded-xl shadow-none hover:bg-secondary">
                            <SelectValue placeholder="Chọn mức độ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="beginner">Sơ cấp</SelectItem>
                              <SelectItem value="intermediate">
                                Trung cấp
                              </SelectItem>
                              <SelectItem value="advanced">Cao cấp</SelectItem>
                              <SelectItem value="native">Bản ngữ</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.length > 1 ? (
                <div className="flex justify-end">
                  <button
                    className={`h-fit px-3 py-1 bg-primary text-white rounded-lg hover:opacity-80`}
                    onClick={(e) => handleRemoveLanguage(index, e)} // Handle remove
                  >
                    Xóa
                  </button>
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
