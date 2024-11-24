import IconResult from "@/components/icons/IconResult";
import React from "react";

const ModalViewResult = () => {
  return (
    <div className="flex flex-col gap-10 mx-10 text-sm">
      <div className="flex flex-col bg-secondary rounded-xl">
        <h3 className="text-xl font-medium text-center py-2 bg-primary text-white rounded-tl-xl rounded-tr-xl">
          Kết quả phân tích
        </h3>
        <div className="flex flex-col gap-2 p-5">
          <ItemResult title="Điểm học vấn:" content="5" />
          <ItemResult title="Điểm ngôn ngữ:" content="5" />
          <ItemResult title="Điểm kĩ năng chuyên ngành:" content="5" />
          <ItemResult title="Điểm chứng chỉ:" content="5" />
          <ItemResult title="Tổng điểm:" content="20" />
        </div>
      </div>
      <div className="flex flex-col bg-secondary rounded-xl">
        <h3 className="text-xl font-medium text-center py-2 bg-primary text-white rounded-tl-xl rounded-tr-xl">
          Nền tảng mạng xã hội
        </h3>
        <div className="flex flex-col gap-2 p-5">
          <ItemResult title="Github:" content="htpp://github.com/huutruongg" />
          <ItemResult
            title="Điểm thu thập:"
            content="34"
            icon={<IconResult className="w-4 h-4" />}
          />
          <ItemResult
            title="Linkedin:"
            content="htpp://linkedin.com/truongconghuu"
          />
          <ItemResult
            title="Điểm thu thập:"
            content="chưa hỗ trợ"
            icon={<IconResult className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  );
};

const ItemResult = ({ title, content, icon }) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{title}</span>
      <span>{content}</span>
    </div>
  );
};

export default ModalViewResult;
