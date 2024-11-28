// File: src/components/UserTable.js

import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const mockUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    registrationDate: "01/01/2024",
    loginSource: "Google",
    password: "RFc244111",
    profilePicture: "https://via.placeholder.com/50", // Replace with actual URL or placeholder
  },
  {
    id: 2,
    name: "Trần Thị Bích Ngọc",
    email: "bichngoc@email.com",
    registrationDate: "05/01/2024",
    loginSource: "Facebook",
    password: "Fb12345678",
    profilePicture: "https://via.placeholder.com/50",
  },
  {
    id: 3,
    name: "Phạm Minh Đức",
    email: "github.com/minhduc",
    registrationDate: "10/01/2024",
    loginSource: "GitHub",
    password: "GitHubPassword123",
    profilePicture: "https://via.placeholder.com/50",
  },
  // Add more users as needed
];

function UserTable() {
  const [users] = useState(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const currentData = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
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
        <h2 style={{ fontSize: "20px", margin: 0 }}>Quản lý User</h2>
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
            <th>Tên</th>
            <th>Email/GitHub</th>
            <th>Ngày đăng ký</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((user, index) => (
            <tr key={user.id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={user.profilePicture}
                    alt="User"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  {user.name}
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.registrationDate}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewDetails(user)}
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
          <Modal.Title>Thông Tin Cá Nhân</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <img
                  src={selectedUser.profilePicture}
                  alt="User"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    marginRight: "15px",
                  }}
                />
                <div>
                  <p><strong>Họ và Tên:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Ngày Đăng Ký:</strong> {selectedUser.registrationDate}</p>
                </div>
              </div>
              <p><strong>Nguồn đăng nhập:</strong> {selectedUser.loginSource} - {selectedUser.email}</p>
              <p><strong>Mật khẩu:</strong> {selectedUser.password}</p>
              <Form inline>
                <Form.Control
                  type="text"
                  placeholder="Đặt lại mật khẩu"
                  className="mr-sm-2"
                  style={{ width: "200px", marginRight: "10px" }}
                />
                <Button variant="primary" style={{ backgroundColor: "#48038C", borderColor: "#48038C" }}>
                  Xác nhận
                </Button>
              </Form>
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

export default UserTable;
