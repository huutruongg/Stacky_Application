import TextareaField from "@/components/fieldForm/TextareaField";
import React from "react";

const ModalSendEmail = ({ form }) => {
  return (
    <div className="px-5">
      <TextareaField
        control={form.control}
        name={`contentEmail`}
        placeholder="Phúc lợi dành cho nhân viên"
        id={`contentEmail`}
        htmlFor={`contentEmail`}
      />
    </div>
  );
};

export default ModalSendEmail;
