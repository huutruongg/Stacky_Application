import React from "react";
import { useFieldArray } from "react-hook-form";
import TitleField from "@/components/titleField/TitleField";
import Button from "@/components/button/Button";
import IconPlusMath from "@/components/icons/IconPlusMath";
import InputField from "@/components/fieldForm/InputField";
import TextareaField from "@/components/fieldForm/TextareaField";
import Buttonchild from "@/components/button/Buttonchild";

const ProjectField = ({ form, index, onRemove, isRemovable }) => (
  <div className="space-y-5 mb-5">
    {/* Project Name Field */}
    <InputField
      control={form.control}
      name={`projects.${index}.projectName`}
      labelName="Tên dự án"
      placeholder="Dự án bạn đã tham gia"
      className="flex items-center"
      classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
      id={`projects.${index}.projectName`}
      htmlFor={`projects.${index}.projectName`}
    />

    {/* Project Duration Field */}
    <InputField
      control={form.control}
      name={`projects.${index}.projectTime`}
      labelName="Thời gian dự án"
      placeholder="Bao nhiêu tháng, từ thời gian nào"
      className="flex items-center"
      classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
      id={`projects.${index}.projectTime`}
      htmlFor={`projects.${index}.projectTime`}
    />

    {/* Github Link Field */}
    <InputField
      control={form.control}
      name={`projects.${index}.urlRepo`}
      labelName="Link Github"
      placeholder="URL repository của dự án"
      className="flex items-center"
      classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
      id={`projects.${index}.urlRepo`}
      htmlFor={`projects.${index}.urlRepo`}
    />

    {/* Project Introduction Field */}
    <TextareaField
      control={form.control}
      name={`projects.${index}.projectDescription`}
      labelName="Mô tả dự án"
      placeholder="Giải quyết vấn đề, bài toán gì"
      className="flex items-center"
      classNameLabel="flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required"
      id={`projects.${index}.projectDescription`}
      htmlFor={`projects.${index}.projectDescription`}
    />

    {/* Remove Button */}
    {isRemovable && (
      <div className="flex justify-end">
        <Buttonchild
          kind="primary"
          className="h-fit px-3 py-1"
          onClick={onRemove}
        >
          Xóa dự án
        </Buttonchild>
      </div>
    )}
  </div>
);

const FormProject = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects",
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

  return (
    <div className="bg-secondary p-5 rounded-xl">
      <TitleField>Dự án</TitleField>
      <div className="grid grid-cols-12 py-10 px-20">
        <div className="w-full grid col-start-1 col-end-10 gap-5 mt-5">
          {fields.map((field, index) => (
            <ProjectField
              key={field.id}
              form={form}
              index={index}
              isRemovable={fields.length > 0}
              onRemove={(e) => {
                e.preventDefault();
                remove(index);
              }}
            />
          ))}

          {/* Add New Project Button */}
          <div className="flex items-center justify-center">
            <Button
              kind="primary"
              className="flex items-center gap-3 w-fit px-5"
              onClick={handleAddProject}
            >
              <span>Thêm dự án</span>
              <IconPlusMath />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProject;
