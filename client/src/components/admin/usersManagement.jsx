import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Trash from "../icons/Trash.png"; // Import icon thùng rác
import UserAvatar from "../icons/DefaultAvatar.png"; // Import user avatar

const mockUsers = [
  {
    id: 1,
    name: "Trần Thị Bích",
    email: "nguyenvana@email.com",
    registrationDate: "01/01/2024",
    loginSource: "Google",
    password: "RFc244111",
    profilePicture: UserAvatar,
  },
  {
    id: 2,
    name: "Trần Thanh Tuấn",
    email: "tranthib@email.com",
    registrationDate: "02/01/2024",
    loginSource: "Google",
    password: "XJk852098",
    profilePicture: UserAvatar,
  },
  {
    id: 3,
    name: "Phạm Minh Tuấn",
    email: "phammathtuan@email.com",
    registrationDate: "04/01/2024",
    loginSource: "Google",
    password: "MNo234567",
    profilePicture: UserAvatar,
  },
  {
    id: 4,
    name: "Hoàng Thiện Quang",
    email: "hoangthienquang@email.com",
    registrationDate: "05/01/2024",
    loginSource: "GitHub",
    password: "ZPk563829",
    profilePicture: UserAvatar,
  },
  {
    id: 5,
    name: "Đỗ Thị Hằng",
    email: "dothihang@email.com",
    registrationDate: "06/01/2024",
    loginSource: "Google",
    password: "KLm761234",
    profilePicture: UserAvatar,
  },
  {
    id: 6,
    name: "Trương Minh Tâm",
    email: "truongminhtam@email.com",
    registrationDate: "07/01/2024",
    loginSource: "GitHub",
    password: "YTn321876",
    profilePicture: UserAvatar,
  },
  {
    id: 7,
    name: "Đặng Thị Lan",
    email: "dangthilan@email.com",
    registrationDate: "08/01/2024",
    loginSource: "Google",
    password: "RQr741235",
    profilePicture: UserAvatar,
  },
  {
    id: 8,
    name: "Vũ Minh Tiến",
    email: "vuminhtien@email.com",
    registrationDate: "09/01/2024",
    loginSource: "GitHub",
    password: "RTf852309",
    profilePicture: UserAvatar,
  },
  {
    id: 9,
    name: "Trần Quốc Toàn",
    email: "tranquoctoan@email.com",
    registrationDate: "10/01/2024",
    loginSource: "Google",
    password: "BQk234567",
    profilePicture: UserAvatar,
  },
  {
    id: 10,
    name: "Đoàn Thị Thu",
    email: "doanthithu@email.com",
    registrationDate: "11/01/2024",
    loginSource: "GitHub",
    password: "HQt145678",
    profilePicture: UserAvatar,
  },
  {
    id: 11,
    name: "Vũ Thị Kiều",
    email: "vuthikieu@email.com",
    registrationDate: "12/01/2024",
    loginSource: "Google",
    password: "Mjg572034",
    profilePicture: UserAvatar,
  },
  {
    id: 12,
    name: "Trương Minh Vương",
    email: "truongminhvuong@email.com",
    registrationDate: "13/01/2024",
    loginSource: "GitHub",
    password: "Plo832190",
    profilePicture: UserAvatar,
  },
  {
    id: 13,
    name: "Đặng Thị Mạnh",
    email: "dangthimanh@email.com",
    registrationDate: "14/01/2024",
    loginSource: "Google",
    password: "WJl745021",
    profilePicture: UserAvatar,
  },
  {
    id: 14,
    name: "Vũ Anh Tuấn",
    email: "vuanhtuan@email.com",
    registrationDate: "15/01/2024",
    loginSource: "GitHub",
    password: "FRu123456",
    profilePicture: UserAvatar,
  },
  {
    id: 15,
    name: "Văn Đoàn Tài",
    email: "doantai@email.com",
    registrationDate: "16/01/2024",
    loginSource: "Google",
    password: "EmT234564",
    profilePicture: UserAvatar,
  },
  {
    id: 16,
    name: "Trần Đoàn Kỳ",
    email: "doanky@email.com",
    registrationDate: "17/01/2024",
    loginSource: "Google",
    password: "ABk234987",
    profilePicture: UserAvatar,
  },
  {
    id: 17,
    name: "Trương Thị Tuyết",
    email: "truongthituyet@email.com",
    registrationDate: "18/01/2024",
    loginSource: "GitHub",
    password: "GHt567912",
    profilePicture: UserAvatar,
  },
  {
    id: 18,
    name: "Phạm Thị Lan",
    email: "phamthilan@email.com",
    registrationDate: "19/01/2024",
    loginSource: "Google",
    password: "GTu467230",
    profilePicture: UserAvatar,
  },
  {
    id: 19,
    name: "Trần Thiều",
    email: "tranthieu@email.com",
    registrationDate: "20/01/2024",
    loginSource: "GitHub",
    password: "WKi245787",
    profilePicture: UserAvatar,
  },
  {
    id: 20,
    name: "Vũ Thái",
    email: "vuthai@email.com",
    registrationDate: "21/01/2024",
    loginSource: "Google",
    password: "HRu354199",
    profilePicture: UserAvatar,
  },
  {
    id: 21,
    name: "Đặng Thiên Hòa",
    email: "dangthienhoa@email.com",
    registrationDate: "22/01/2024",
    loginSource: "GitHub",
    password: "HRt547829",
    profilePicture: UserAvatar,
  },
  {
    id: 22,
    name: "Trương Mai Quỳnh",
    email: "truongmaiquynh@email.com",
    registrationDate: "23/01/2024",
    loginSource: "Google",
    password: "PMr342676",
    profilePicture: UserAvatar,
  },
  {
    id: 23,
    name: "Vũ Tiến Dũng",
    email: "vutiendung@email.com",
    registrationDate: "24/01/2024",
    loginSource: "GitHub",
    password: "DTr123456",
    profilePicture: UserAvatar,
  },
  {
    id: 24,
    name: "Đoàn Vĩnh",
    email: "doanvinh@email.com",
    registrationDate: "25/01/2024",
    loginSource: "Google",
    password: "RQh456987",
    profilePicture: UserAvatar,
  },
  {
    id: 25,
    name: "Trần Đình Quang",
    email: "trandinhquang@email.com",
    registrationDate: "26/01/2024",
    loginSource: "GitHub",
    password: "FBp908745",
    profilePicture: UserAvatar,
  },
  {
    id: 26,
    name: "Vũ Hồng Đức",
    email: "vuhongduc@email.com",
    registrationDate: "27/01/2024",
    loginSource: "Google",
    password: "WEp908234",
    profilePicture: UserAvatar,
  },
  {
    id: 27,
    name: "Đỗ Minh Tấn",
    email: "dominhtan@email.com",
    registrationDate: "28/01/2024",
    loginSource: "GitHub",
    password: "VTr238456",
    profilePicture: UserAvatar,
  },
  {
    id: 28,
    name: "Trương Tiến Khoa",
    email: "truongtienkhoa@email.com",
    registrationDate: "29/01/2024",
    loginSource: "Google",
    password: "ZDk738932",
    profilePicture: UserAvatar,
  },
  {
    id: 29,
    name: "Phạm Tiến Tự",
    email: "phamtientu@email.com",
    registrationDate: "30/01/2024",
    loginSource: "GitHub",
    password: "MGy387492",
    profilePicture: UserAvatar,
  },
  {
    id: 30,
    name: "Vũ Quang Đại",
    email: "vuquangdai@email.com",
    registrationDate: "31/01/2024",
    loginSource: "Google",
    password: "CTw946283",
    profilePicture: UserAvatar,
  },
  // Add more users if needed
];

function UserTable() {
  const [users] = useState(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
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
            <th style={{ width: "200px" }}>Chức năng</th> {/* Set the width here */}
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
                  onClick={() => handleViewDetails(user)}
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
          </Modal.Body>
          <Modal.Footer
            style={{
              display: "flex",
              justifyContent: "center", // Center the button horizontally
              alignItems: "center", // Center the button vertically
            }}
          >
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
