import React from "react";
import { useFieldArray } from "react-hook-form";
import TitleField from "@/components/titleField/TitleField";
import Button from "@/components/button/Button"; // Assuming you have a Button component
import IconPlusMath from "@/components/icons/IconPlusMath";
import InputField from "@/components/fieldForm/InputField";
import TextareaField from "@/components/fieldForm/TextareaField";

const FormProject = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects", // This matches the array of projects in the form
  });

  const handleAddProject = (e) => {
    e.preventDefault();
    append({
      projectName: "",
      projectTime: "",
      urlRepo: "",
      projectDescription: "",
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
            <div key={field.id} className="space-y-5 mb-5">
              {/* Project Name Field */}
              <InputField
                control={form.control}
                name={`projects.${index}.projectName`}
                labelName={"Tên dự án"}
                placeholder="dự án bạn đã tham gia"
                className={"flex items-center"}
                classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5"
                id={`projects.${index}.projectName`}
                htmlFor={`projects.${index}.projectName`}
              />

              {/* Project Duration Field */}
              <InputField
                control={form.control}
                name={`projects.${index}.projectTime`}
                labelName={"Thời gian dự án"}
                placeholder="Bao nhiêu tháng, từ thời gian nào"
                className={"flex items-center"}
                classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5"
                id={`projects.${index}.projectTime`}
                htmlFor={`projects.${index}.projectTime`}
              />

              {/* Github Link Field */}
              <InputField
                control={form.control}
                name={`projects.${index}.urlRepo`}
                labelName={"Link Github"}
                placeholder="url repository của dự án"
                className={"flex items-center"}
                classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5"
                id={`projects.${index}.urlRepo`}
                htmlFor={`projects.${index}.urlRepo`}
              />

              {/* Project Introduction Field */}
              <TextareaField
                control={form.control}
                name={`projects.${index}.projectDescription`}
                labelName={"Giới thiệu dự án"}
                placeholder="Giải quyết vấn đề, bài toán gì"
                className={"flex items-center"}
                classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5"
                id={`projects.${index}.projectDescription`}
                htmlFor={`projects.${index}.projectDescription`}
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
