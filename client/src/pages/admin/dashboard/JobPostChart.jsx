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

const JobPostChart = ({ chartPostData, setYear }) => {
  const [showYear, setShowYear] = useState(false);
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const startYear = 2023;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

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
        <Bar className="w-full" options={postOptions} data={postData} />
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

export default JobPostChart;
