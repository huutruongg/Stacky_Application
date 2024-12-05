import React, { useState } from "react";
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
import IconDropdown from "@/components/icons/IconDropdown";
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

const RevenueChart = ({ revenueData, setYear }) => {
  const [showYear, setShowYear] = useState(false);
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const startYear = 2023;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );
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

  const handleChangeYear = (year) => {
    setYear(year);
    setActiveYear(year);
  };

  return (
    <div className="bg-white rounded-lg p-5">
      <div
        className="flex flex-col gap-5 rounded-lg"
        style={{ maxHeight: "350px" }}
      >
        <Line className="w-full" options={options} data={data} />
      </div>
      <div className="flex items-center gap-2 mt-5">
        <div
          className="flex h-full items-center gap-2 text-sm cursor-pointer hover:text-primary"
          onClick={() => setShowYear(!showYear)}
        >
          <span>Chọn năm</span>
          <IconDropdown
            className={`w-[10px] h-[10px] transform transition-transform duration-300 rotate-[270deg]`}
          />
        </div>
        <div
          className={`flex items-center justify-start gap-2 transition-all duration-300 ease-in-out ${
            showYear
              ? "opacity-100 max-h-20 translate-x-0"
              : "opacity-0 max-h-0 translate-x-[100%] overflow-hidden"
          }`}
        >
          {years.map((year) => (
            <div
              key={year}
              className={`text-sm cursor-pointer decoration-primary ${
                activeYear === year ? "!text-primary underline" : ""
              }`}
              onClick={() => handleChangeYear(year)}
            >
              Năm {year}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
