import React, { useEffect, useState } from "react";
import IconZaloPay from "@/components/icons/IconZaloPay";
import Buttonchild from "@/components/button/Buttonchild";
import PayHistory from "./PayHistory";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/authorizedAxios";
import { useNavigate } from "react-router-dom";
import FormatCurrency from "@/components/format/FormatCurrency";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0); // Sửa từ true thành 0 để phù hợp với kiểu dữ liệu
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const transId = urlParams.get("apptransid");
  // console.log(amount);
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(`/payment/get-payment-info`);
        setData(result.data);
        setIsLoading(true);
      } catch (error) {
        console.error("Error while fetching job data:", error);
      }
    };
    getData();
  }, []);

  const handleCreateTransaction = async (amount) => {
    try {
      const response = await axiosInstance.post("/payment/create-transaction", {
        packageName: "Nạp tiền vào Stacky",
        amount: amount,
      });
      // console.log(response);
      if (response.data?.order_url) {
        window.open(response.data.order_url, "_blank");
      }
    } catch (error) {
      toast.error("Tạo giao dịch thất bại");
    }
  };

  const checkTransaction = async (transId) => {
    try {
      const response = await axiosInstance.post(
        "/payment/check-status-transaction",
        {
          transId: transId,
        }
      );
      setAmount(response.data.amount);
    } catch (error) {
      toast.error("Kiểm tra giao dịch thất bại");
    }
  };
  const updateBalance = async (amount) => {
    try {
      const response = await axiosInstance.patch("/payment/deposit-funds", {
        amount: amount,
      });
      toast.success("Cập nhật số dư thành công");
      // Cập nhật lại dữ liệu sau khi cập nhật số dư thành công
      window.location.reload();
    } catch (error) {
      toast.error("Cập nhật số dư thất bại");
    }
  };

  if (transId) {
    checkTransaction(transId);
    if (amount !== 0) {
      updateBalance(amount);
    }
    navigate("/payment");
  }

  return (
    <div className="mt-5">
      <div className="py-2 rounded-tl-xl rounded-tr-xl text-transparent bg-gradient-to-r from-[#48038C] to-[#e59fff]">
        <h3 className="text-xl ml-5 text-white">Thông tin giao dịch</h3>
      </div>
      <div className="p-5 grid grid-cols-12 gap-5 text-sm bg-secondary mb-10">
        <div className="grid col-start-1 col-end-9 gap-5 h-fit">
          <div className="flex items-center gap-3">
            <span className="font-medium">Tên công ty:</span>
            <span>FPT IS</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium">Số dư hiện tại:</span>
            <span>{FormatCurrency(data.balance || 0)}</span>
          </div>
          {!isLoading ? "" : <PayHistory data={data} />}
        </div>
        <div className="grid col-start-9 col-end-13">
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center justify-center gap-3">
              <IconZaloPay />
              <h3 className="text-[#1F7DF0] font-semibold text-base">
                Nạp thêm tại ZaloPay
              </h3>
            </div>
            <span className="text-primary">Chọn mệnh giá bạn muốn nạp</span>
            <div className="grid grid-cols-2 items-center justify-center gap-5">
              <Buttonchild
                kind="secondary"
                className="px-2 py-1"
                onClick={() => handleCreateTransaction(50000)}
              >
                50,000 VND
              </Buttonchild>
              <Buttonchild
                kind="secondary"
                className="px-2 py-1"
                onClick={() => handleCreateTransaction(100000)}
              >
                100,000 VND
              </Buttonchild>
              <Buttonchild
                kind="secondary"
                className="px-2 py-1"
                onClick={() => handleCreateTransaction(200000)}
              >
                200,000 VND
              </Buttonchild>
              <Buttonchild
                kind="secondary"
                className="px-2 py-1"
                onClick={() => handleCreateTransaction(500000)}
              >
                500,000 VND
              </Buttonchild>
            </div>
            <span className="text-[#1F7DF0] font-semibold text-base">
              Đến Zalopay thanh toán ngay
            </span>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe6SEQ293X0nfFojf6nsCWKA8dNGOrqn21jg&s"
              alt=""
              className="w-32 h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
