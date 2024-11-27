import IconGithub from "@/components/icons/IconGithub";
import IconLinkedIn from "@/components/icons/IconLinkedIn";
import IconLocation from "@/components/icons/IconLocation";
import IconMail from "@/components/icons/IconMail";
import IconPhone from "@/components/icons/IconPhone";
import React, { useEffect, useState } from "react";
import imgAvatar from "@/components/image/avatarImg.png";
import Button from "@/components/button/Button";
import { useNavigate, useParams } from "react-router-dom";
import ModalViewResult from "./ModalViewResult";
import { AlertModal } from "@/components/shared/AlertModal";
import { Modal } from "@/components/ui/modal";
import axiosInstance from "@/lib/authorizedAxios";
import FormatDate from "@/components/format/FormatDate";

const ViewCandidateDetailPage = () => {
  const navigate = useNavigate();
  const { jobId, userId } = useParams();
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataCandidate, setDataCandidate] = useState({
    projects: [],
    educations: [],
    experiences: [],
    languages: [],
    certifications: [],
  });
  const form = {};

  // console.log(dataCandidate);

  const onCloseReview = () => {
    setOpenReview(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const result = await axiosInstance.get(
          `/recruiter/get-potential-candidate/${jobId}/${userId}`
        );
        setDataCandidate(result.data.result);
      } catch (error) {
        console.error("Error while fetching job data:", error);
      } finally {
        setIsLoading(false);
      } 
    };
    getData();
  }, [jobId, userId]);

  return (
    <>
      <div className="grid grid-cols-12 rounded-xl mt-5 shadow-[0_10px_30px_rgba(91,6,170,0.2)]">
        <div className="grid col-start-1 rounded-tl-xl rounded-bl-xl col-end-5 bg-[#dfc4fd] text-sm">
          <div className="">
            <div className="flex h-fit justify-center w-full my-10">
              <img
                src={dataCandidate.avatarUrl || imgAvatar}
                alt="Avatar"
                className="object-contain w-auto min-h-[270px] min-w-[230px] max-h-[270px] max-w-[230px] border rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-3 ml-5">
              <ItemInfo
                icon={<IconPhone className="w-6 h-6" color="#48038C" />}
                children={dataCandidate.phoneNumber}
              />
              <ItemInfo
                icon={<IconMail className="w-6 h-6" color="#48038C" />}
                children={dataCandidate.publicEmail}
              />
              <ItemInfo
                icon={<IconLocation className="w-6 h-6" color="#48038C" />}
                children={dataCandidate.address}
              />
              <div className="flex gap-3">
                <div className="w-6 h-6">
                  <IconGithub className="w-6 h-6" color="#48038C" />
                </div>
                <span className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible hover:whitespace-normal hover:max-w-none">
                  <a
                    href={dataCandidate.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dataCandidate.githubUrl}
                  </a>
                </span>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6">
                  <IconLinkedIn className="w-6 h-6" color="#48038C" />
                </div>
                <span className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible hover:whitespace-normal hover:max-w-none">
                  <a
                    href={dataCandidate.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dataCandidate.linkedinUrl}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid col-start-5 col-end-13 gap-5 rounded-tr-xl">
          <div className="flex flex-col items-center justify-center p-10 bg-secondary w-full">
            <h1 className="text-2xl font-medium">{dataCandidate?.fullName}</h1>
            <span className="text-lg text-justify">
              {dataCandidate?.jobPosition}
            </span>
          </div>
          <div className="flex flex-col p-5 gap-8">
            <div className="">
              <h3 className="border-b mb-5 text-xl font-medium">
                Giới Thiệu Bản Thân
              </h3>
              <p className="text-sm text-justify">
                {dataCandidate?.personalDescription}
              </p>
            </div>
            <div className="">
              <h3 className="border-b mb-5 text-xl font-medium">
                Kinh Nghiệm Làm Việc
              </h3>
              <div className="flex flex-col gap-4">
                {dataCandidate?.experiences?.map((experience) => (
                  <div className="flex flex-col gap-1" key={experience._id}>
                    <div className="flex gap-5">
                      <span className="font-medium">
                        {experience.companyName}
                      </span>
                      <span className="font-medium">|</span>
                      <span className="font-medium">
                        {FormatDate.formatDate(experience.startDate)} -{" "}
                        {FormatDate.formatDate(experience.endDate)}
                      </span>
                    </div>
                    <span className="font-medium">
                      {experience.jobPosition}
                    </span>
                    <span className="text-sm font-medium">
                      {experience.previousJobDetails}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="">
              <h3 className="border-b mb-5 text-xl font-medium">Kĩ Năng</h3>
              <span className="text-sm text-justify">
                {dataCandidate?.professionalSkills}
              </span>
            </div>
            <div className="">
              <h3 className="border-b mb-5 text-xl font-medium">Học Vấn</h3>
              <div className="flex flex-col gap-4">
                {dataCandidate?.educations?.map((education) => (
                  <div className="flex flex-col gap-1" key={education._id}>
                    <div className="flex gap-5">
                      <span className="font-medium">
                        {education.schoolName}
                      </span>
                      <span className="font-medium">|</span>
                      <span className="font-medium">
                        {FormatDate.formatDate(education.startDate)} -{" "}
                        {FormatDate.formatDate(education.finishDate)}
                      </span>
                    </div>
                    <span className="font-medium text-sm">
                      Ngành học: {education.fieldName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="">
              <h3 className="border-b mb-5 text-xl font-medium">Ngôn Ngữ</h3>
              <div className="grid items-center justify-center grid-cols-2 gap-1">
                {dataCandidate?.languages?.map((language, index) => (
                  <div className="flex gap-5 text-sm" key={index}>
                    <span className="font-medium min-w-20">
                      {language.language}
                    </span>
                    <span className="font-medium">|</span>
                    <span className="font-medium">{language.level}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="">
              <h3 className="border-b mb-5 text-xl font-medium">Dự Án</h3>
              <div className="flex flex-col gap-5">
                {dataCandidate?.projects?.map((project) => (
                  <div
                    className="flex flex-col p-3 bg-secondary rounded-md text-sm"
                    key={project._id}
                  >
                    <div className="flex gap-2">
                      <span className="font-medium">Tên dự án: </span>
                      <span>{project.projectName}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">Thời gian dự án: </span>
                      <span>{FormatDate.formatDate(project.projectTime)}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">URL kho lưu trữ: </span>
                      <a
                        href={project.urlRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        {project.urlRepo}
                      </a>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Giới thiệu dự án: </span>
                      <span>{project.projectDescription}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="">
              <h3 className="border-b mb-5 text-xl font-medium">Chứng chỉ</h3>
              {dataCandidate?.certifications?.map((certificate, index) => (
                <div className="flex flex-col gap-1 text-sm" key={index}>
                  <span className="font-medium">
                    {FormatDate.formatDate(certificate.dateOfReceipt)}
                  </span>
                  <span className="font-medium">
                    {certificate.certificateName}
                  </span>
                  <span>{certificate.certificateDetail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-5 py-5">
        <Button
          kind="secondary"
          className="text-center px-10 disabled:opacity-20"
          type="button"
          onClick={() => navigate(`/job-management/detail/${jobId}`)}
        >
          Quay lại
        </Button>
        <Button
          kind="primary"
          className="text-center px-10 disabled:opacity-50"
          type="button"
          onClick={() => setOpenReview(true)}
        >
          Xem kết quả AI phân tích
        </Button>
      </div>
      <div className="flex items-center justify-end w-full">
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          isLoading={isLoading}
        />
        <Modal
          isOpen={openReview}
          onClose={onCloseReview}
          className="bg-white max-w-[600px]"
          title="Kết quả phân tích"
          description="Kết quả phân tích của AI"
        >
          <ModalViewResult
            form={form}
            modalClose={onCloseReview}
            data={dataCandidate}
          />
          <div className="flex justify-center gap-5 py-5">
            <Button
              kind="secondary"
              className="text-center px-10 disabled:opacity-50"
              type="button"
              onClick={onCloseReview}
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
    <div className="flex gap-3">
      <div className="w-6 h-6">{icon}</div>
      <span className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible hover:whitespace-normal hover:max-w-none">
        {children}
      </span>
    </div>
  );
};

export default ViewCandidateDetailPage;
