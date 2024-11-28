import React from 'react';
import { topCompaniesData } from '../../assets/mockData/data';
import '../../assets/css/TopCompanies.css';

const TopCompanies = () => {
    return (
        <div className="top-companies-container">
            <h2 className="top-companies-title">Top Công Ty Mua Bài</h2>
            <div className="top-companies-content">
                {topCompaniesData.map((company, index) => (
                    <div key={index} className="top-companies-item">
                        <span>{company.name}</span>
                        <span>{company.field}</span>
                        <span className="top-companies-growth">{company.growth}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopCompanies;
