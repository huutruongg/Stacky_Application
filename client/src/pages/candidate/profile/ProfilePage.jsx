import React, { useEffect, useState } from "react";
import imgCompany from "@/components/image/imgCompany.png";
import IconCamera from "@/components/icons/IconCamera";
import IconExclamationMark from "@/components/icons/IconExclamationMark";
import Buttonchild from "@/components/button/Buttonchild";
import IconTick from "@/components/icons/IconTick";
import TitleField from "@/components/titleField/TitleField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import InputField from "@/components/fieldForm/InputField";
import axiosInstance from "@/lib/authorizedAxios";

const ProfilePage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(""),
    defaultValues: {
      fullName: "",
      publicEmail: "",
      phoneNumber: "",
    },
  });
  const commonInputProps = {
    className: "flex items-center",
    classNameLabel:
      "flex items-center justify-between min-w-44 max-w-44 pr-3 leading-5 ant-form-item-required",
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(`/candidate/get-profile`);
        console.log(result.data.result);
        setData(result.data.result);
        form.reset({
          fullName: result.data.result.fullName,
          publicEmail: result.data.result.publicEmail,
          phoneNumber: result.data.result.phoneNumber,
        });
        setIsLoading(true);
      } catch (error) {
        console.error("Error while fetching job data:", error);
      }
    };
    getData();
  }, [form]);

  return (
    <div className="page-container grid grid-cols-12 gap-5 my-10">
      <div className="col-span-4 flex flex-col items-center justify-center bg-secondary rounded-xl gap-5">
        <div className="p-5 w-full flex flex-col items-center gap-2">
          <div className="relative w-28 h-28 rounded-full">
            <img
              src={imgCompany}
              alt=""
              className="overflow-hidden object-cover min-w-[112px] min-h-[112px] max-w-[112px] max-h-[112px] rounded-full"
            />
            <div className="absolute bottom-[3px] right-[2px] bg-primary rounded-full p-[5px]">
              <IconCamera className="w-5 h-5" color="#fff" />
            </div>
          </div>
          <span className="text-2xl text-primary font-semibold">
            Nguyễn Văn A
          </span>
        </div>
        <div className="p-5 w-full flex flex-col items-center gap-5 border-y">
          {/* <div className="flex flex-col items-center gap-2">
            <div className="flex items-center w-full gap-3">
              <div className="flex items-center w-[50px] h-6 justify-start bg-[#c0c0c1] border rounded-full px-[3px]">
                <div className="w-[16px] h-[16px] bg-white rounded-full"></div>
              </div>
              <span className="text-text3 font-medium">Đang tắt tìm việc</span>
            </div>
            <p className="text-text3 text-justify">
              Bật tìm việc giúp hồ sơ của bạn nổi bật hơn và được chú ý nhiều
              hơn trong danh sách tìm kiếm của NTD.
            </p>
          </div> */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center w-full gap-3">
              <div className="flex items-center w-[50px] h-6 justify-start bg-primary border rounded-full px-[3px]">
                <div className="w-[16px] h-[16px] bg-white rounded-full"></div>
              </div>
              <span className="text-primary font-medium">
                Trạng thái tìm việc đang bật
              </span>
            </div>
            <p className="text-text2 text-justify">
              Trạng thái <span className="text-primary ">bật tìm việc</span> sẽ
              tự động tắt sau{" "}
              <span className="text-primary font-medium">14 ngày</span>. Nếu bạn
              vẫn còn nhu cầu tìm việc, thì{" "}
              <span className="text-primary">hãy bật tìm việc trở lại</span>.
            </p>
            <Buttonchild kind="primary" className="px-5 py-1">
              Chọn CV
            </Buttonchild>
          </div>
          {/* <div className="flex flex-col items-center gap-2">
            <div className="flex items-center w-full gap-3">
              <div className="flex items-center w-[50px] h-6 justify-start bg-[#c0c0c1] border rounded-full px-[3px]">
                <div className="w-[16px] h-[16px] bg-white rounded-full"></div>
              </div>
              <span className="text-text3 font-medium">
                Chưa cho phép NTD tìm kiếm hồ sơ
              </span>
            </div>
            <p className="text-text3 text-justify">
              Khi bạn cho phép, các NTD uy tín có thể chủ động kết nối và gửi
              đến bạn những cơ hội việc làm hấp dẫn nhất, giúp nhân đôi hiệu quả
              tìm việc.
            </p>
          </div> */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center w-full gap-3">
              <div className="flex items-center w-[50px] h-6 justify-start bg-primary border rounded-full px-[3px]">
                <div className="w-[16px] h-[16px] bg-white rounded-full"></div>
              </div>
              <span className="text-primary font-medium">
                Cho phép NTD tìm kiếm hồ sơ
              </span>
            </div>
            <p className="text-text2 text-justify">
              Khi có cơ hội việc làm phù hợp, NTD sẽ liên hệ và trao đổi với bạn
              qua:
            </p>
            <div className="flex items-center gap-2">
              <IconTick className="w-5 h-5" color="#48038C" />
              <span className="text-text2">Email và số điện thoại</span>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center gap-5 pb-5">
          <div className="px-5 w-full flex items-center gap-2">
            <IconExclamationMark className="w-6 h-6" color="#6F767E" />
            <span className="text-text2">Cập nhập CV của bạn</span>
          </div>
          <Buttonchild kind="secondary" className="px-5 py-1">
            Cập nhập CV
          </Buttonchild>
        </div>
      </div>
      <div className="col-span-8 bg-secondary p-5 rounded-xl">
        <TitleField children={"Cài đặt thông tin cá nhân"} />
        <Form {...form}>
          <form className="space-y-5 mt-5 px-5 w-full">
            <InputField
              control={form.control}
              name="fullName"
              placeholder="họ và tên"
              labelName="Họ và tên"
              id="fullName"
              {...commonInputProps}
            />
            <InputField
              control={form.control}
              name="publicEmail"
              placeholder="email"
              labelName="Email"
              id="publicEmail"
              {...commonInputProps}
            />
            <InputField
              control={form.control}
              name="phoneNumber"
              placeholder="số điện thoại"
              labelName="Số điện thoại"
              id="phoneNumber"
              type="number"
              {...commonInputProps}
            />
            <div className="flex w-full justify-center">
              <Buttonchild type="submit" kind="primary" className="px-5 py-1">
                Lưu
              </Buttonchild>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;
