// src/App.js

import Dashboard from "@/components/admin/Dashboard";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";


const DashboardAdmin = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header: Phần đầu trang */}
            <Header/>

            {/* Main content area */}
            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar: Cột bên trái */}
                <Sidebar/>

                {/* Content: Phần chính của Dashboard */}
                <div style={{ flex: 1, backgroundColor: '#f4f6f8', padding: '20px' }}>
                    <Dashboard/>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;
