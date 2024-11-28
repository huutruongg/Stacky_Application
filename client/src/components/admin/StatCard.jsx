import React from 'react';
import '../../assets/css/StatCard.css';

const StatCard = ({ title, value, color, icon }) => {
    return (
        <div className="stat-card" style={{ border: `1px solid ${color}` }}>
            <div className="stat-card-icon-container" style={{ backgroundColor: color }}>
                <img src={icon} alt="icon" style={{ width: '24px', height: '24px' }} />
            </div>
            <div className="stat-card-title">{title}</div>
            <div className="stat-card-value">{value}</div>
        </div>
    );
};

export default StatCard;
