import React from "react";
import FptLogo from "../icons/FptLogo.png";
import CmcLogo from "../icons/CmcLogo.png";
import ViettelLogo from "../icons/ViettelLogo.png";
import NastechLogo from "../icons/NastechLogo.png"; // Fallback

const topCompaniesData = [
  {
    name: "FPT Software",
    field: "Phát triển Phần mềm",
    growth: "+100%",
    logo: FptLogo,
  },
  {
    name: "CMC Corporation",
    field: "Tích hợp hệ thống",
    growth: "+95%",
    logo: CmcLogo,
  },
  {
    name: "NashTech",
    field: "Phát triển phần mềm",
    growth: "+89%",
    logo: NastechLogo, // Placeholder if Nastech.png is missing
  },
  {
    name: "Viettel",
    field: "Viễn thông",
    growth: "+79%",
    logo: ViettelLogo,
  },
];

export default function TopCompanies() {
  return (
    <div>
      {/* Rest of the code */}
    </div>
  );
}
