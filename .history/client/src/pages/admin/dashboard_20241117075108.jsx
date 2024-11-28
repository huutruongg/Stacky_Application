import React from "react";
import Sidebar from "@/components/dashboard/sideBar";
import StatCard from "@/components/dashboard/statCard";
import LineChart from "@/components/dashboard/linechart";
import BarChart from "@/components/dashboard/barchart";
import TopCompanies from "@/components/dashboard/topCompanies";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="dashboard-statcards">
                {statData.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        color={stat.color}
                        icon={stat.icon}
                    />
                ))}
            </div>
            <div className="dashboard-chart">
                <LineChart />
            </div>
            <div className="dashboard-bottom">
                <TopCompanies />
                
                    <BarChart />
                
            </div>
        </div>
    );
};

export default Dashboard;

