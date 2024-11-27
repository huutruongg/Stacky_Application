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
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import IconSort from "@/components/icons/IconSort";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const DashboardPage = () => {
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSort = () => {
    console.log("sort");
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
        data: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Số lượng bài đăng",
        data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
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
        text: "Biểu đồ doanh thu",
      },
    },
  };

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
        data: [65, 59, 80, 81, 56, 55, 40, 10, 20, 30, 40, 50],
        backgroundColor: "#48038C",
        borderRadius: 4
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
        text: "Biểu đồ số lượng bài đăng",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-6 bg-white p-5 rounded-lg">
          <div className="flex justify-between items-center text-primary">
            <h3 className="text-xl font-medium">Top công ty đăng bài</h3>
            <div className="flex items-center px-3 py-1 bg-gray-100 rounded-lg gap-2 cursor-pointer" onClick={() => {handleSort()}}>
              <span>Sắp xếp</span>
              <IconSort className="w-6 h-6" color="#48038C" />
            </div>
          </div>
          <Table className="mt-5">
            <TableHeader className="text-base">
              <TableRow>
                <TableHead className="text-center w-[40%]">
                  Tên công ty
                </TableHead>
                <TableHead className="text-center w-[40%]">Lĩnh vực</TableHead>
                <TableHead className="text-center w-[20%]">
                  Số bài viết
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="font-medium">
                <TableCell className="text-center">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://dyl347hiwv3ct.cloudfront.net/app/uploads/2023/09/img-favicon.png"
                      alt=""
                      className="w-8 h-8 rounded-full border border-gray-200"
                    />
                    <span className="line-clamp-1 leading-10">Công ty A</span>
                  </div>
                </TableCell>
                <TableCell className="text-center line-clamp-1 leading-10">
                  Phát triển Phần mềm
                </TableCell>
                <TableCell className="text-center">100</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="col-span-6 bg-white p-5 rounded-lg">
          <Bar className="w-full" options={postOptions} data={postData} />
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
