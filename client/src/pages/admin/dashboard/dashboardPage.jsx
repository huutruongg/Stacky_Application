import IconAccount from "@/components/icons/IconAccount";
import IconBag from "@/components/icons/IconBag";
import IconManagerPost from "@/components/icons/IconManagerPost";
import IconPrice from "@/components/icons/IconPrice";
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

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
        label: "Doanh thu theo tháng",
        data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
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
        text: "Biểu đồ doanh thu",
      },
    },
  };

  return (
    <div className="flex flex-col gap-5 my-5 mr-5">
      <div className="grid grid-cols-4 gap-5">
        <ItemDashboard
          title="Tổng doanh thu"
          value={formatNumber("20000000")}
          unit="VND"
          icon={<IconPrice className="w-6 h-6" color="#fff" />}
          color="#ffcf3f"
        />
        <ItemDashboard
          title="Tổng bài viết"
          value={formatNumber("4000")}
          unit="Bài viết"
          icon={<IconManagerPost className="w-6 h-6" color="#fff" />}
          color="#0F3DDE"
        />
        <ItemDashboard
          title="Công ty"
          value={formatNumber("4000")}
          unit="Công ty"
          icon={<IconBag className="w-6 h-6" color="#fff" />}
          color="#48538f"
        />
        <ItemDashboard
          title="Tài khoản"
          value={formatNumber("2000")}
          unit="Tài khoản"
          icon={<IconAccount className="w-6 h-6" color="#fff" />}
          color="#d83636"
        />
      </div>
      <div className="flex flex-col gap-5">
        <div className="bg-white p-5 rounded-lg" style={{ height: "300px" }}>
          <Line className="w-full" options={options} data={data} />
        </div>
      </div>
    </div>
  );
};

const ItemDashboard = ({ title, value, icon, color, unit, path }) => {
  return (
    <NavLink
      to={path}
      style={{ borderColor: color, color: color }}
      className="relative flex flex-col items-center justify-between gap-3 p-5 border-[2px] rounded-lg bg-white "
    >
      <span className="text-lg font-medium">{title}</span>
      <div className="flex gap-2">
        <span className="text-xl font-medium">{value}</span>
        <span className="text-xl font-medium">{unit}</span>
      </div>
      <div
        style={{ backgroundColor: color }}
        className="flex items-center justify-center p-3 rounded-full"
      >
        {icon}
      </div>
      <div
        style={{ borderRightColor: color }}
        className="absolute bottom-5 right-5 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-transparent border-r-[20px] rounded-sm"
      ></div>
    </NavLink>
  );
};

export default DashboardPage;
