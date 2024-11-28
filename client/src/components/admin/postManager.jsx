import React, { useState } from "react";
import { Table, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Trash from "../icons/Trash.png"; // Import icon thùng rác

// Mock Data
const mockData = [
  { id: 1, title: "Tuyển dụng lập trình viên Java", company: "Công ty TNHH Phần mềm FPT", role: "Developer", slots: 15, startDate: "01/01/2024", endDate: "15/02/2024", status: "Đang mở" },
  { id: 2, title: "Tuyển dụng nhân viên marketing công nghệ", company: "Công ty Cổ phần Công nghệ CMC", role: "Marketing", slots: 7, startDate: "02/01/2024", endDate: "10/02/2024", status: "Đã đóng" },
  { id: 3, title: "Tuyển dụng kỹ sư hệ thống", company: "Công ty TNHH TMA Solutions", role: "System Engineer", slots: 5, startDate: "03/01/2024", endDate: "20/02/2024", status: "Đang mở" },
  { id: 4, title: "Tuyển dụng QA phần mềm", company: "Công ty TNHH Phần mềm Tân Vân", role: "QA Tester", slots: 8, startDate: "04/01/2024", endDate: "12/02/2024", status: "Đang mở" },
  { id: 5, title: "Tuyển dụng lập trình viên Python", company: "Công ty TNHH KMS Technology", role: "Developer", slots: 20, startDate: "05/01/2024", endDate: "25/02/2024", status: "Đang mở" },
  { id: 6, title: "Tuyển dụng chuyên viên bảo mật", company: "Công ty TNHH Rikeksoft", role: "Security Specialist", slots: 10, startDate: "06/01/2024", endDate: "18/02/2024", status: "Đang mở" },
  { id: 7, title: "Tuyển dụng lập trình viên C++", company: "Công ty TNHH NashTech Việt Nam", role: "Developer", slots: 12, startDate: "07/01/2024", endDate: "22/02/2024", status: "Đang mở" },
  { id: 8, title: "Tuyển dụng chuyên gia AI", company: "Công ty TNHH Global Cybersoft", role: "AI Engineer", slots: 8, startDate: "08/01/2024", endDate: "15/02/2024", status: "Đang mở" },
  { id: 9, title: "Tuyển dụng lập trình viên Frontend", company: "Công ty TNHH CodeGym", role: "Developer", slots: 18, startDate: "09/01/2024", endDate: "20/02/2024", status: "Đang mở" },
  { id: 10, title: "Tuyển dụng chuyên viên phân tích dữ liệu", company: "Công ty TNHH DataTech", role: "Data Analyst", slots: 6, startDate: "10/01/2024", endDate: "15/02/2024", status: "Đang mở" },
  { id: 11, title: "Tuyển dụng nhân viên thiết kế đồ họa", company: "Công ty Cổ phần Thiết kế sáng tạo IDEAS", role: "Graphic Designer", slots: 4, startDate: "11/01/2024", endDate: "18/02/2024", status: "Đã đóng" },
  { id: 12, title: "Tuyển dụng kỹ sư AI", company: "Công ty TNHH AI Insight", role: "AI Engineer", slots: 10, startDate: "28/01/2024", endDate: "15/02/2024", status: "Đang mở" },
  { id: 13, title: "Tuyển dụng chuyên viên quản trị mạng", company: "Công ty TNHH CyberGuard", role: "Network Administrator", slots: 9, startDate: "13/01/2024", endDate: "22/02/2024", status: "Đang mở" },
  { id: 14, title: "Tuyển dụng kỹ sư DevOps", company: "Công ty TNHH DevTech", role: "DevOps Engineer", slots: 7, startDate: "14/01/2024", endDate: "20/02/2024", status: "Đang mở" },
  { id: 15, title: "Tuyển dụng lập trình viên Ruby on Rails", company: "Công ty TNHH RubySoft", role: "Developer", slots: 5, startDate: "15/01/2024", endDate: "25/02/2024", status: "Đang mở" },
  { id: 16, title: "Tuyển dụng chuyên viên kiểm thử tự động", company: "Công ty TNHH AutoTest", role: "Automation Tester", slots: 8, startDate: "16/01/2024", endDate: "28/02/2024", status: "Đang mở" },
  { id: 17, title: "Tuyển dụng chuyên gia phân tích nghiệp vụ", company: "Công ty TNHH BizAnalyst", role: "Business Analyst", slots: 10, startDate: "17/01/2024", endDate: "01/03/2024", status: "Đang mở" },
  { id: 18, title: "Tuyển dụng lập trình viên Fullstack", company: "Công ty TNHH TechStack", role: "Fullstack Developer", slots: 12, startDate: "18/01/2024", endDate: "05/03/2024", status: "Đang mở" },
];

function JobPostings() {
  const [data, setData] = useState(mockData);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) || item.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  return (
    <div className="container mt-4">
      {/* Header with Title and Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(90deg, rgba(72,3,140,1) 0%, rgba(217,188,255,1) 100%)",
          padding: "15px 20px",
          borderRadius: "5px",
          gap: "55px",
        }}
      >
        <h2 style={{ fontSize: "20px", color: "white", margin: 0 }}>Quản lý Bài viết</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "white",
            padding: "5px 15px",
            borderRadius: "30px",
            border: "1px solid #e8e8e8",
            width: "380px",
          }}
        >
          <span
            style={{
              fontSize: "22px",
              color: "#6f767e",
              marginRight: "10px",
            }}
          >
            ⌕
          </span>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm"
            value={search}
            onChange={handleSearch}
            style={{
              border: "none",
              boxShadow: "none",
              outline: "none",
              fontSize: "14px",
              flex: 1,
            }}
          />
        </div>
      </div>
      {/* Table */}
      <Table bordered hover className="mt-3">
        <thead className="bg-primary text-white">
          <tr>
            <th>STT</th>
            <th>Tiêu đề</th>
            <th>Công ty đăng tuyển</th>
            <th>Ngành nghề tuyển dụng</th>
            <th>SL</th>
            <th>Ngày đăng</th>
            <th>Hạn nộp đơn</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
              <td>{item.title}</td>
              <td>{item.company}</td>
              <td>{item.role}</td>
              <td>{item.slots}</td>
              <td>{item.startDate}</td>
              <td>{item.endDate}</td>
              <td style={{ color: item.status === "Đang mở" ? "#4ADE80" : "#6c757d" }}>
                {item.status}
              </td>

              <td>
                <button
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={Trash} // Sử dụng icon từ đường dẫn đã cung cấp
                    alt="Delete Icon"
                    style={{
                      width: "22px", // Đặt kích thước của icon
                      height: "22px",
                    }}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Custom Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            style={{
              padding: "8px 15px",
              backgroundColor: idx + 1 === currentPage ? "#48038C" : "#fff",
              color: idx + 1 === currentPage ? "#fff" : "#48038C",
              border: "1px solid #48038C",
              borderRadius: "30px",
              margin: "0 5px",
              cursor: "pointer",
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default JobPostings;
