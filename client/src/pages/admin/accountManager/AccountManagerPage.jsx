import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import IconDelete from "@/components/icons/IconDelete";
import PaginationDemo from "@/components/pagination/Pagination";
import IconEye from "@/components/icons/IconEye";
import { AlertModal } from "@/components/shared/AlertModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/button/Button";
import ViewAccount from "./ViewAccount";
import axiosInstance from "@/lib/authorizedAxios";
import FormatDate from "@/components/format/FormatDate";
import IconSearch from "@/components/icons/IconSearch";
import IconClose from "@/components/icons/IconClose";
import toast from "react-hot-toast";
import imgAvatar from "@/components/image/avatarImg.png";
const AccountManagerPage = () => {
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [candidateData, setCandidateData] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(10);

  const filteredCandidates = candidateData.filter((candidate) => {
    const searchTerm = searchInput.toLowerCase();
    return (
      candidate.fullName?.toLowerCase().includes(searchTerm) ||
      candidate.publicEmail?.toLowerCase().includes(searchTerm)
    );
  });

  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentCandidateData = filteredCandidates.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  console.log(currentCandidateData);
  const handleClearInput = () => setSearchInput("");

  const onCloseReview = () => {
    setOpenReview(false);
    setSelectedCandidate(null);
  };

  const handleOpenReview = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenReview(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await axiosInstance.get("/admin/get-all-candidates");
        setCandidateData(result.data.candidates);
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteCandidate = async (id) => {
    try {
      const res = await axiosInstance.delete(`/admin/delete-candidate/${id}`);
      toast.success("Xoá tài khoản thành công");
      // Render lại dữ liệu sau khi xóa thành công
      const result = await axiosInstance.get("/admin/get-all-candidates");
      setCandidateData(result.data.candidates);
      setOpenReview(false);
    } catch (error) {
      toast.error("Xoá công ty thất bại");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen p-5 my-5 mr-5 bg-white rounded-md">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Quản lý Tài khoản</h3>
        <div className="relative flex items-center min-w-[500px] border border-text4 rounded-full p-1 mr-[400px]">
          <IconSearch className="absolute m-2 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-5 py-1 outline-none rounded-lg text-sm"
          />
          {searchInput && (
            <IconClose
              className="cursor-pointer hover:bg-secondary rounded-full w-6 h-6 mr-2"
              onClick={handleClearInput}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-5">
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[5%]">SST</TableHead>
              <TableHead className="text-center w-[25%]">Họ và tên</TableHead>
              <TableHead className="text-center w-[35%]">Email</TableHead>
              <TableHead className="text-center w-[15%]">
                Ngày đăng ký
              </TableHead>
              <TableHead className="text-center w-[20%]">Chức năng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCandidateData.map((candidate, index) => (
              <TableRow className="font-medium" key={index}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center line-clamp-1 overflow-hidden leading-10">
                  <div className="flex items-center gap-2">
                    <img
                      src={candidate.avatarUrl || imgAvatar}
                      alt=""
                      className="overflow-hidden object-cover min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] border rounded-md"
                    />
                    <span>{candidate.fullName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {candidate.publicEmail}
                </TableCell>
                <TableCell className="text-center">
                  {FormatDate.formatDate(candidate.createdAt)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center items-center gap-5">
                    <div
                      className="p-1 bg-[#ead6fd] rounded-md hover:opacity-70 cursor-pointer"
                      onClick={() => handleDeleteCandidate(candidate.userId)}
                    >
                      <IconDelete className="w-6 h-6" color={"#48038C"} />
                    </div>
                    <div className="p-1 bg-[#ead6fd] rounded-md hover:opacity-70 cursor-pointer">
                      <IconEye
                        className="w-6 h-6"
                        color={"#48038C"}
                        onClick={() => handleOpenReview(candidate)}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationDemo
          PerPage={newsPerPage}
          dataBase={filteredCandidates}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        {/* Modal for Sending Email */}
        <div className="flex items-center justify-end w-full">
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            isLoading={isLoading}
          />
          <Modal
            isOpen={openReview}
            onClose={onCloseReview}
            className="bg-white max-w-[600px]"
            title="Thông Tin Cá Nhân"
          >
            <ViewAccount candidateData={selectedCandidate} />
            <div className="flex justify-center gap-5 py-5">
              <Button
                kind="primary"
                className="text-center px-10 disabled:opacity-50"
                type="submit"
                isLoading={isLoading}
                onClick={() => handleDeleteCandidate(selectedCandidate?.userId)}
              >
                Xoá tài khoản
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AccountManagerPage;
