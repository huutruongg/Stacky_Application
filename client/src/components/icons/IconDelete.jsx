import React from "react";

const IconDelete = ({ className, color }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10.125 4.875V5.25H13.875V4.875C13.875 4.37772 13.6775 3.90081 13.3258 3.54917C12.9742 3.19754 12.4973 3 12 3C11.5027 3 11.0258 3.19754 10.6742 3.54917C10.3225 3.90081 10.125 4.37772 10.125 4.875ZM8.625 5.25V4.875C8.625 3.97989 8.98058 3.12145 9.61351 2.48851C10.2465 1.85558 11.1049 1.5 12 1.5C12.8951 1.5 13.7535 1.85558 14.3865 2.48851C15.0194 3.12145 15.375 3.97989 15.375 4.875V5.25H21C21.1989 5.25 21.3897 5.32902 21.5303 5.46967C21.671 5.61032 21.75 5.80109 21.75 6C21.75 6.19891 21.671 6.38968 21.5303 6.53033C21.3897 6.67098 21.1989 6.75 21 6.75H19.869L18.45 19.176C18.3454 20.0911 17.9076 20.9358 17.2201 21.5488C16.5326 22.1618 15.6436 22.5004 14.7225 22.5H9.2775C8.3564 22.5004 7.46735 22.1618 6.77989 21.5488C6.09243 20.9358 5.65464 20.0911 5.55 19.176L4.131 6.75H3C2.80109 6.75 2.61032 6.67098 2.46967 6.53033C2.32902 6.38968 2.25 6.19891 2.25 6C2.25 5.80109 2.32902 5.61032 2.46967 5.46967C2.61032 5.32902 2.80109 5.25 3 5.25H8.625ZM7.041 19.005C7.10362 19.5539 7.36602 20.0606 7.77819 20.4286C8.19037 20.7965 8.7235 20.9999 9.276 21H14.7233C15.2757 20.9999 15.8089 20.7965 16.2211 20.4286C16.6332 20.0606 16.8956 19.5539 16.9583 19.005L18.36 6.75H5.64075L7.041 19.005ZM9.75 9.375C9.94891 9.375 10.1397 9.45402 10.2803 9.59467C10.421 9.73532 10.5 9.92609 10.5 10.125V17.625C10.5 17.8239 10.421 18.0147 10.2803 18.1553C10.1397 18.296 9.94891 18.375 9.75 18.375C9.55109 18.375 9.36032 18.296 9.21967 18.1553C9.07902 18.0147 9 17.8239 9 17.625V10.125C9 9.92609 9.07902 9.73532 9.21967 9.59467C9.36032 9.45402 9.55109 9.375 9.75 9.375ZM15 10.125C15 9.92609 14.921 9.73532 14.7803 9.59467C14.6397 9.45402 14.4489 9.375 14.25 9.375C14.0511 9.375 13.8603 9.45402 13.7197 9.59467C13.579 9.73532 13.5 9.92609 13.5 10.125V17.625C13.5 17.8239 13.579 18.0147 13.7197 18.1553C13.8603 18.296 14.0511 18.375 14.25 18.375C14.4489 18.375 14.6397 18.296 14.7803 18.1553C14.921 18.0147 15 17.8239 15 17.625V10.125Z"
        fill={color}
      />
    </svg>
  );
};

export default IconDelete;
