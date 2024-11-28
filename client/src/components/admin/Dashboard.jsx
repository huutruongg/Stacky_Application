import React from 'react';
import { statData } from '../../assets/mockData/data.js';
import '../../assets/css/Dashboard.css';
import StatCard from './StatCard.jsx';
import LineChart from './LineChart.jsx';
import TopCompanies from './TopCompanies.jsx';
import BarChart from './Barchart.jsx';

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
                <LineChart/>
            </div>
            <div className="dashboard-bottom">
                <TopCompanies/>
                
                    <BarChart/>
                
            </div>
        </div>
    );
};

export default Dashboard;
