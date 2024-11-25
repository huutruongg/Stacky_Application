import IconGithub from "@/components/icons/IconGithub";
import IconLinkedIn from "@/components/icons/IconLinkedIn";
import IconLocation from "@/components/icons/IconLocation";
import IconMail from "@/components/icons/IconMail";
import IconPhone from "@/components/icons/IconPhone";
import React from "react";
import imgAvatar from "@/components/image/avatarImg.png";
import Button from "@/components/button/Button";
import { useNavigate } from "react-router-dom";
import ModalViewResult from "./ModalViewResult";
import { AlertModal } from "@/components/shared/AlertModal";
import { Modal } from "@/components/ui/modal";

const ViewCandidateDetailPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [openReview, setOpenReview] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const form = {};

  const onCloseReview = () => {
    setOpenReview(false);
  };

  return (
    <>
      <div className="grid grid-cols-12 rounded-xl mt-5 shadow-[0_10px_30px_rgba(91,6,170,0.2)]">
        <div className="grid col-start-1 rounded-tl-xl rounded-bl-xl col-end-5 bg-[#dfc4fd] text-sm">
          <div className="">
            <div className="flex h-fit justify-center w-full my-10">
              <img src={imgAvatar} alt="" className="w-auto max-h-[200px]" />
            </div>
            <div className="flex flex-col gap-3 ml-5">
              <ItemInfo
                icon={<IconPhone className={"w-6 h-6"} color={"#48038C"} />}
                children={"0123456789"}
              />
              <ItemInfo
                icon={<IconMail className={"w-6 h-6"} color={"#48038C"} />}
                children={"nguyenvana@gmail.com"}
              />
              <ItemInfo
                icon={<IconLocation className={"w-6 h-6"} color={"#48038C"} />}
                children={
                  "Đà Nẵng, Việt Nam Đà Nẵng, Việt Nam Đà Nẵng, Việt Nam Đà Nẵng, Việt Nam  "
                }
              />
              <div className="flex gap-3">
                <div className="w-6 h-6">
                  <IconGithub className={"w-6 h-6"} color={"#48038C"} />
                </div>
                <span className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible hover:whitespace-normal hover:max-w-none">
                  <a href="">https://github.com/vana</a>
                </span>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6">
                  <IconLinkedIn className={"w-6 h-6"} color={"#48038C"} />
                </div>
                <span className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible hover:whitespace-normal hover:max-w-none">
                  <a href="">
                    https://github.com/DucMinh-Henry/fe_stacky_app/tree/main/public
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid col-start-5 col-end-13 gap-5 rounded-tr-xl">
          <div className="flex flex-col items-center justify-center p-10 bg-secondary w-full">
            <h1 className="text-2xl font-medium">Tran Duc Minh</h1>
            <span className="text-lg">Lập trình Viên</span>
          </div>
          <div className="flex flex-col p-5 gap-8">
            <div className="">
              <h3 className="border-b mb-5 text-xl font-medium">
                Giới Thiệu Bản Thân
              </h3>
              <p className="text-sm">
                Là lập trình viên có kinh nghiệm trong phát triển phần mềm và
                quản lý dự án, tôi đã tham gia và dẫn dắt nhiều dự án SaaS, với
                kỹ năng chuyên môn về JavaScript, Node.js, TypeScript và
                MongoDB. Tôi luôn chú trọng tối ưu hóa giải pháp và đảm bảo chất
                lượng sản phẩm, đồng thời có khả năng làm việc nhóm tốt và đáp
                ứng tiến độ cao. Tôi mong muốn đóng góp tích cực vào thành công
                của tổ chức và phát triển thêm kỹ năng của bản thân.
              </p>
            </div>
            <div className="">
              <h3 className="border-b mb-5 text-xl font-medium">
                Kinh Nghiệm Làm Việc
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-5">
                    <span className="font-medium">Công Ty TechCorp</span>
                    <span className="font-medium">|</span>
                    <span className="font-medium">01/07/2015 - 30/09/2020</span>
                  </div>
                  <span className="font-medium">Lập trình viên cấp cao</span>
                  <span className="font-medium text-sm">Trách nhiệm</span>
                  <span className="text-sm">
                    Dẫn đầu phát triển các ứng dụng SaaS.
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-5">
                    <span className="font-medium">Công Ty TechCorp</span>
                    <span className="font-medium">|</span>
                    <span className="font-medium">01/07/2015 - 30/09/2020</span>
                  </div>
                  <span className="font-medium">Lập trình viên cấp cao</span>
                  <span className="font-medium text-sm">Trách nhiệm</span>
                  <span className="text-sm">
                    Dẫn đầu phát triển các ứng dụng SaaS.
                  </span>
                </div>
              </div>
            </div>
            <div className="">
              <h3 className="border-b mb-5 text-xl font-medium">Học Vấn</h3>
              <div className="flex flex-col gap-1">
                <div className="flex gap-5">
                  <span className="font-medium">Trường Đại Học Duy Tân</span>
                  <span className="font-medium">|</span>
                  <span className="font-medium">01/07/2015 - 30/09/2020</span>
                </div>
                <span className="font-medium text-sm">
                  Ngành học: Khoa học máy tính{" "}
                </span>
              </div>
            </div>
            <div className="">
              <h3 className="border-b mb-5 text-xl font-medium">Ngôn Ngữ</h3>
              <div className="grid items-center justify-center grid-cols-2 gap-1">
                <div className="flex gap-5 text-sm">
                  <span className="font-medium min-w-20">English</span>
                  <span className="font-medium">|</span>
                  <span className="font-medium">Fluent</span>
                </div>
                <div className="flex gap-5 text-sm">
                  <span className="font-medium min-w-20">Spanish</span>
                  <span className="font-medium">|</span>
                  <span className="font-medium">Intermediate</span>
                </div>
                <div className="flex gap-5 text-sm">
                  <span className="font-medium min-w-20">Spanish</span>
                  <span className="font-medium">|</span>
                  <span className="font-medium">Intermediate</span>
                </div>
                <div className="flex gap-5 text-sm">
                  <span className="font-medium min-w-20">Spanish</span>
                  <span className="font-medium">|</span>
                  <span className="font-medium">Intermediate</span>
                </div>
              </div>
            </div>
            <div className="">
              <h3 className="border-b mb-5 text-xl font-medium">Dự Án</h3>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col p-3 bg-secondary rounded-md text-sm">
                  <div className="flex gap-2">
                    <span className="font-medium">Tên dự án: </span>
                    <span>3 tháng</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium">
                      Thông tin về thời gian dự án:
                    </span>
                    <span>6 tháng</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium">URL kho lưu trữ:</span>
                    <span>https://github.com/johndoe/ecotrade</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Giới thiệu dự án: </span>
                    <span>
                      Một nền tảng mua bán hàng đã qua sử dụng và tái chế. Một
                      nền tảng mua bán hàng đã qua sử dụng và tái chế. Một nền
                      tảng mua bán hàng đã qua sử dụng và tái chế.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <h3 className="border-b mb-5 text-xl font-medium">Chứng chỉ</h3>
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-medium">15/03/2023</span>
                <span className="font-medium">AWS Certified Developer</span>
                <span className="">
                  Kiến trúc và phát triển trên nền tảng AWS.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-5 py-5">
        <Button
          kind="secondary"
          className="text-center px-10 disabled:opacity-20"
          type="button"
          onClick={() => navigate(`/job-management/detail`)}
        >
          Quay lại
        </Button>
        <Button
          kind="primary"
          className="text-center px-10 disabled:opacity-50"
          type="submit"
          onClick={() => setOpenReview(true)}
        >
          Xem kết quả AI phân tích
        </Button>
      </div>
      <div className="flex items-center justify-end w-full">
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          loading={loading}
        />
        <Modal
          isOpen={openReview}
          onClose={onCloseReview}
          className="bg-white max-w-[600px]"
          title="Kết quả phân tích"
          description={"Kết quả phân tích của AI"}
        >
          <ModalViewResult form={form} modalClose={onCloseReview} />
          <div className="flex justify-center gap-5 py-5">
            <Button
              kind="secondary"
              className="text-center px-10 disabled:opacity-50"
              type="button"
              onClick={() => setOpenReview(false)}
            >
              Đóng
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

const ItemInfo = ({ icon, children }) => {
  return (
    <div className="flex  gap-3">
      <div className="w-6 h-6">{icon}</div>
      <span className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible hover:whitespace-normal hover:max-w-none">
        {children}
      </span>
    </div>
  );
};

export default ViewCandidateDetailPage;
