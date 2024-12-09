import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FormatDate from "@/components/format/FormatDate";
import FormatCurrency from "@/components/format/FormatCurrency";

const PayHistory = ({ data }) => {
  const [payHistory, setPayHistory] = useState(false);

  return (
    <div>
      <div>
        <button
          className={`px-4 py-2 rounded-tl-lg ${
            !payHistory ? "bg-primary text-white" : "bg-text4"
          }`}
          onClick={() => {
            setPayHistory(!payHistory);
          }}
        >
          Lịch sử nộp tiền
        </button>
        <button
          className={`px-4 py-2 rounded-tr-lg ${
            payHistory ? "bg-primary text-white" : "bg-text4"
          }`}
          onClick={() => {
            setPayHistory(!payHistory);
          }}
        >
          Lịch sử thanh toán
        </button>
      </div>
      <div className="text-xs bg-white rounded-b-lg rounded-tr-lg border border-primary p-px h-[300px] overflow-y-auto custom-scrollbar">
        {!payHistory ? (
          <Table>
            <TableHeader className="sticky top-0 z-50 bg-white shadow-sm">
              <TableRow>
                <TableHead className="text-center">STT</TableHead>
                <TableHead className="text-center">Ngày giao dịch</TableHead>
                <TableHead className="text-center">Số tiền</TableHead>
                <TableHead className="text-center">Loại giao dịch</TableHead>
                <TableHead className="text-center">Nội dung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.historyDeposit.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">
                    {FormatDate.formatDateTime(item.transactionDate)}
                  </TableCell>
                  <TableCell className="text-center">
                    {FormatCurrency(item.payAmount)}
                  </TableCell>
                  <TableCell className="text-center">Nạp tiền</TableCell>
                  <TableCell className="text-center">Nạp tiền Stacky</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead className="text-center">STT</TableHead>
                <TableHead className="text-center">Ngày giao dịch</TableHead>
                <TableHead className="text-center">Số tiền</TableHead>
                <TableHead className="text-center">Loại giao dịch</TableHead>
                <TableHead className="text-center">Nội dung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.historyPayments.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">
                    {FormatDate.formatDateTime(item.transactionDate)}
                  </TableCell>
                  <TableCell className="text-center">
                    {FormatCurrency(item.payAmount)}
                  </TableCell>
                  <TableCell className="text-center">Thanh toán</TableCell>
                  <TableCell className="text-center">
                    Thanh toán Stacky
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default PayHistory;
