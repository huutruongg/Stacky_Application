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
      title: "Tạo hồ sơ của công ty",
      children: "Điền thông tin đầy đủ của công ty.",
    },
    "/job-management": {
      title: "Việc làm đã đăng tuyển",
      children: "Xem lại các việc làm đã đăng tuyển dụng",
    },
    "/job-post": {
      title: "Tạo tin tuyển dụng",
      children: "Điền thông tin vị trí tuyển dụng và các yêu cầu công việc cần thiết.",
    },
    "/job-management/detail/:jobId": {
      title: "Danh sách ứng viên ứng tuyển",
      children: "Xem danh sách các ứng viên đã ứng tuyển vào bài đăng của bạn.",
    },
    "/candidate-detail": {
      title: "Thông tin chi tiết ứng viên",
      children: "Xem thông tin chi tiết của ứng viên.",
    },
    "/payment": {
      title: "Ví thanh toán",
      children: "Xem chi tiết và lịch sử nạp tiền của bạn.",
    },
  };

  // Function to match current path with dynamic routes
  const getMatchedRouteContent = () => {
    for (const [route, content] of Object.entries(panelContent)) {
      if (route.includes(":")) {
        const regex = new RegExp(`^${route.replace(":jobId", "[^/]+")}$`);
        if (regex.test(location.pathname)) {
          return content;
        }
      } else if (route === location.pathname) {
        return content;
      }
    }
    return {
      title: "Employer Portal",
      children: "Manage your activities and settings here.",
    };
  };

  // Get the title and children for the current route
  const { title, children } = getMatchedRouteContent();

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
