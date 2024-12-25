export enum UserRoles {
    ADMIN = "ADMIN",
    RECRUITER = "RECRUITER",
    CANDIDATE = "CANDIDATE"
}

export const RolePermissions: Record<UserRoles, string[]> = {
    [UserRoles.ADMIN]: [
        'getAllJobs',
        'getAllCandidates',
        'getAllCompanies',
        'getDetailCompany',
        'countJobsByMonth',
        'getTotalCards',
        'getTop5PostedJobs',
        'getRevenueReport',
        'deleteJob',
        'deleteCandidate',
        'deleteCompany',
        'searchJobs',
        'searchCandidates',
        'searchCompanies',
        'deleteCandidate',
        'syncJsonToMongoDB'
    ],
    [UserRoles.RECRUITER]: [
        'getAppliedJobs',
        'getSavedJobs',
        'createJobPost',
        'deleteJobPost',
        'getJobPostsByRecruiter',
        'setApplyStatus',
        'deleteApplication',
        'createNotification',
        'deposit',
        'payForJobPost',
        'getPaymentInfo',
        'resetPassword',
        'updateComapanyInfo',
        'updateComapanyAccount',
        'updateCandidatesStatus',
        'getApplicants'
    ],
    [UserRoles.CANDIDATE]: [
        'getAppliedJobs',
        'getSavedJobs',
        'getCandidate',
        'updateCandidate',
        'getCandidateProfile',
        'updateCandidateProfile',
        'getGithubScore',
        'isLoggedInGithub',
        'getJobsByCandidate',
        'getJobDetailByCandidate',
        'saveJobPost',
        'unSaveJobPost',
        'createApplication',
        'getAllNotifications',
        'getUnreadCount',
        'markAllAsRead'
    ]
};
