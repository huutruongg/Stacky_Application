import TextareaField from "@/components/fieldForm/TextareaField";
import React from "react";

const ModalSendEmail = ({ form }) => {
  return (
    <div className="px-5">
      <TextareaField
        control={form.control}
        name={`text`}
        placeholder="Nội dung email"
        id={`text`}
        htmlFor={`text`}
      />
    </div>
  );
};

export default ModalSendEmail;
