import React, { Fragment } from "react";
import Heading from "./header/Heading";
import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer";
import FromBeginPageClick from "../scrollToTop/FromBeginPageClick";

const Main = () => {
  return (
    <Fragment>
      <Heading></Heading>
      <Outlet></Outlet>
      <FromBeginPageClick></FromBeginPageClick>
      <Footer></Footer>
    </Fragment>
  );
};

export default Main;
