import TitleField from "@/components/titleField/TitleField";
import React from "react";

const JobContact = ({}) => {
  return (
    <div className="bg-secondary rounded-xl p-5">
      <TitleField children={"Thông tin liên hệ"}></TitleField>
      <div className="px-5">
        <div className="mt-5">
          <Item title={"Tên liên hệ:"} Children={"Phòng Nhân Sự"}></Item>
          <Item title={"Số điện thoại:"} Children={"0918.159509"}></Item>
          <Item
            title={"Địa chỉ:"}
            Children={`Số D34, tổ 16, KP 5, Phường Tân Hiệp , Thành phố Biên Hòa , Đồng
            Nai , Viet Nam Số D34, tổ 16, KP 5, Phường Tân Hiệp , Thành phố Biên
            Hòa , Đồng Nai , Viet Nam`}
          ></Item>
        </div>
        <div className="mt-5">
          <span>
            Các ứng viên quan tâm vui lòng gửi hồ sơ trực tuyến, gửi kèm file
            bấm "NỘP ĐƠN" trên STACKY hoặc trực tiếp đến tại công ty
          </span>
        </div>
      </div>
    </div>
  );
};

const Item = ({ title, Children, className }) => {
  return (
    <div className="flex items-center">
      <span className="min-w-28">{title}</span>
      <span className="line-clamp-1 overflow-hidden text-ellipsis">
        {Children}
      </span>
    </div>
  );
};

export default JobContact;
