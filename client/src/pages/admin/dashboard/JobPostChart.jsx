import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
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

const JobPostChart = ({ chartPostData }) => {
  const postLabels = [
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
  const postData = {
    labels: postLabels,
    datasets: [
      {
        label: "Số lượng bài đăng theo tháng",
        data: [
          chartPostData?.january,
          chartPostData?.february,
          chartPostData?.march,
          chartPostData?.april,
          chartPostData?.may,
          chartPostData?.june,
          chartPostData?.july,
          chartPostData?.august,
          chartPostData?.september,
          chartPostData?.october,
          chartPostData?.november,
          chartPostData?.december,
        ],
        backgroundColor: "#48038C",
        borderRadius: 4,
      },
    ],
  };

  const postOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Thống kê số lượng bài đăng",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar className="w-full" options={postOptions} data={postData} />;
};

export default JobPostChart;
