// src/mockData/data.js
import Icon1 from '../../components/icons/adminIcons/Icon1.png';
import Icon2 from '../../components/icons/adminIcons/Icon2.png';
import Icon3 from '../../components/icons/adminIcons/Icon3.png';
import Icon4 from '../../components/icons/adminIcons/Icon4.png';

export const statData = [
    {
        title: "Tổng doanh thu",
        value: "20,000,000 VND",
        color: "rgba(255, 193, 7, 0.42)",
        icon: Icon1,
    },
    {
        title: "Tổng bài viết",
        value: "4,000 bài viết",
        color: "rgba(15, 60, 222, 0.73)",
        icon: Icon2,
    },
    {
        title: "Công ty",
        value: "350 công ty",
        color: "rgba(26, 43, 136, 0.61)",
        icon: Icon3,
    },
    {
        title: "User",
        value: "635 user",
        color: "rgba(193, 84, 84, 0.58)",
        icon: Icon4,
    }
];

export const lineChartData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [
        {
            label: 'Doanh thu Stacky',
            data: [65, 59, 80, 81, 56, 55, 40, 85, 90, 78, 88, 92],
            backgroundColor: 'rgba(72, 3, 140, 0.2)',
            borderColor: '#48038C',
            borderWidth: 2,
            pointBackgroundColor: '#48038C',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#48038C',
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.3,
            fill: true,
        },
        {
            label: 'Doanh thu bài đăng',
            data: [45, 39, 60, 71, 66, 65, 50, 75, 80, 68, 78, 82],
            backgroundColor: 'rgba(193, 84, 84, 0.2)',
            borderColor: '#C15555',
            borderWidth: 2,
            pointBackgroundColor: '#C15555',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#C15555',
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.3,
            fill: true,
        }
    ],
};

export const topCompaniesData = [
    { name: 'FPT Software', field: 'Phát triển Phần mềm', growth: '+100%' },
    { name: 'CMC Corporation', field: 'Tích hợp hệ thống', growth: '+95%' },
    { name: 'NashTech', field: 'Phát triển phần mềm', growth: '+89%' },
    { name: 'Viettel', field: 'Viễn thông', growth: '+79%' },
];
