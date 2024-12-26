import FormatDate from "@/components/format/FormatDate";
import axiosInstance from "@/lib/authorizedAxios";
import React, { useEffect, useState } from "react";

const NotificationPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axiosInstance.get(
          `/notification/get-all-notifications`
        );
        setData(result.data.notifications);
      } catch (error) {
        console.error("Error while fetching job data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  console.log(data);

  return (
    <div className="w-screen h-auto flex justify-center items-center my-10">
      <div className="flex flex-col gap-5 min-w-[700px] max-w-[700px] min-h-[500px] max-h-[500px] rounded-xl bg-secondary p-5 text-sm">
        <h1 className="text-2xl font-medium text-primary">Thông báo</h1>
        <div className="custom-scrollbar overflow-y-auto">
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <div>Loading...</div>
            ) : data ? (
              data.map((item, index) => (
                <div
                  className="flex gap-1 p-2 rounded-md border border-primary cursor-pointer bg-white "
                  key={index}
                >
                  <div className="flex flex-col gap-1 w-[90%]">
                    <h3 className="font-medium text-primary">FPT software</h3>
                    <p className="line-clamp-2 font-medium overflow-hidden text-ellipsis">
                      {item?.jobTitle}
                    </p>
                    <p className="line-clamp-3 overflow-hidden text-ellipsis">
                      {item?.message}
                    </p>
                    <span>{FormatDate.formatDateTime(item?.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-center w-[10%]">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                </div>
              ))
            ) : (
              <div>Không có dữ liệu.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
