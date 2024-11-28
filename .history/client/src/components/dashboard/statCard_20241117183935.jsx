import React from 'react';
import icon1 from "../icons/Icon1.png";
import icon2 from "../icons/Icon2.png";
import icon3 from "../icons/Icon3.png";
import icon4 from "../icons/Icon4.png";

const StatCard = ({ title, value, color, icon }) => {
    const styles = {
        card: {
            width: '240px',
            height: '147px',
            backgroundColor: 'white',
            borderRadius: '9px',
            margin: '10px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${color}`,
        },
        iconContainer: {
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '10px',
            backgroundColor: color,
        },
        icon: {
            width: '24px',
            height: '24px',
        },
        title: {
            fontWeight: '600',
            fontSize: '16px',
            textAlign: 'center',
        },
        value: {
            marginTop: '8px',
            fontWeight: '600',
            fontSize: '16px',
            textAlign: 'center',
            color: '#48038C',
        },
    };

    return (
        <div style={styles.card}>
            <div style={styles.iconContainer}>
                <img src={icon} alt="icon" style={styles.icon} />
            </div>
            <div style={styles.title}>{title}</div>
            <div style={styles.value}>{value}</div>
        </div>
    );
};

export const statData = [
    {
        title: "Tổng doanh thu",
        value: "20,000,000 VND",
        color: "rgba(255, 193, 7, 0.42)",
        icon: icon1, // Replace with actual path
    },
    {
        title: "Tổng bài viết",
        value: "4,000 bài viết",
        color: "rgba(15, 60, 222, 0.73)",
        icon: icon2, // Replace with actual path
    },
    {
        title: "Công ty",
        value: "350 công ty",
        color: "rgba(26, 43, 136, 0.61)",
        icon: icon3, // Replace with actual path
    },
    {
        title: "User",
        value: "635 user",
        color: "rgba(193, 84, 84, 0.58)",
        icon: icon4, // Replace with actual path
    },
];

export default StatCard;
