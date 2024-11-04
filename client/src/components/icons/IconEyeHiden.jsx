import React from "react";

const IconEyeHiden = ({ className, color }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Eye">
      <g
        fill="none"
        fill-rule="evenodd"
        stroke="#000000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        class="colorStroke000000 svgStroke"
        className={className}
      >
        <path
          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"
          fill={color}
          class="color000000 svgShape"
        ></path>
      </g>
    </svg>
  );
};

export default IconEyeHiden;
