import React from "react";
import IconGithub from "@/components/icons/IconGithub";
import IconLinkedIn from "@/components/icons/IconLinkedIn";
import IconLocation from "@/components/icons/IconLocation";
import IconMail from "@/components/icons/IconMail";
import IconPhone from "@/components/icons/IconPhone";
import { useState, useEffect } from "react";
import FormatDate from "@/components/format/FormatDate";
import imgAvatar from "@/components/image/avatarImg.png";
import axiosInstance from "@/lib/authorizedAxios";

const ModalViewCV = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataCandidate, setDataCandidate] = useState([]);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const result = await axiosInstance.get(`/candidate/get-candidate`);

        setDataCandidate(result.data.result);
        setIsLoading(false);
      } catch (error) {
        console.error("Error while fetching job data:", error);
      }
    };
    getData();
  }, []);

  return isLoading ? (
    <div className="flex justify-center items-center h-full">
      <div className="w-10 h-10 border-4 border-t-4 border-primary rounded-full animate-spin"></div>
    </div>
  ) : (
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
            {dataCandidate?.experiences.length > 0 && (
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
            )}
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
            {dataCandidate?.certifications.length > 0 && (
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
            )}
          </div>
        </div>
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

export default ModalViewCV;
