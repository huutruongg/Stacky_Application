import IconAccount from "@/components/icons/IconAccount";
import IconBag from "@/components/icons/IconBag";
import IconManagerPost from "@/components/icons/IconManagerPost";
import IconPrice from "@/components/icons/IconPrice";
import React, { useEffect, useState } from "react";
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
import IconSort from "@/components/icons/IconSort";
import RevenueChart from "./RevenueChart";
import JobPostChart from "./JobPostChart";
import TopPostCompanyTable from "./TopPostCompanyTable";
import axiosInstance from "@/lib/authorizedAxios";

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
  const [revenueYear, setRevenueYear] = useState(2024);
  const [postYear, setPostYear] = useState(2024);
  const [data, setData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topPostCompany, setTopPostCompany] = useState([]);
  const [chartPostData, setChartPostData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatNumber = (number) => {
    if (!number) return 0;
    return Number(number).toLocaleString("vi-VN");
  };

  const handleSort = () => {
    const sortedCompanies = [...topPostCompany].sort((a, b) =>
      a.property > b.property ? 1 : -1
    );
    setTopPostCompany(sortedCompanies);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(`/admin/get-total-cards`);
        const result2 = await axiosInstance.get(
          `/admin/get-revenue-report?year=${revenueYear}`
        );
        const result3 = await axiosInstance.get(`/admin/get-top-5-posted-jobs`);
        const result4 = await axiosInstance.get(
          `/admin/count-jobs-by-month?year=${postYear}`
        );
        setData(result.data.totalCards);
        setRevenueData(result2.data.result);
        setTopPostCompany(result3.data.result);
        setChartPostData(result4.data.result);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [revenueYear, postYear]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 my-5 mr-5">
      <div className="grid grid-cols-4 gap-5">
        <ItemDashboard
          title="Tổng doanh thu"
          value={formatNumber(data?.totalRevenue)}
          unit="VND"
          icon={<IconPrice className="w-6 h-6" color="#fff" />}
          color="#ffcf3f"
          path="/admin/dashboard"
        />
        <ItemDashboard
          title="Tổng bài viết"
          value={formatNumber(data?.totalJobs)}
          unit="Bài viết"
          icon={<IconManagerPost className="w-6 h-6" color="#fff" />}
          color="#0F3DDE"
          path="/admin/post-management"
        />
        <ItemDashboard
          title="Công ty"
          value={formatNumber(data?.totalCompanies)}
          unit="Công ty"
          icon={<IconBag className="w-6 h-6" color="#fff" />}
          color="#48538f"
          path="/admin/company-management"
        />
        <ItemDashboard
          title="Tài khoản"
          value={formatNumber(data?.totalCandidates)}
          unit="Tài khoản"
          icon={<IconAccount className="w-6 h-6" color="#fff" />}
          color="#d83636"
          path="/admin/account-management"
        />
      </div>
      <div className="flex flex-col gap-5">
        <RevenueChart revenueData={revenueData} setYear={setRevenueYear} />
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-6 bg-white p-5 rounded-lg">
          <div className="flex justify-between items-center text-primary">
            <h3 className="text-xl font-medium">Top công ty đăng bài</h3>
            <div
              className="flex items-center px-3 py-1 bg-gray-100 rounded-lg gap-2 cursor-pointer"
              onClick={() => {
                handleSort();
              }}
            >
              <span>Sắp xếp</span>
              <IconSort className="w-6 h-6" color="#48038C" />
            </div>
          </div>
          <TopPostCompanyTable topPostCompany={topPostCompany} />
        </div>
        <div className="col-span-6 bg-white rounded-lg">
          <JobPostChart chartPostData={chartPostData} setYear={setPostYear} />
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
