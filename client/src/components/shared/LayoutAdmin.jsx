import React, { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "./navbar/NavbarAdmin";
import HeadingAdmin from "./header/HeadingAdmin";

const LayoutAdmin = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Fragment>
      <HeadingAdmin isOpen={isOpen} handleToggleNavbar={handleToggleNavbar} />
      <div className="flex gap-5 bg-secondary">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isOpen ? "w-[20%]" : "w-[6%]"
          }`}
        >
          <NavbarAdmin isOpen={isOpen} />
        </div>
        <div
          className={`transition-all duration-300 ${
            isOpen ? "w-[80%]" : "w-[94%]"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

export default LayoutAdmin;
