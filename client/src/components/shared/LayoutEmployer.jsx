import React, { Fragment } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FromBeginPageClick from "../scrollToTop/FromBeginPageClick";
import HeadingEmployer from "./header/HeadingEmployer";

import Panel from "../panel/Panel";
import NavbarEmployer from "./navbar/NavbarEmployer";

const LayoutEmployer = () => {
  const location = useLocation();

  // Define panel title and content based on current route
  const panelContent = {
    "/company-profile": {
      title: " Tạo hồ sơ của công ty",
      children: "Điền thông tin đầy đủ của công ty.",
    },
    "/job-management": {
      title: "Việc làm đã đăng tuyển",
      children: "Xem lại các việc làm đã đăng tuyển dụng",
    },
    "/job-post": {
      title: "Tạo tin tuyển dụng",
      children:
        "Điền thông tin vị trí tuyển dụng và các yêu cầu công việc cần thiết.",
    },
    "/job-management/detail": {
      title: "Danh sách ứng viên ứng tuyển",
      children: "Xem danh sách các ứng viên đã ứng tuyển vào bài đăng của bạn.",
    },
    "/candidate-detail": {
      title: "Tạo tin tuyển dụng",
      children:
        "Điền thông tin vị trí tuyển dụng và các yêu cầu công việc cần thiết.",
    },
    "/payment": {
      title: "Ví thanh toán",
      children: "Xem chi tiết và lịch sử nạp tiền của bạn.",
    },
    // Add more paths as needed
  };

  // Set default content if the route is not explicitly defined
  const { title, children } = panelContent[location.pathname] || {
    title: "Employer Portal",
    children: "Manage your activities and settings here.",
  };

  return (
    <Fragment>
      <HeadingEmployer />
      <div className="page-container relative mt-5">
        <Panel
          title={title}
          children={children}
          className={"sticky top-[84px] z-40"}
        />
        <div className="custom-panel"></div>
        <div className="grid grid-cols-12 gap-5">
          <NavbarEmployer />
          <div className="grid col-start-4 col-end-13 w-full gap-5">
            <Outlet />
          </div>
        </div>
      </div>
      <FromBeginPageClick />
    </Fragment>
  );
};

export default LayoutEmployer;
