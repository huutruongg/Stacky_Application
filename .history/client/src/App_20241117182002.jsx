import React, { Fragment, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import Main from "./components/shared/Main";
import SignInPage from "./pages/signIn/SignInPage";
import RequireAuth from "./components/auth/RequireAuth";
import JobSavePage from "./pages/candidate/jobSave/JobSavePage";
import CvInformationPage from "./pages/candidate/cvInformation/CvInformationPage";
import CvUploadedPage from "./pages/candidate/cvUploaded/CvUploadedPage";
import LayoutEmployer from "./components/shared/LayoutEmployer";
import ResetPasswordPage from "./pages/employer/resetPassword/ResetPasswordPage";
import JobPostPage from "./pages/employer/jobPost/JobPostPage";
import JobPostManagerPage from "./pages/employer/jobPostManager/JobPostManagerPage";
import useAuth from "./hooks/useAuth";
import NotFoundPage from "./pages/errorPage/NotFoundPage";
import HomePage from "./pages/home/HomePage";
import JobDetailPage from "./pages/jobDetail/JobDetailPage";
import SearchJobPage from "./pages/searchJob/SearchJobPage";
import CompanyInfoPage from "./pages/employer/companyInfo/CompanyInfoPage";
import JobPostManagerDetailPage from "./pages/employer/jobPostManagerDetail/JobPostManagerDetailPage";
import ViewCandidateDetailPage from "./pages/employer/viewCandidateDetail/ViewCandidateDetailPage";
import CompanyDetailPage from "./pages/candidate/companyDetail/CompanyDetailPage";
import BarChart from "./components/dashboard/barchart";
import LineChart from "./components/dashboard/linechart";
import Sidebar from "./components/dashboard/sideBar";
import StatCard from "./components/dashboard/statCard";
import TopCompanies from "./components/dashboard/topCompanies";

function App() {
  return (
    <Fragment>
      <ScrollToTop />
      <Suspense fallback={<></>}>
        <Routes>
          <Route element={<Main />}>
            <Route path="/account.stacky.vn" element={<SignInPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/search-job" element={<SearchJobPage />} />
            <Route path="/job-detail/:jobId" element={<JobDetailPage />} />
            <Route
              path="/recruiter/reset-password/:userId"
              element={<ResetPasswordPage />}
            />
            <Route element={<RequireAuth allowedRoles={["CANDIDATE"]} />}>
              <Route path="/company-detail" element={<CompanyDetailPage />} />
              <Route path="/job-save" element={<JobSavePage />} />
              <Route path="/profile-cv" element={<CvInformationPage />} />
              <Route path="/uploaded-cv" element={<CvUploadedPage />} />
            </Route>
          </Route>
          <Route element={<LayoutEmployer />}>
            <Route element={<RequireAuth allowedRoles={["RECRUITER"]} />}>
              <Route path="/company-profile" element={<CompanyInfoPage />} />
              <Route path="/job-post" element={<JobPostPage />} />
              <Route path="/job-management" element={<JobPostManagerPage />} />
              <Route
                path="/job-management/detail"
                element={<JobPostManagerDetailPage />}
              />
              <Route
                path="/candidate-detail"
                element={<ViewCandidateDetailPage />}
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
          {/* Wildcard route for 404 */}
        </Routes>
      </Suspense>
    </Fragment>
  );
}

export default App;
