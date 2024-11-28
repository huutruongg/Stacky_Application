import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Trash from "../icons/Trash.png"; // Import icon thùng rác
import CompanyLogo from "../icons/CompanyLogo.png"; // Import logo công ty

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
  {
    id: 3,
    name: "Công ty TNHH TMA Solutions",
    email: "contact@tmasolutions.com.vn",
    registrationDate: "05/01/2024",
    details: {
      taxId: "0101456789",
      address: "Tòa nhà TMA, số 12 Lê Quang Đạo, Mỹ Đình, Hà Nội, Việt Nam",
      website: "https://www.tmasolutions.com.vn/",
      contactPerson: "Trần Văn C, Giám đốc Tuyển dụng",
      contactEmail: "tranvanc@tmasolutions.com.vn",
      phone: "+84 24 7456 7890",
      postedJobs: 15,
    },
  },
  {
    id: 4,
    name: "Công ty Cổ phần VNG",
    email: "contact@vng.com.vn",
    registrationDate: "07/01/2024",
    details: {
      taxId: "0101567890",
      address: "Tòa nhà VNG, số 35 Nguyễn Lương Bằng, Quận 7, TP.HCM, Việt Nam",
      website: "https://www.vng.com.vn/",
      contactPerson: "Vũ Thị D, Giám đốc Tuyển dụng",
      contactEmail: "vuthid@vng.com.vn",
      phone: "+84 28 2345 6789",
      postedJobs: 45,
    },
  },
  {
    id: 5,
    name: "Công ty TNHH Gameloft Việt Nam",
    email: "contact@gameloft.vn",
    registrationDate: "09/01/2024",
    details: {
      taxId: "0101678901",
      address: "Tòa nhà Gameloft, số 9 Nguyễn Hữu Thọ, Quận 7, TP.HCM, Việt Nam",
      website: "https://www.gameloft.vn/",
      contactPerson: "Phan Thị E, Giám đốc Tuyển dụng",
      contactEmail: "phanthie@gameloft.vn",
      phone: "+84 28 9999 8888",
      postedJobs: 20,
    },
  },
  {
    id: 6,
    name: "Công ty Cổ phần Tập đoàn Vingroup",
    email: "contact@vingroup.net",
    registrationDate: "11/01/2024",
    details: {
      taxId: "0101789012",
      address: "Tòa nhà Vingroup, số 7 đường Giải Phóng, Quận Hai Bà Trưng, Hà Nội, Việt Nam",
      website: "https://www.vingroup.net/",
      contactPerson: "Nguyễn Thị F, Giám đốc Tuyển dụng",
      contactEmail: "nguyenthif@vingroup.net",
      phone: "+84 24 7345 1234",
      postedJobs: 35,
    },
  },
  {
    id: 7,
    name: "Công ty TNHH DKT Solutions",
    email: "contact@dktsolutions.com.vn",
    registrationDate: "13/01/2024",
    details: {
      taxId: "0101890123",
      address: "Tòa nhà DKT, số 45 Lê Thánh Tông, Quận Hoàn Kiếm, Hà Nội, Việt Nam",
      website: "https://www.dktsolutions.com.vn/",
      contactPerson: "Lê Thị G, Giám đốc Tuyển dụng",
      contactEmail: "lethig@dktsolutions.com.vn",
      phone: "+84 24 3210 1234",
      postedJobs: 40,
    },
  },
  {
    id: 8,
    name: "Công ty TNHH Mắt Bão",
    email: "contact@matbao.vn",
    registrationDate: "15/01/2024",
    details: {
      taxId: "0101956789",
      address: "Tòa nhà Mắt Bão, số 123 Nguyễn Đình Chiểu, Quận 3, TP.HCM, Việt Nam",
      website: "https://www.matbao.vn/",
      contactPerson: "Trương Văn H, Giám đốc Tuyển dụng",
      contactEmail: "truongvanh@matbao.vn",
      phone: "+84 28 1234 5678",
      postedJobs: 50,
    },
  },
  {
    id: 9,
    name: "Công ty Cổ phần Dịch vụ Tư vấn và Đào tạo PTI",
    email: "contact@pti.vn",
    registrationDate: "18/01/2024",
    details: {
      taxId: "0102056789",
      address: "Tòa nhà PTI, số 56 Phan Bội Châu, Quận 1, TP.HCM, Việt Nam",
      website: "https://www.pti.vn/",
      contactPerson: "Phan Văn I, Giám đốc Tuyển dụng",
      contactEmail: "phanvani@pti.vn",
      phone: "+84 28 2345 6789",
      postedJobs: 28,
    },
  },
  {
    id: 10,
    name: "Công ty TNHH VinaGame",
    email: "contact@vinagame.vn",
    registrationDate: "20/01/2024",
    details: {
      taxId: "0102167890",
      address: "Tòa nhà VinaGame, số 78 Trần Hưng Đạo, Quận 1, TP.HCM, Việt Nam",
      website: "https://www.vinagame.vn/",
      contactPerson: "Nguyễn Văn J, Giám đốc Tuyển dụng",
      contactEmail: "nguyenvanj@vinagame.vn",
      phone: "+84 28 5678 1234",
      postedJobs: 22,
    },
  },
  {
    id: 11,
    name: "Công ty Cổ phần Bảo hiểm Bảo Việt",
    email: "contact@baoviet.com.vn",
    registrationDate: "22/01/2024",
    details: {
      taxId: "0102209876",
      address: "Tòa nhà Bảo Việt, số 123 Láng Hạ, Quận Đống Đa, Hà Nội, Việt Nam",
      website: "https://www.baoviet.com.vn/",
      contactPerson: "Nguyễn Thị K, Giám đốc Tuyển dụng",
      contactEmail: "nguyenthik@baoviet.com.vn",
      phone: "+84 24 3456 7890",
      postedJobs: 18,
    },
  },
  {
    id: 12,
    name: "Công ty TNHH VnExpress",
    email: "contact@vnexpress.net",
    registrationDate: "25/01/2024",
    details: {
      taxId: "0102307654",
      address: "Tòa nhà VnExpress, số 10 Lý Thường Kiệt, Quận Hoàn Kiếm, Hà Nội, Việt Nam",
      website: "https://www.vnexpress.net/",
      contactPerson: "Đoàn Văn L, Giám đốc Tuyển dụng",
      contactEmail: "doanvanl@vnexpress.net",
      phone: "+84 24 5678 2345",
      postedJobs: 12,
    },
  },
  {
    id: 13,
    name: "Công ty Cổ phần Tập đoàn Vinamilk",
    email: "contact@vinamilk.com.vn",
    registrationDate: "28/01/2024",
    details: {
      taxId: "0102406543",
      address: "Tòa nhà Vinamilk, số 50 Nguyễn Thị Minh Khai, Quận 1, TP.HCM, Việt Nam",
      website: "https://www.vinamilk.com.vn/",
      contactPerson: "Lê Thị M, Giám đốc Tuyển dụng",
      contactEmail: "lethim@vinamilk.com.vn",
      phone: "+84 28 9999 8888",
      postedJobs: 38,
    },
  },
  
];

function CompanyTable() {
  const [companies] = useState(mockCompanies);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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
              <td
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewDetails(company)}
                  style={{
                    backgroundColor: "#48038C",
                    borderColor: "#48038C",
                    borderRadius: "30px",
                    whiteSpace: "nowrap",
                  }}
                >
                  👁️ Xem chi tiết
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderColor: "#D9D9D9",
                    color: "white",
                    borderRadius: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "6px 21px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <img
                    src={Trash}
                    alt="Delete Icon"
                    style={{
                      width: "18px",
                      height: "18px",
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                  Xoá
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
              borderRadius: "30px",
              margin: "0 5px",
              cursor: "pointer",
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Modal for Details */}
      {selectedCompany && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header
            style={{
              background: "linear-gradient(90deg, rgba(72,3,140,1) 0%, rgba(186,117,255,1) 100%)",
              color: "white",
              borderBottom: "none",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span
              style={{
                cursor: "pointer",
                fontSize: "20px",
                color: "white",
              }}
              onClick={handleCloseModal}
            >
              ←
            </span>
            <Modal.Title style={{ flex: 1, textAlign: "center" }}>
              Thông Tin Công Ty
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex align-items-start gap-4">
              <img
                src={CompanyLogo}
                alt="Company Logo"
                style={{
                  width: "175px",
                  height: "175px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <p style={{ marginBottom: "16px" }}>
                  <strong>Tên công ty:</strong> {selectedCompany.name}
                </p>
                <p style={{ marginBottom: "16px" }}>
                  <strong>Mã số thuế:</strong> {selectedCompany.details.taxId}
                </p>
                <p style={{ marginBottom: "16px" }}>
                  <strong>Địa Chỉ Trụ Sở Chính:</strong>{" "}
                  {selectedCompany.details.address}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <p style={{ marginBottom: "16px" }}>
                <strong>Website:</strong>{" "}
                <a
                  href={selectedCompany.details.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#48038C" }}
                >
                  {selectedCompany.details.website}
                </a>
              </p>
              <p style={{ marginBottom: "16px" }}>
                <strong>Tên Người Liên Hệ Chính:</strong>{" "}
                {selectedCompany.details.contactPerson}
              </p>
              <p style={{ marginBottom: "16px" }}>
                <strong>Email Liên Hệ:</strong>{" "}
                {selectedCompany.details.contactEmail}
              </p>
              <p style={{ marginBottom: "16px" }}>
                <strong>Số Điện Thoại Liên Hệ:</strong>{" "}
                {selectedCompany.details.phone}
              </p>
              <p style={{ marginBottom: "16px" }}>
                <strong>Số Lượng Bài Tuyển Dụng Đã Đăng:</strong>{" "}
                {selectedCompany.details.postedJobs} bài đăng tuyển dụng.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="rounded-pill px-4 py-2"
              style={{
                backgroundColor: "#6c757d",
                borderColor: "#6c757d",
                color: "white",
                marginRight: "10px",
              }}
            >
              Khóa/Mở Khóa Công Ty
            </Button>
            <Button
              variant="danger"
              className="rounded-pill px-4 py-2"
              style={{
                backgroundColor: "#48038C",
                borderColor: "#48038C",
              }}
            >
              Xoá tài khoản
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default CompanyTable;
