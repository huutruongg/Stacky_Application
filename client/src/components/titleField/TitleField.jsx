import React from "react";

const TitleField = ({ children, className }) => {
  return (
    <div
      className={`text-xl text-primary px-3 py-1 border-l-[6px] border-primary font-semibold mb-5 ${className}`}
    >
      <h2>{children}</h2>
    </div>
  );
};

export default TitleField;
