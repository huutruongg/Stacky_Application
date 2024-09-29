-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'RECRUITER', 'CANDIDATE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "candidateId" TEXT NOT NULL,
    "programmingSkills" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("candidateId")
);

-- CreateTable
CREATE TABLE "SensitiveInfo" (
    "sensitiveId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recruiterId" TEXT,

    CONSTRAINT "SensitiveInfo_pkey" PRIMARY KEY ("sensitiveId")
);

-- CreateTable
CREATE TABLE "Recruiter" (
    "recruiterId" TEXT NOT NULL,
    "orgName" TEXT,
    "orgField" TEXT,
    "orgScale" TEXT,
    "orgAddress" TEXT,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Recruiter_pkey" PRIMARY KEY ("recruiterId")
);

-- CreateTable
CREATE TABLE "Image" (
    "imageId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recruiterId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("imageId")
);

-- CreateTable
CREATE TABLE "PublicProfile" (
    "publicProfileId" TEXT NOT NULL,
    "fullName" TEXT,
    "phoneNumber" TEXT,
    "gender" BOOLEAN,
    "birthDate" TIMESTAMP(3),
    "address" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "personalDescription" TEXT,
    "jobPosition" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PublicProfile_pkey" PRIMARY KEY ("publicProfileId")
);

-- CreateTable
CREATE TABLE "OauthToken" (
    "OauthTokenId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidateId" TEXT NOT NULL,

    CONSTRAINT "OauthToken_pkey" PRIMARY KEY ("OauthTokenId")
);

-- CreateTable
CREATE TABLE "Language" (
    "languageId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("languageId")
);

-- CreateTable
CREATE TABLE "Project" (
    "projectId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectTime" TEXT NOT NULL,
    "urlRepo" TEXT,
    "projectDescription" TEXT,
    "candidateId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "certificateId" TEXT NOT NULL,
    "certificateName" TEXT NOT NULL,
    "dateOfReceipt" TIMESTAMP(3) NOT NULL,
    "certificateDetail" TEXT,
    "candidateId" TEXT NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("certificateId")
);

-- CreateTable
CREATE TABLE "Education" (
    "educationId" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "finishDate" TIMESTAMP(3) NOT NULL,
    "fieldName" TEXT,
    "candidateId" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("educationId")
);

-- CreateTable
CREATE TABLE "Experience" (
    "experienceId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "jobPosition" TEXT NOT NULL,
    "previousJobDetails" TEXT,
    "candidateId" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("experienceId")
);

-- CreateTable
CREATE TABLE "JobPost" (
    "jobId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobImage" TEXT,
    "typeOfWork" TEXT,
    "location" TEXT,
    "jobSalary" TEXT,
    "candidatesLimit" INTEGER,
    "educationRequired" TEXT,
    "yearsOfExperience" TEXT,
    "typeOfIndustry" TEXT,
    "professionalSkills" TEXT,
    "certificateRequired" TEXT,
    "languagesRequired" TEXT,
    "jobBenefit" TEXT,
    "leavePolicy" TEXT,
    "jobDescription" TEXT,
    "workEnvironment" TEXT,
    "jobSchedule" TEXT,
    "applicationDeadline" TIMESTAMP(3) NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recruiterId" TEXT NOT NULL,

    CONSTRAINT "JobPost_pkey" PRIMARY KEY ("jobId")
);

-- CreateTable
CREATE TABLE "JobSaved" (
    "candidateId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobSaved_pkey" PRIMARY KEY ("candidateId","jobId")
);

-- CreateTable
CREATE TABLE "Application" (
    "candidateId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "githubScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("candidateId","jobId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "payAmount" DOUBLE PRECISION NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recruiterId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyRevenue" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyRevenue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_userId_key" ON "Candidate"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SensitiveInfo_userId_key" ON "SensitiveInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SensitiveInfo_recruiterId_key" ON "SensitiveInfo"("recruiterId");

-- CreateIndex
CREATE UNIQUE INDEX "Recruiter_userId_key" ON "Recruiter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicProfile_userId_key" ON "PublicProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OauthToken_candidateId_provider_key" ON "OauthToken"("candidateId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyRevenue_year_month_key" ON "MonthlyRevenue"("year", "month");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensitiveInfo" ADD CONSTRAINT "SensitiveInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensitiveInfo" ADD CONSTRAINT "SensitiveInfo_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("recruiterId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recruiter" ADD CONSTRAINT "Recruiter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("recruiterId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicProfile" ADD CONSTRAINT "PublicProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OauthToken" ADD CONSTRAINT "OauthToken_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("candidateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("candidateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("candidateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("candidateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("candidateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("candidateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("recruiterId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSaved" ADD CONSTRAINT "JobSaved_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("candidateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSaved" ADD CONSTRAINT "JobSaved_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobPost"("jobId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("candidateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobPost"("jobId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("recruiterId") ON DELETE RESTRICT ON UPDATE CASCADE;
