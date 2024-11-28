import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import Dashboard from "@/components/admin/Dashboard";
import PostManagerContent from "@/components/admin/postManager";
import CompanyManagement from "@/components/admin/companyManagement";
import UsersManagement from "@/components/admin/usersManagement";

const AdminRoutes = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <Sidebar />
        <div style={{ flex: 1, backgroundColor: "#f4f6f8", padding: "20px" }}>
          {/* Admin Route Definitions */}
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/posts" element={<PostManagerContent />} />
            <Route path="/companies" element={<CompanyManagement />} />
            <Route path="/users" element={<UsersManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminRoutes;
