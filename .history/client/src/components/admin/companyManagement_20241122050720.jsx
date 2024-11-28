// File: src/components/CompanyTable.js

import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const mockCompanies = [
  {
    id: 1,
    name: "Công ty TNHH Phần mềm FPT",
    email: "contact@fptsoftware.com.vn",
    registrationDate: "01/01/2024",
    details: {
      taxId: "0101248141",
      address: "Tòa nhà FPT, số 17 Duy Tân, Cầu Giấy, Hà Nội, Việt Nam",
      website: "https://www.fpt.com.vn/",
      contactPerson: "Nguyễn Văn A, Giám đốc Tuyển dụng",
      contactEmail: "nguyenvana@fpt.com.vn",
      phone: "+84 24 7300 7300",
      postedJobs: 25,
    },
  },
  {
    id: 2,
    name: "Công ty Cổ phần Công nghệ CMC",
    email: "cmcsoftware@cmc.com.vn",
    registrationDate: "03/01/2024",
    details: {
      taxId: "0101256789",
      address: "Tòa nhà CMC, số 123 Trần Duy Hưng, Hà Nội, Việt Nam",
      website: "https://www.cmc.com.vn/",
      contactPerson: "Nguyễn Thị B, Giám đốc",
      contactEmail: "nguyenthib@cmc.com.vn",
      phone: "+84 24 1234 5678",
      postedJobs: 30,
    },
  },
  // Add more companies as needed
];

function CompanyTable() {
  const [companies] = useState(mockCompanies);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const currentData = companies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCompany(null);
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(90deg, rgba(72,3,140,1) 0%, rgba(217,188,255,1) 100%)",
          padding: "15px 20px",
          borderRadius: "5px",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        <h2 style={{ fontSize: "20px", margin: 0 }}>Quản lý Công ty</h2>
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
          <input
            type="text"
            placeholder="Tìm kiếm"
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
            <th>Tên công ty</th>
            <th>Email</th>
            <th>Ngày đăng ký</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((company, index) => (
            <tr key={company.id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{company.name}</td>
              <td>{company.email}</td>
              <td>{company.registrationDate}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewDetails(company)}
                  style={{
                    backgroundColor: "#48038C",
                    borderColor: "#48038C",
                    marginRight: "10px",
                  }}
                >
                  👁️ Xem chi tiết
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  style={{ borderColor: "#e8e8e8", color: "#6f767e" }}
                >
                  🗑 Xoá
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
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
              borderRadius: "5px",
              margin: "0 5px",
              cursor: "pointer",
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Modal for Details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#48038C",
            color: "white",
          }}
        >
          <Modal.Title>Thông Tin Công Ty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCompany && (
            <div>
              <p><strong>Tên công ty:</strong> {selectedCompany.name}</p>
              <p><strong>Mã số thuế:</strong> {selectedCompany.details.taxId}</p>
              <p><strong>Địa chỉ:</strong> {selectedCompany.details.address}</p>
              <p><strong>Website:</strong> <a href={selectedCompany.details.website} target="_blank" rel="noopener noreferrer">{selectedCompany.details.website}</a></p>
              <p><strong>Người liên hệ:</strong> {selectedCompany.details.contactPerson}</p>
              <p><strong>Email liên hệ:</strong> {selectedCompany.details.contactEmail}</p>
              <p><strong>Số điện thoại:</strong> {selectedCompany.details.phone}</p>
              <p><strong>Số lượng bài tuyển dụng:</strong> {selectedCompany.details.postedJobs}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Khóa/Mở Khóa Công Ty
          </Button>
          <Button
            variant="danger"
            onClick={() => alert("Xoá tài khoản!")}
            style={{ backgroundColor: "#48038C", borderColor: "#48038C" }}
          >
            Xoá tài khoản
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CompanyTable;
