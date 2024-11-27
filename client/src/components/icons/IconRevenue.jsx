import React from "react";

const IconRevenue = ({ className, color }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clip-path="url(#clip0_1539_2043)">
        <path
          d="M17 15C17 13.895 13.866 13 10 13M17 15C17 16.105 13.866 17 10 17C6.134 17 3 16.105 3 15M17 15V19.937C17 21.076 13.866 22 10 22C6.134 22 3 21.077 3 19.937V15M17 15C20.824 15 24 14.013 24 13V3M10 13C6.134 13 3 13.895 3 15M10 13C5.582 13 2 12.013 2 11V6M10 4C5.582 4 2 4.895 2 6M2 6C2 7.105 5.582 8 10 8C10 9.013 13.253 10 17.077 10C20.901 10 24 9.013 24 8M24 3C24 1.895 20.9 1 17.077 1C13.254 1 10.154 1.895 10.154 3M24 3C24 4.105 20.9 5 17.077 5C13.254 5 10.154 4.105 10.154 3M10.154 3V13.166"
          stroke={color}
          strokeWidth="2"
        />
      </g>
      <defs>
        <clipPath id="clip0_1539_2043">
          <rect width="24" height="24" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IconRevenue;
