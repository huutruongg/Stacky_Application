import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Trash from "../icons/Trash.png"; // Import icon thùng rác
import UserAvatar from "../icons/UserAvatar.png"; // Import user avatar

const mockUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    registrationDate: "01/01/2024",
    loginSource: "Google",
    password: "RFc244111",
    profilePicture: UserAvatar,
  },
  // Add more users if needed
];

function UserTable() {
  const [users] = useState(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
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
      {/* Table */}
      <Table bordered hover className="mt-3">
        <thead className="bg-primary text-white">
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Email</th>
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
                    alt="Avatar"
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleViewDetails(user)}
                    style={{
                      backgroundColor: "#48038C",
                      borderColor: "#48038C",
                      borderRadius: "30px",
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
                      padding: "5px 10px",
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
                </div>
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

      {/* Modal */}
      {selectedUser && (
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          centered
          dialogClassName="custom-modal"
        >
          <Modal.Header
            style={{
              background: "linear-gradient(90deg, rgba(72,3,140,1) 0%, rgba(186,117,255,1) 100%)",
              color: "white",
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
            <Modal.Title style={{ flex: 1, textAlign: "center" }}>Thông Tin Cá Nhân</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "24px" }}>
            <div style={{ display: "flex", gap: "24px" }}>
              <img
                src={selectedUser.profilePicture}
                alt="User Avatar"
                style={{
                  width: "175px",
                  height: "175px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <p style={{ marginBottom: "24px" }}>
                  <strong>Họ và Tên:</strong> {selectedUser.name}
                </p>
                <p style={{ marginBottom: "24px" }}>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Ngày Đăng Ký:</strong> {selectedUser.registrationDate}
                </p>
              </div>
            </div>
            <div style={{ marginTop: "24px" }}>
              <p>
                <strong>Nguồn đăng nhập:</strong> {selectedUser.loginSource} -{" "}
                {selectedUser.email}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "24px",
                  gap: "8px",
                }}
              >
                <p>
                  <strong>Mật khẩu:</strong> {selectedUser.password}
                </p>
                <Form.Group style={{ flex: 1, position: "relative" }}>
                  <Form.Control
                    type="text"
                    placeholder="Đặt lại mật khẩu"
                    style={{
                      borderRadius: "30px",
                      paddingRight: "80px",
                    }}
                  />
                  <Button
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "#48038C",
                      borderColor: "#48038C",
                      borderRadius: "30px",
                      fontSize: "12px",
                      padding: "4px 12px",
                      color: "white",
                    }}
                  >
                    Xác nhận
                  </Button>
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              style={{
                backgroundColor: "#6c757d",
                borderColor: "#6c757d",
                color: "white",
                borderRadius: "30px",
                padding: "10px 20px",
              }}
            >
              Khóa/Mở Khóa User
            </Button>
            <Button
              variant="danger"
              style={{
                backgroundColor: "#48038C",
                borderColor: "#48038C",
                borderRadius: "30px",
                padding: "10px 20px",
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

export default UserTable;
