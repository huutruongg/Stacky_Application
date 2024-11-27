import React from "react";

const IconFacebook = ({ className, color }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_129_21)">
        <path
          d="M11.25 23.25H3C1.755 23.25 0.75 22.245 0.75 21V3C0.75 1.755 1.755 0.75 3 0.75H21C22.245 0.75 23.25 1.755 23.25 3V21C23.25 22.245 22.245 23.25 21 23.25H15.75V15H18L19.5 11.25H15.75V8.25C15.75 7.425 16.425 7.5 17.25 7.5H18.75V3.75H15.75C14.505 3.75 13.38 4.26 12.57 5.07C11.76 5.88 11.25 7.005 11.25 8.25V11.25H8.25V15H11.25V23.25Z"
          stroke={color}
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_129_21">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IconFacebook;
