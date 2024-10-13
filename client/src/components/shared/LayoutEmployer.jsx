import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import FromBeginPageClick from "../scrollToTop/FromBeginPageClick";
import Heading from "./header/Heading";

const LayoutEmployer = () => {
  return (
    <Fragment>
      <Heading></Heading>
      <Outlet></Outlet>
      <FromBeginPageClick></FromBeginPageClick>
    </Fragment>
  );
};

export default LayoutEmployer;
