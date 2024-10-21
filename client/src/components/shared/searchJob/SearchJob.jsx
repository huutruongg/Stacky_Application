import React, { useEffect, useState } from "react";
import IconClose from "@/components/icons/IconClose";
import IconLocation from "@/components/icons/IconLocation";
import IconSearch from "@/components/icons/IconSearch";
import Button from "@/components/button/Button";
import ComboboxLocation from "@/components/combobox/ComboboxLocation";
import ComboboxMajor from "@/components/combobox/ComboboxMajor";
import IconBag from "@/components/icons/IconBag";
import { useLocation, useNavigate } from "react-router-dom";

const SearchJob = () => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const navigate = useNavigate(); // Use the useNavigate hook for navigation
  const location = useLocation(); // Use the useLocation hook to get the curent URL and extract query parameters

  console.log(searchInput);
  console.log(selectedProvince);
  console.log(selectedMajor);

  // Extract values from query parameters when component is rendered
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keySearch = params.get("keySearch") || "";
    const industry = params.get("industry") || "";
    const locationParam = params.get("location") || "";

    setSearchInput(keySearch);
    setSelectedMajor(industry);
    setSelectedProvince(locationParam);
  }, [location.search]);

  const handleSearch = () => {
    // Prepare search parameters
    const params = new URLSearchParams({
      keySearch: searchInput.trim(),
      industry: selectedMajor.trim(),
      location: selectedProvince.trim(),
    }).toString();

    // Navigate to the search-job page with query parameters
    navigate(`/search-job?${params}`);
    console.log(params);
  };

  const handleClearInput = () => setSearchInput("");

  const handleProvinceSelect = (value) => setSelectedProvince(value);

  const handleMajorSelect = (value) => setSelectedMajor(value);

  return (
    <div className="flex justify-between items-center bg-white rounded-full p-2 border border-secondary">
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
          <IconClose
            className="cursor-pointer hover:bg-secondary rounded-full w-6 h-6 ml-2"
            onClick={handleClearInput}
          />
        )}
      </div>
      <div className="flex items-center border-x px-2 ml-2">
        <IconLocation className="absolute m-2 w-5 h-5 text-gray-400" />
        <ComboboxLocation
          valueProvinces={selectedProvince}
          onSelectProvince={handleProvinceSelect}
        />
      </div>
      <div className="flex items-center border-r px-2 mr-4">
        <IconBag className="absolute m-2 w-5 h-5 text-gray-400" />
        <ComboboxMajor
          valueMajor={selectedMajor}
          onSelectMajor={handleMajorSelect}
        />
      </div>
      <Button
        className="bg-button text-white rounded-full px-5 max-h-10"
        onClick={handleSearch}
      >
        Tìm kiếm
      </Button>
    </div>
  );
};

export default SearchJob;
