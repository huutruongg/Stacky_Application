import React, { useState, useEffect } from "react";
import IconBeginningPage from "@/components/icons/IconBeginningPage";
import { Link } from "react-router-dom";

const FromBeginPageClick = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Function to handle scroll event
    const handleScroll = () => {
      // Check if user scrolled past certain threshold (e.g., 300px)
      if (window.scrollY > 300) {
        // Show back-to-top button
        setShowButton(true);
      } else {
        // Hide back-to-top button
        setShowButton(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures the effect runs only once

  const handleClick = () => {
    // Scroll to the top of the page with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Enable smooth scrolling
    });
  };

  return (
    <Link
      to="#" // Use "to" instead of "href" for react-router-dom
      className={`back-top ${showButton ? "visible" : "hidden"}`}
      onClick={handleClick}
    >
      <div className="beginning-page">
        <IconBeginningPage
          className={
            "text-center w-full h-full bg-primary text-white hover:bg-[#00f0ff]"
          }
        />
      </div>
    </Link>
  );
};

export default FromBeginPageClick;
