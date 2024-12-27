import React, { useEffect, useState } from "react";
import imgCompanySlide from "@/components/image/imgCompanySlide.png";
import IconSearch from "@/components/icons/IconSearch";
import IconClose from "@/components/icons/IconClose";
import { NavLink } from "react-router-dom";
import PaginationDemo from "@/components/pagination/Pagination";
import CompanyInfoSkeleton from "@/components/skeleton/CompanyInfoSkeleton";
import axiosInstance from "@/lib/authorizedAxios";
import ItemCompany from "@/components/itemJob/ItemCompany";

const TopCompanyListsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(12);

  const filteredCompanies = companyData.filter((company) => {
    const searchTerm = searchInput.toLowerCase();
    return (
      company.orgName?.toLowerCase().includes(searchTerm) ||
      company.orgEmail?.toLowerCase().includes(searchTerm)
    );
  });

  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentCompanyData = filteredCompanies.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const result = await axiosInstance.get(
        `/recruiter/get-list-company?search=${searchInput}`
      );
      setCompanyData(result.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(`/recruiter/get-list-company`);
        setCompanyData(result.data.result);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  const handleClearInput = () => setSearchInput("");

  return (
    <div>
      <div className="overflow-hidden">
        <img src={imgCompanySlide} alt="" />
        <div className="relative page-container">
          <div className="absolute top-[-280px]">
            <div className="flex items-center gap-5 mb-10 ">
              <NavLink
                to={"/company"}
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-primary border-b-2 border-primary"
                    : "text-text5 hover:text-primary"
                }
              >
                Danh sách công ty
              </NavLink>
              <NavLink
                to={"/company-top"}
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-primary border-b-2 border-primary"
                    : "text-text5 hover:text-primary"
                }
              >
                Top công ty
              </NavLink>
            </div>
            <div className="flex flex-col gap-7">
              <h1 className="text-xl text-primary font-medium">
                Khám phá 100.000+ công ty nổi bật
              </h1>
              <span>
                Tra cứu thông tin công ty và tìm kiếm nơi làm việc tốt nhất dành
                cho bạn
              </span>
              <div className="flex justify-between items-center bg-white rounded-full p-2 border border-secondary">
                <div className="relative flex items-center min-w-[500px]">
                  <IconSearch className="absolute m-2 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Vị trí tuyển dụng"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-5 py-1 outline-none rounded-lg"
                  />
                  {searchInput && (
                    <IconClose
                      className="cursor-pointer hover:bg-secondary rounded-full w-6 h-6 ml-2 mr-5"
                      onClick={handleClearInput}
                    />
                  )}
                </div>
                <button
                  className="flex items-center justify-center bg-button text-white rounded-full px-5 max-h-10 text-base font-semibold h-[48px] hover:opacity-90"
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-container flex flex-col justify-center items-center my-10">
        <h3 className="text-primary font-medium text-xl mb-8">
          DANH SÁCH CÁC TOP CÔNG TY
        </h3>
        <div className="grid w-full grid-cols-3 gap-5">
          {isLoading ? (
            <>
              <CompanyInfoSkeleton />
              <CompanyInfoSkeleton />
              <CompanyInfoSkeleton />
            </>
          ) : (
            currentCompanyData.map((item, index) => (
              <ItemCompany key={index} item={item} />
            ))
          )}
        </div>
        {companyData.length > 0 ? (
          <div className="mt-5">
            <PaginationDemo
              PerPage={newsPerPage}
              dataBase={companyData}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TopCompanyListsPage;
