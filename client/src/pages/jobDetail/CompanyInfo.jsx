import React, { useEffect, useState } from "react";
import imgCompany from "@/components/image/imgCompany.png";
import IconUSerAcount from "@/components/icons/IconUSerAcount";
import IconField from "@/components/icons/IconField";
import IconLocation from "@/components/icons/IconLocation";
import IconSeeCompany from "@/components/icons/IconSeeCompany";
import axiosInstance from "@/lib/authorizedAxios";

const CompanyInfo = ({ data }) => {
  const [dataCompany, setDataCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const result = await axiosInstance.get(
        `/recruiter/get-company-info/${data.userId}`
      );
      setDataCompany(result.data.result);
    };
    getData();
  }, [data.userId]);

  console.log(dataCompany);

  return (
    <div className="bg-secondary rounded-xl p-5 text-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="border rounded-lg">
          <a href="">
            <img
              src={dataCompany?.orgImage || imgCompany}
              alt=""
              className="overflow-hidden object-cover min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] rounded-lg"
            />
          </a>
        </div>
        <a
          href=""
          title={dataCompany?.orgName}
          className="self-stretch text-text1 line-clamp-3 font-medium text-[16px] uppercase leading-6 tracking-[-0.16px] h-[70px] w-full overflow-hidden text-ellipsis hover:decoration-primary hover:text-primary hover:underline"
        >
          {dataCompany?.orgName}
        </a>
      </div>
      <div className="flex flex-col gap-4">
        <ItemInfo
          icon={<IconUSerAcount color={"#7F878F"}></IconUSerAcount>}
          title={"Quy Mô:"}
          children={dataCompany?.orgScale}
        ></ItemInfo>
        <ItemInfo
          icon={<IconField></IconField>}
          title={"Lĩnh vực:"}
          children={dataCompany?.orgField}
        ></ItemInfo>
        <ItemInfo
          icon={<IconLocation color={"#7F878F"}></IconLocation>}
          title={"Địa điểm:"}
          children={dataCompany?.orgAddress}
        ></ItemInfo>
      </div>
      <div className="flex items-center justify-center gap-3 mt-5">
        <a
          href={`/company/${data?.userId}`}
          className="text-primary font-semibold tracking-[0.175px] leading-[22px] hover:decoration-primary hover:underline"
        >
          Xem trang công ty
        </a>
        <IconSeeCompany></IconSeeCompany>
      </div>
    </div>
  );
};

const ItemInfo = ({ icon, className, title, children }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-white p-3 rounded-full">{icon}</div>
      <div className="flex items-start">
        <div className="self-stretch flex items-center text-[#7f878f] font-normal tracking-[0.14px] leading-[22px] w-[88px]">
          {title}
        </div>
        <div
          className={`line-clamp-1 text-text1 font-medium tracking-[0.14px] leading-[22px] w-[calc(100%-50px)] ${className}`}
          title={children}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
