import React from 'react';

// Mockdata
const stats = [
    {
        title: 'Tổng doanh thu',
        value: '20,000,000 VND',
        icon: require('../icons/Icon1.png'),
        bgColor: '#FFF7E0',
        borderColor: '#FFDD99',
    },
    {
        title: 'Tổng bài viết',
        value: '4,000 bài viết',
        icon: require('../icons/Icon2.png'),
        bgColor: '#EDEAFF',
        borderColor: '#C7BFFF',
    },
    {
        title: 'Công ty',
        value: '350 công ty',
        icon: require('../icons/Icon3.png'),
        bgColor: '#F0F5FF',
        borderColor: '#A0C8FF',
    },
    {
        title: 'User',
        value: '635 user',
        icon: require('../icons/Icon4.png'),
        bgColor: '#FFEDED',
        borderColor: '#FFBDBD',
    },
];

const StatCard = ({ title, value, icon, bgColor, borderColor }) => {
    const styles = {
        card: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '250px',
            height: '150px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            border: `2px solid ${borderColor}`,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
        },
        title: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333',
        },
        value: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
        },
        iconContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '50px',
            height: '50px',
            backgroundColor: bgColor,
            borderRadius: '50%',
            position: 'absolute',
            bottom: '20px',
            left: '20px',
        },
        icon: {
            width: '24px',
            height: '24px',
        },
        cornerDecoration: {
            width: '30px',
            height: '30px',
            backgroundColor: bgColor,
            position: 'absolute',
            top: 'calc(100% - 30px)',
            right: '20px',
            clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
        },
    };

    return (
        <div style={styles.card}>
            <div style={styles.title}>{title}</div>
            <div style={styles.value}>{value}</div>
            <div style={styles.iconContainer}>
                <img src={icon} alt={`${title} icon`} style={styles.icon} />
            </div>
            <div style={styles.cornerDecoration}></div>
        </div>
    );
};

const StatCards = () => {
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

export default StatCards;
