import React from "react";
import IconClose from "@/components/icons/IconClose";
import IconLocation from "@/components/icons/IconLocation";
import IconSearch from "@/components/icons/IconSearch";
import Button from "@/components/button/Button";
import { ComboboxDemo } from "@/components/ui/combobox";

const SearchJob = () => {
  return (
    <div className="flex justify-between items-center bg-white rounded-full py-2 px-3 border-[1px] border-solid border-secondary ">
      <div className="relative flex items-center min-w-[500px]">
        <IconSearch className={"absolute m-2 w-5 h-5"}></IconSearch>
        <input
          type="text"
          placeholder="Vị trí tuyển dụng"
          className="w-full px-10 py-3 outline-none"
        />
        <div className="cursor-pointer">
          <IconClose
            className={"hover:bg-secondary rounded-full w-6 h-6"}
          ></IconClose>
        </div>
      </div>
      <div className="flex items-center border-x px-2 mx-5">
        <IconLocation
          color={"#b3b8bd"}
          className={"absolute m-2 z-10 w-5 h-5"}
        ></IconLocation>
        <ComboboxDemo></ComboboxDemo>
      </div>
      <div className="flex items-center justify-center bg-button text-white rounded-full px-5">
        <Button className="">Tìm kiếm</Button>
      </div>
    </div>
  );
};

export default SearchJob;
