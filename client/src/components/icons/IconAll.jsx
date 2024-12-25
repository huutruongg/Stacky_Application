import React from "react";

const IconAll = ({ className, color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      id="Check"
      className={className}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 8L8.70711 15.2929C8.31658 15.6834 7.68342 15.6834 7.29289 15.2929L4 12"
        className="colorStroke000000 svgStroke"
      ></path>
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M22 8L14.7071 15.2929C14.3166 15.6834 13.6834 15.6834 13.2929 15.2929L11 13"
        className="colorStroke000000 svgStroke"
      ></path>
    </svg>
  );
};

export default IconAll;
