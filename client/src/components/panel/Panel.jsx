import React from "react";

const Panel = ({ title, children, className }) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-xl ${className}`}
    >
      <h2 className="text-xl">{title}</h2>
      <span className="text-[#dcdcdc]">{children}</span>
    </div>
  );
};

export default Panel;
