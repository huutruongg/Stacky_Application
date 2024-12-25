import React from "react";

const IconPending = ({ className, color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      id="Pending"
      className={className}
    >
      <g fill={color} className="color000000 svgShape">
        <path
          d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
          fill={color}
          className="color000000 svgShape"
        ></path>
        <path
          d="M12,6a1,1,0,0,0-1,1v4.59L8.29,14.29a1,1,0,1,0,1.41,1.41l3-3A1,1,0,0,0,13,12V7A1,1,0,0,0,12,6Z"
          fill={color}
          className="color000000 svgShape"
        ></path>
      </g>
    </svg>
  );
};

export default IconPending;
