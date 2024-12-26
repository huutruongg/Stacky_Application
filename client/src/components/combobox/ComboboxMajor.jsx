import React from "react";
import { Combobox } from "../ui/combobox";

const majors = [
  { value: "", label: "Tất cả các ngành nghề" },
  { value: "IT", label: "Công nghệ thông tin" },
  { value: "Kỹ sư phần mềm", label: "Kỹ sư phần mềm" },
  { value: "Chuyên gia dữ liệu", label: "Chuyên gia dữ liệu" },
  { value: "Trí tuệ nhân tạo (AI)", label: "Trí tuệ nhân tạo (AI)" },
  { value: "An ninh mạng", label: "An ninh mạng" },
  { value: "Phát triển web", label: "Phát triển web" },
  {
    value: "Phát triển ứng dụng di động",
    label: "Phát triển ứng dụng di động",
  },
  { value: "Thiết kế đồ họa", label: "Thiết kế đồ họa" },
  {
    value: "Tiếp thị kỹ thuật số",
    label: "Tiếp thị kỹ thuật số (Digital Marketing)",
  },
  {
    value: "Chuyên viên SEO",
    label: "Chuyên viên SEO (Tối ưu hóa công cụ tìm kiếm)",
  },
  { value: "Quản trị hệ thống mạng", label: "Quản trị hệ thống mạng" },
  {
    value: "Chuyên viên thương mại điện tử",
    label: "Chuyên viên thương mại điện tử",
  },
  { value: "Phân tích kinh doanh", label: "Phân tích kinh doanh" },
  { value: "Chuyên viên tài chính", label: "Chuyên viên tài chính" },
  { value: "Chuyên viên kế toán", label: "Chuyên viên kế toán" },
  { value: "Chuyên viên tư vấn thuế", label: "Chuyên viên tư vấn thuế" },
  { value: "Nhân viên ngân hàng", label: "Nhân viên ngân hàng" },
  { value: "Bác sĩ", label: "Bác sĩ" },
  { value: "Y tá", label: "Y tá" },
  { value: "Dược sĩ", label: "Dược sĩ" },
  { value: "Giáo viên", label: "Giáo viên" },
  { value: "Chuyên viên nhân sự", label: "Chuyên viên nhân sự" },
  { value: "Kiến trúc sư", label: "Kiến trúc sư" },
  { value: "Kỹ sư xây dựng", label: "Kỹ sư xây dựng" },
  { value: "Kỹ sư điện", label: "Kỹ sư điện" },
  { value: "Kỹ sư cơ khí", label: "Kỹ sư cơ khí" },
  { value: "Chuyên viên quản lý dự án", label: "Chuyên viên quản lý dự án" },
  { value: "Nhà báo", label: "Nhà báo" },
  { value: "Biên tập viên", label: "Biên tập viên" },
  { value: "Chuyên viên logistics", label: "Chuyên viên logistics" },
];

const ComboboxMajor = ({ valueMajor, onSelectMajor }) => {
  return (
    <Combobox
      items={majors}
      buttonPlaceholder="Tất cả ngành nghề"
      onSelect={onSelectMajor} // Pass the selected value to the parent via callback
      buttonClassName="w-[200px] bg-white"
      popoverClassName="bg-white shadow-lg"
      listHeight="h-[300px]"
      listWidth="w-[200px]"
      value={valueMajor} // Controlled value for the selected Major
    />
  );
};

export default ComboboxMajor;
