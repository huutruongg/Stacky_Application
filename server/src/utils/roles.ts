export enum UserRoles {
    ADMIN = "ADMIN",
    RECRUITER = "RECRUITER",
    CANDIDATE = "CANDIDATE"
}

export const RolePermissions: Record<UserRoles, string[]> = {
    [UserRoles.ADMIN]: [
        "payment:read",
        "job-post:read",
        "job-post:write",
        "job-post:update",
        "job-post:delete",
        "candidate:read",
        "candidate:update",
        "candidate:delete"
    ],

    [UserRoles.RECRUITER]: [
        "payment:read",
        "payment:write",
        "job-post:read",
        "job-post:write",
        "job-post:update",
        "job-post:delete",
        "job-post:owner-read"
    ],

    [UserRoles.CANDIDATE]: [
        "notification:read",
        "notification:delete",
        "job-post:read",
        "candidate:read",
        "candidate:update",
        "candidate:delete",
        "job-post:apply",
    ]
};
