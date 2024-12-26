import IconResult from "@/components/icons/IconResult";
import React from "react";
import ErrorBoundary from "@/components/shared/errorBoundary/ErrorBoundary";

const ResultSection = ({ title, children }) => (
  <div className="flex flex-col bg-secondary rounded-xl">
    <h3 className="text-xl font-medium text-center py-2 bg-primary text-white rounded-tl-xl rounded-tr-xl">
      {title}
    </h3>
    <div className="flex flex-col gap-2 p-5">{children}</div>
  </div>
);

const ItemResult = ({ title, content, icon }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span>{title}</span>
    <span>{content}</span>
  </div>
);

const ScoreAnalysis = ({ data }) => {
  const sumScore =
    data?.aiAnalysistScore?.educations +
      data?.aiAnalysistScore?.languages +
      data?.aiAnalysistScore?.professionalSkills +
      data?.aiAnalysistScore?.certifications || 0;

  return (
    <ResultSection title="Kết quả phân tích">
      <ItemResult
        title="Điểm học vấn:"
        content={data?.aiAnalysistScore?.educations || 0}
      />
      <ItemResult
        title="Điểm ngôn ngữ:"
        content={data?.aiAnalysistScore?.languages || 0}
      />
      <ItemResult
        title="Điểm kĩ năng chuyên ngành:"
        content={data?.aiAnalysistScore?.professionalSkills || 0}
      />
      <ItemResult
        title="Điểm chứng chỉ:"
        content={data?.aiAnalysistScore?.certifications || 0}
      />
      <ItemResult title="Tổng điểm:" content={sumScore} />
    </ResultSection>
  );
};

const SocialPlatforms = ({ data }) => (
  <ResultSection title="Nền tảng mạng xã hội">
    <ItemResult
      title="Github:"
      content={data?.githubScore > 0 ? "Đã cập nhật" : "Chưa cập nhật"}
    />
    <ItemResult
      title="Điểm thu thập:"
      content={data?.githubScore || 0}
      icon={<IconResult className="w-4 h-4" />}
    />
    <ItemResult
      title="Linkedin:"
      content={data?.linkedinScore || "Chưa cập nhật"}
    />
    <ItemResult
      title="Điểm thu thập:"
      content={data?.linkedinScore || "Chưa hỗ trợ"}
      icon={<IconResult className="w-4 h-4" />}
    />
  </ResultSection>
);

const ModalViewResult = ({ data }) => {
  console.log(data);
  
  return (
    <div className="flex flex-col gap-10 mx-10 text-sm">
      <ScoreAnalysis data={data} />
      <SocialPlatforms data={data} />
    </div>
  );
};

export default ModalViewResult;
