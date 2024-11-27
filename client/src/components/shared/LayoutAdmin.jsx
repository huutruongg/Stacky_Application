import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "./navbar/NavbarAdmin";
import HeadingAdmin from "./header/HeadingAdmin";

const LayoutAdmin = () => {
  return (
    <Fragment>
      <HeadingAdmin />
      <div className="grid grid-cols-12 gap-5 bg-secondary">
        <div className="col-span-2">
          <NavbarAdmin />
        </div>
        <div className="col-span-10">
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

export default LayoutAdmin;
