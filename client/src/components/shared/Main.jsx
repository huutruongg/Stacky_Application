import React from "react";
import Heading from "./header/Heading";
import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer";
import FromBeginPageClick from "../scrollToTop/FromBeginPageClick";

const Main = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Heading />
      <main className="flex-grow">
        <Outlet />
        <FromBeginPageClick />
      </main>
      <Footer />
    </div>
  );
};

export default Main;
