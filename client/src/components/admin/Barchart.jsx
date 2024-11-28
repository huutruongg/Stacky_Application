import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import '../../assets/css/Barchart.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = () => {
    const data = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        datasets: [
            {
                label: 'Bài Post',
                data: [20, 45, 60, 35, 75, 40, 60, 80, 70, 55, 50, 65],
                backgroundColor: 'rgba(72, 3, 140, 0.7)',
                borderColor: '#48038C',
                borderWidth: 1,
                borderRadius: 5,
                barPercentage: 0.9,
                categoryPercentage: 0.9
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: 'black'
                }
            },
            title: {
                display: true,
                text: 'Thống kê bài viết',
                color: '#48038C',
                font: {
                    size: 18
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    color: '#BCBCBC'
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                    color: '#BCBCBC'
                }
            }
        }
    };

    return (
        <div className="bar-chart-container">
            <Bar data={data} options={options} />
        </div>
    );
};

export default BarChart;
