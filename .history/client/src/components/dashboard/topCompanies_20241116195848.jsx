import React from "react";

const TopCompanies = () => {
  const topCompaniesData = [
    { name: "FPT Software", field: "Phát triển Phần mềm", growth: "+100%" },
    { name: "CMC Corporation", field: "Tích hợp hệ thống", growth: "+95%" },
    { name: "NashTech", field: "Phát triển phần mềm", growth: "+89%" },
    { name: "Viettel", field: "Viễn thông", growth: "+79%" },
  ];

  const styles = {
    container: {
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      width: "100%",
      maxWidth: "500px",
      margin: "0 auto",
    },
    title: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#48038C",
      marginBottom: "15px",
    },
    content: {},
    item: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid #f0f0f0",
    },
    growth: {
      color: "#16C098",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Top Công Ty Mua Bài</h2>
      <div style={styles.content}>
        {topCompaniesData.map((company, index) => (
          <div key={index} style={styles.item}>
            <span>{company.name}</span>
            <span>{company.field}</span>
            <span style={styles.growth}>{company.growth}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCompanies;
