import React from "react";
import FptLogo from "../icons/FptLogo.png";
import CmcLogo from "../icons/CmcLogo.png";
import ViettelLogo from "../icons/ViettelLogo.png";
import NastechLogo from "../icons/NastechLogo.png";

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
    logo: NastechLogo,
  },
  {
    name: "Viettel",
    field: "Viễn thông",
    growth: "+79%",
    logo: ViettelLogo,
  },
];

const TopCompanies = () => {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      {/* Title Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: 0,
            color: "#000",
          }}
        >
          Top Công Ty Mua Bài
        </h2>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: "transparent",
            border: "1px solid #7e57c2",
            borderRadius: "20px",
            padding: "5px 15px",
            color: "#7e57c2",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Sắp xếp
          <span
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            &#9881;
          </span>
        </button>
      </div>

      {/* Table Section */}
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1fr",
            gap: "20px",
            padding: "10px 0",
            borderBottom: "1px solid #e0e0e0",
            fontWeight: "bold",
            color: "#7e7e7e",
            fontSize: "14px",
          }}
        >
          <span>Tên công ty</span>
          <span>Lĩnh vực</span>
          <span style={{ textAlign: "right" }}>Mức tăng</span>
        </div>
        {topCompaniesData.map((company, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 1fr",
              gap: "20px",
              padding: "15px 0",
              borderBottom: index !== topCompaniesData.length - 1 ? "1px solid #e0e0e0" : "none",
              alignItems: "center",
            }}
          >
            {/* Company Name and Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={company.logo}
                alt={company.name}
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
              />
              <span style={{ fontWeight: "bold", color: "#000" }}>{company.name}</span>
            </div>

            {/* Field */}
            <span style={{ color: "#000" }}>{company.field}</span>

            {/* Growth */}
            <span
              style={{
                textAlign: "right",
                color: company.growth.includes("+") ? "#4caf50" : "#f44336",
                fontWeight: "bold",
              }}
            >
              {company.growth}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCompanies;
