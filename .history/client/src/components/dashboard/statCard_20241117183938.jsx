import React from 'react';
import StatCard from './StatCard';

// Mock data và import các biểu tượng
import icon1 from '../icons/Icon1.png';
import icon2 from '../icons/Icon2.png';
import icon3 from '../icons/Icon3.png';
import icon4 from '../icons/Icon4.png';

const stats = [
    {
        title: 'Tổng doanh thu',
        value: '20,000,000 VND',
        icon: icon1, // Icon từ file tĩnh
        bgColor: '#FFF7E0',
        borderColor: '#FFDD99',
    },
    {
        title: 'Tổng bài viết',
        value: '4,000 bài viết',
        icon: icon2,
        bgColor: '#EDEAFF',
        borderColor: '#C7BFFF',
    },
    {
        title: 'Công ty',
        value: '350 công ty',
        icon: icon3,
        bgColor: '#F0F5FF',
        borderColor: '#A0C8FF',
    },
    {
        title: 'User',
        value: '635 user',
        icon: icon4,
        bgColor: '#FFEDED',
        borderColor: '#FFBDBD',
    },
];

const Dashboard = () => {
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            padding: '20px',
        },
    };

    return (
        <div style={styles.container}>
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    bgColor={stat.bgColor}
                    borderColor={stat.borderColor}
                />
            ))}
        </div>
    );
};

export default Dashboard;
