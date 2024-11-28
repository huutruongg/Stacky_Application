import React, { useState } from "react";
import { Table, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Trash from "../icons/Trash.png"; // Import icon thùng rác

// Mock Data
const mockData = [
  { id: 1, title: "Tuyển dụng lập trình viên Java", company: "Công ty TNHH Phần mềm FPT", role: "Developer", slots: 15, startDate: "01/01/2024", endDate: "15/02/2024", status: "Đang mở" },
  { id: 2, title: "Tuyển dụng nhân viên marketing công nghệ", company: "Công ty Cổ phần Công nghệ CMC", role: "Marketing", slots: 7, startDate: "02/01/2024", endDate: "10/02/2024", status: "Đã đóng" },
  { id: 3, title: "Tuyển dụng kỹ sư hệ thống", company: "Công ty TNHH TMA Solutions", role: "System Engineer", slots: 5, startDate: "03/01/2024", endDate: "20/02/2024", status: "Đang mở" },
];

function JobPostings() {
  const [data, setData] = useState(mockData);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
                    border: "1px solid #e8e8e8",
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
                      width: "18px", // Đặt kích thước của icon
                      height: "18px",
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
        <div style={{ display: "flex", gap: "10px" }}>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              style={{
                padding: "8px 15px",
                backgroundColor: idx + 1 === currentPage ? "#48038C" : "#fff",
                color: idx + 1 === currentPage ? "#fff" : "#48038C",
                border: "1px solid #48038C",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobPostings;
