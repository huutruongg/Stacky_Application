import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = ({ revenueData }) => {
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Tổng doanh thu Stacky",
        data: [
          revenueData?.january?.depositRevenue,
          revenueData?.february?.depositRevenue,
          revenueData?.march?.depositRevenue,
          revenueData?.april?.depositRevenue,
          revenueData?.may?.depositRevenue,
          revenueData?.june?.depositRevenue,
          revenueData?.july?.depositRevenue,
          revenueData?.august?.depositRevenue,
          revenueData?.september?.depositRevenue,
          revenueData?.october?.depositRevenue,
          revenueData?.november?.depositRevenue,
          revenueData?.december?.depositRevenue,
        ],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Tổng doanh thu bài đăng",
        data: [
          revenueData?.january?.paymentRevenue,
          revenueData?.february?.paymentRevenue,
          revenueData?.march?.paymentRevenue,
          revenueData?.april?.paymentRevenue,
          revenueData?.may?.paymentRevenue,
          revenueData?.june?.paymentRevenue,
          revenueData?.july?.paymentRevenue,
          revenueData?.august?.paymentRevenue,
          revenueData?.september?.paymentRevenue,
          revenueData?.october?.paymentRevenue,
          revenueData?.november?.paymentRevenue,
          revenueData?.december?.paymentRevenue,
        ],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Thống kê doanh thu",
      },
    },
  };

  return (
    <div className="bg-white p-5 rounded-lg" style={{ height: "300px" }}>
      <Line className="w-full" options={options} data={data} />
    </div>
  );
};

export default RevenueChart;
