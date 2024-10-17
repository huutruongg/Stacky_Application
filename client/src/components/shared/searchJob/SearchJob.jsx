import React, { useEffect, useState } from "react";
import IconClose from "@/components/icons/IconClose";
import IconLocation from "@/components/icons/IconLocation";
import IconSearch from "@/components/icons/IconSearch";
import Button from "@/components/button/Button";
import ComboboxLocation from "@/components/combobox/ComboboxLocation";
import ComboboxMajor from "@/components/combobox/ComboboxMajor";
import IconBag from "@/components/icons/IconBag";
import { fetchData } from "@/api/fetchData";

const SearchJob = () => {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");

  let queryParams = [];

  if (searchInput) {
    queryParams.push(`keySearch=${searchInput}`);
  }
  if (selectedMajor) {
    queryParams.push(`industry=${selectedMajor}`);
  }
  if (selectedProvince) {
    queryParams.push(`location=${selectedProvince}`);
  }

  console.log(`job-posting/search-job-postings?${queryParams.join("&")}`);

  const handleSearch = async () => {
    try {
      const result = await fetchData(
        `job-posting/search-job-postings?${queryParams.join("&")}`
      );
      setJobData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error while fetching jobs data:", error);
      setError(error);
      setLoading(false);
    }
  };

  const handleClearInput = () => {
    setSearchInput(""); // Clear the input field
  };

  const handleProvinceSelect = (value) => {
    setSelectedProvince(value); // Update selected province
  };

  const handleMajorSelect = (value) => {
    setSelectedMajor(value); // Update selected province
  };

  return (
    <div className="flex justify-between items-center bg-white rounded-full p-2 border-[1px] border-solid border-secondary">
      <div className="relative flex items-center min-w-[500px]">
        <IconSearch className="absolute m-2 w-5 h-5" />
        <input
          type="text"
          placeholder="Vị trí tuyển dụng"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-10 pr-5 py-1 outline-none rounded-lg"
        />
        {searchInput && (
          <div className="cursor-pointer" onClick={handleClearInput}>
            <IconClose className="hover:bg-secondary rounded-full w-6 h-6" />
          </div>
        )}
      </div>
      <div className="flex items-center border-x px-2 ml-2">
        <IconLocation color="#b3b8bd" className="absolute m-2 z-10 w-5 h-5" />
        <ComboboxLocation
          valueProvinces={selectedProvince}
          onSelectProvince={handleProvinceSelect}
        />
      </div>
      <div className="flex items-center border-r px-2 mr-4">
        <IconBag color="#b3b8bd" className="absolute m-2 z-10 w-5 h-5" />
        <ComboboxMajor
          valueMajor={selectedMajor}
          onSelectMajor={handleMajorSelect}
        />
      </div>
      <div className="flex items-center justify-center bg-button text-white rounded-full px-5">
        <Button className="max-h-10" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default SearchJob;
