import React from "react";

const IconCompanyFrofile = ({ className, color }) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 26 24"
      height="24"
      width="26"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M23 3.25V20.75H3V3.25H23ZM23 0.75H3C1.6125 0.75 0.5 1.8625 0.5 3.25V20.75C0.5 22.1375 1.6125 23.25 3 23.25H23C24.3875 23.25 25.5 22.1375 25.5 20.75V3.25C25.5 1.8625 24.3875 0.75 23 0.75ZM20.5 15.75H5.5V18.25H20.5V15.75ZM10.5 5.75H5.5V13.25H10.5V5.75ZM13 8.25H20.5V5.75H13V8.25ZM20.5 10.75H13V13.25H20.5V10.75Z"
        fill={color}
      ></path>
    </svg>
  );
};

export default IconCompanyFrofile;
