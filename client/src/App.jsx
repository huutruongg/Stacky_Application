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
import CompanyListsPage from "./pages/candidate/companyLists/CompanyListsPage";
import TopCompanyListsPage from "./pages/candidate/companyLists/TopCompanyListsPage";
import PaymentPage from "./pages/employer/payment/PaymentPage";
import Profile from "./pages/employer/profile/Profile";
import ForgotPassword from "./pages/signIn/ForgotPassword";
import NotificationPage from "./pages/candidate/notification/NotificationPage";
import ProfilePage from "./pages/candidate/profile/ProfilePage";
import LayoutAdmin from "./components/shared/LayoutAdmin";
import DashboardPage from "./pages/admin/dashboard/dashboardPage";

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
              path="/recruiter/forgot-password/:userId"
              element={<ForgotPassword />}
            />
            <Route path="/company/:companyId" element={<CompanyDetailPage />} />
            <Route element={<RequireAuth allowedRoles={["CANDIDATE"]} />}>
              <Route path="/company" element={<CompanyListsPage />} />
              <Route path="/company-top" element={<TopCompanyListsPage />} />
              <Route path="/job-save" element={<JobSavePage />} />
              <Route path="/profile-cv" element={<CvInformationPage />} />
              <Route path="/uploaded-cv" element={<CvUploadedPage />} />
              <Route path="/notification" element={<NotificationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
          <Route element={<LayoutEmployer />}>
            <Route element={<RequireAuth allowedRoles={["RECRUITER"]} />}>
              <Route path="/payment" element={<PaymentPage />} />
              <Route
                path="/recruiter/reset-password/:userId"
                element={<ResetPasswordPage />}
              />
              <Route path="/recruiter/profile/:userId" element={<Profile />} />
              <Route path="/company-profile" element={<CompanyInfoPage />} />
              <Route path="/job-post" element={<JobPostPage />} />
              <Route path="/job-management" element={<JobPostManagerPage />} />
              <Route
                path="/job-management/detail/:jobId"
                element={<JobPostManagerDetailPage />}
              />
              <Route
                path="/candidate-detail/:jobId/:userId"
                element={<ViewCandidateDetailPage />}
              />
            </Route>
          </Route>
          <Route element={<LayoutAdmin />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
          {/* Wildcard route for 404 */}
        </Routes>
      </Suspense>
    </Fragment>
  );
}

export default App;
