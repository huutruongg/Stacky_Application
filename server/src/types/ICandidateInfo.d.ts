import { Candidate, Certificate, Education, Experience, Language, OauthToken, Project, PublicProfile, User } from '@prisma/client';
export interface CandidateInfo {
    user: User,
    candidate: Candidate,
    publicProfile?: PublicProfile,
    oauthToken?: OauthToken,
    project?: Project,
    language?: Language,
    certificate?: Certificate,
    education?: Education,
    experience?: Experience
}