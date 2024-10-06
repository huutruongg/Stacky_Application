import React from "react";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import TitleField from "@/components/titleField/TitleField";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useFieldArray } from "react-hook-form";
import Button from "@/components/button/Button"; // Assuming you have a Button component
import IconPlusMath from "@/components/icons/IconPlusMath";

const FormProject = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects", // This matches the array of projects in the form
  });

  const handleAddProject = (e) => {
    e.preventDefault();
    append({
      projectName: "",
      projectDuration: "",
      githubLink: "",
      projectIntroduction: "",
    });
  };

  const handleRemoveProject = (index, e) => {
    e.preventDefault();
    remove(index);
  };

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField children={"Dự án"} />
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="w-full grid col-start-1 col-end-10 gap-5 mt-5">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 mb-5">
              {/* Project Name Field */}
              <FormField
                control={form.control}
                name={`projects.${index}.projectName`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <Label
                          htmlFor={`projects.${index}.projectName`}
                          className="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5"
                        >
                          Tên dự án
                        </Label>
                        <Input
                          placeholder="Vui lòng mô tả dự án bạn đã tham gia"
                          {...field}
                          id={`projects.${index}.projectName`}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project Duration Field */}
              <FormField
                control={form.control}
                name={`projects.${index}.projectDuration`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <Label
                          htmlFor={`projects.${index}.projectDuration`}
                          className="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5"
                        >
                          Thời gian dự án
                        </Label>
                        <Input
                          placeholder="Bao nhiêu tháng, từ thời gian nào"
                          {...field}
                          id={`projects.${index}.projectDuration`}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Github Link Field */}
              <FormField
                control={form.control}
                name={`projects.${index}.githubLink`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <Label
                          htmlFor={`projects.${index}.githubLink`}
                          className="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5"
                        >
                          Link Github
                        </Label>
                        <Input
                          placeholder="Nhập url repository của dự án"
                          {...field}
                          id={`projects.${index}.githubLink`}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project Introduction Field */}
              <FormField
                control={form.control}
                name={`projects.${index}.projectIntroduction`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center">
                        <Label
                          htmlFor={`projects.${index}.projectIntroduction`}
                          className="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5"
                        >
                          Giới thiệu dự án
                        </Label>
                        <Textarea
                          placeholder="Giải quyết vấn đề, bài toán gì"
                          {...field}
                          id={`projects.${index}.projectIntroduction`}
                        />
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
                    onClick={(e) => handleRemoveProject(index, e)} // Handle remove
                  >
                    Xóa dự án
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          ))}

          {/* Button to Add More Projects */}
          <div className="flex items-center justify-center">
            <Button
              kind="primary"
              className="flex items-center gap-3 w-fit px-5"
              onClick={handleAddProject} // Handle add
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

export default FormProject;
