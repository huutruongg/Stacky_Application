import { authProcessor } from './authProcessor';
import { candidateProcessor } from './candidateProcessor';
import { emailProcessor } from './emailProcessor';
import { githubProcessor } from './githubProcessor';
import { jobManagementProcessor } from './jobManagementProcessor';
import { recruiterProcessor } from './recruiterProcessor';
import { uploadProcessor } from './uploadProcessor';

export const processorRegistry = {
  // Job Posts
  '/job-posting/job-postings': jobManagementProcessor,
  '/job-posting/job-posting/:jobPostId': jobManagementProcessor,
  '/job-saved': jobManagementProcessor,
  '/job-applied': jobManagementProcessor,
  '/job-posting/search-job-postings': jobManagementProcessor,
  '/job-posting/filter-by-location': jobManagementProcessor,
  '/job-posting/filter-by-industry': jobManagementProcessor,
  '/job-posting/create-job-posting': jobManagementProcessor,
  '/job-posting/delete-job-posting/:jobPostId': jobManagementProcessor,
  '/job-posting/create-application/:jobPostId': jobManagementProcessor,
  '/job-posting/save-job/:jobPostId': jobManagementProcessor,
  '/job-posting/cancel-job-saved/:jobSavedId': jobManagementProcessor,
  '/job-posting/set-apply-status': jobManagementProcessor,
  '/job-posting/censor-job-post': jobManagementProcessor,

  // Candidate
  '/candidate/get-candidate-details/:candidateId': candidateProcessor,
  '/candidate/submit-profile': candidateProcessor,
  '/candidate/remove-object': candidateProcessor,

  // Recruiter
  '/recruiter/forgot-password': recruiterProcessor,
  '/recruiter/reset-password/:userId': recruiterProcessor,
  '/recruiter/change-password/:userId': recruiterProcessor,
  '/recruiter/get-company-info/:recruiterId': recruiterProcessor,

  // Authentication Routes
  '/auth/login/admin': authProcessor,
  '/auth/signup/recruiter': authProcessor,
  '/auth/login/recruiter': authProcessor,
  '/auth/google/callback': authProcessor,
  '/auth/github/callback': authProcessor,
  '/auth/regenerate-access-token': authProcessor,
  '/auth/get-access-token': authProcessor,
  '/auth/logout': authProcessor,

  // File Uploads
  '/upload/recruiter-images': uploadProcessor,
  '/upload/candidate-image': uploadProcessor,
  '/upload/recruiter-images/delete': uploadProcessor,
  '/upload/candidate-images/delete': uploadProcessor,

  // GitHub Score Calculation
  '/github/calculate-score': githubProcessor,

  // Email
  '/email/send-email': emailProcessor,
};