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
import IconSearch from "@/components/icons/IconSearch";
import IconClose from "@/components/icons/IconClose";
import axiosInstance from "@/lib/authorizedAxios";
import FormatDate from "@/components/format/FormatDate";

const PostManagerPage = () => {
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [postData, setPostData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage, setNewsPerPage] = useState(10);

  const filteredPosts = postData.filter(
    (post) =>
      post.jobTitle.toLowerCase().includes(searchInput.toLowerCase()) ||
      post.orgName.toLowerCase().includes(searchInput.toLowerCase()) ||
      post.typeOfIndustry.toLowerCase().includes(searchInput.toLowerCase())
  );

  const indexOfLastItem = currentPage * newsPerPage;
  const indexOfFirstItem = indexOfLastItem - newsPerPage;
  const currentPostData = filteredPosts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleClearInput = () => setSearchInput("");

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await axiosInstance.get("/admin/get-all-jobs");
        setPostData(result.data.jobs);
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-5 my-5 mr-5 bg-white rounded-md">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Quản lý Bài viết</h3>
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
              <TableHead className="text-center w-[20%]">Tiêu đề</TableHead>
              <TableHead className="text-center w-[20%]">
                Công ty đăng tuyển
              </TableHead>
              <TableHead className="text-center w-[20%]">
                Ngành nghề tuyển dụng
              </TableHead>
              <TableHead className="text-center w-[5%]">SL</TableHead>
              <TableHead className="text-center w-[10%]">Ngày đăng</TableHead>
              <TableHead className="text-center w-[10%]">Hạn nộp đơn</TableHead>
              <TableHead className="text-center w-[15%]">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPostData.map((post, index) => (
              <TableRow className="font-medium">
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center line-clamp-1 leading-10">
                  {post.jobTitle}
                </TableCell>
                <TableCell className="text-center">{post.orgName}</TableCell>
                <TableCell className="text-center">
                  {post.typeOfIndustry}
                </TableCell>
                <TableCell className="text-center">
                  {post.candidatesLimit}
                </TableCell>
                <TableCell className="text-center">
                  {FormatDate.formatDate(post.postedAt)}
                </TableCell>
                <TableCell className="text-center">
                  {FormatDate.formatDate(post.applicationDeadline)}
                </TableCell>
                <TableCell className="text-center text-accepted">
                  Đang mở
                </TableCell>
                <TableCell className="text-center">
                  <div className="p-1 bg-[#ead6fd] rounded-md hover:opacity-70 cursor-pointer">
                    <IconDelete className="w-6 h-6" color={"#48038C"} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationDemo
          PerPage={newsPerPage}
          dataBase={filteredPosts}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default PostManagerPage;
