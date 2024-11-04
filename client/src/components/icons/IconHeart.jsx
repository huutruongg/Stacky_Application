import React, { useState } from "react";

const IconHeart = ({
  defaultLiked = true,
  liked,
  className,
  onClick = () => {},
}) => {
  const [newLiked, setNewLiked] = useState(liked);

  const handleClick = () => {
    setNewLiked(!newLiked); // Toggle the liked state
    if (onClick) {
      onClick(!newLiked); // Call the passed onClick handler with the new liked state
    }
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={defaultLiked ? (newLiked || liked ? "#48038C" : "none") : "none"}
      stroke="#48038C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-heart ${className}`}
      onClick={handleClick}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
};

export default IconHeart;
