import React from "react";
import TitleField from "@/components/titleField/TitleField";
import ItemJobInterested from "./ItemJobInterested";
import IconLinkNext from "../icons/IconLinkNext";

const YouCanInterested = () => {
  return (
    <div className="rounded-xl bg-secondary border border-primary p-3">
      <TitleField
        children={"Bạn có thể quan tâm"}
        className={"mt-3 ml-3"}
      ></TitleField>
      <div className="flex flex-col gap-3">
        <ItemJobInterested></ItemJobInterested>
        <ItemJobInterested></ItemJobInterested>
        <ItemJobInterested></ItemJobInterested>
        <ItemJobInterested></ItemJobInterested>
        <ItemJobInterested></ItemJobInterested>
      </div>
      <a
        href=""
        className="flex items-center justify-center text-sm text-primary font-semibold gap-3 mt-3 hover:decoration-primary hover:underline"
      >
        <span className="">Xem thêm</span>
        <IconLinkNext className={"w-3 h-3"}></IconLinkNext>
      </a>
    </div>
  );
};

export default YouCanInterested;
