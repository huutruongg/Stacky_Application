import React from "react";

const IconMail = ({ className, color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      id="mail"
      className={className}
    >
      <path
        fill={color}
        d="M16,14.81,28.78,6.6A3,3,0,0,0,27,6H5a3,3,0,0,0-1.78.6Z"
        className="color231f20 svgShape"
      ></path>
      <path
        fill={color}
        d="M16.54,16.84h0l-.17.08-.08,0A1,1,0,0,1,16,17h0a1,1,0,0,1-.25,0l-.08,0-.17-.08h0L2.1,8.26A3,3,0,0,0,2,9V23a3,3,0,0,0,3,3H27a3,3,0,0,0,3-3V9a3,3,0,0,0-.1-.74Z"
        className="color231f20 svgShape"
      ></path>
    </svg>
  );
};

export default IconMail;
