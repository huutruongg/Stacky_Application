-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Candidate" (
    "candidate_id" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CANDIDATE',
    "full_name" TEXT,
    "applied_position" TEXT,
    "phone_number" TEXT,
    "gender" BOOLEAN,
    "birth_date" TIMESTAMP(3),
    "address" TEXT,
    "linkedin_url" TEXT,
    "github_url" TEXT,
    "personal_description" TEXT,
    "programming_skills" TEXT,
    "github_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("candidate_id")
);

-- CreateTable
CREATE TABLE "C_Language" (
    "cl_id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,

    CONSTRAINT "C_Language_pkey" PRIMARY KEY ("cl_id")
);

-- CreateTable
CREATE TABLE "C_Project" (
    "cp_id" SERIAL NOT NULL,
    "project_name" TEXT NOT NULL,
    "project_time" TEXT NOT NULL,
    "url_repo" TEXT NOT NULL,
    "project_description" TEXT,
    "candidate_id" TEXT NOT NULL,

    CONSTRAINT "C_Project_pkey" PRIMARY KEY ("cp_id")
);

-- CreateTable
CREATE TABLE "C_Certificate" (
    "cc_id" SERIAL NOT NULL,
    "certificate_name" TEXT NOT NULL,
    "date_of_receipt" TIMESTAMP(3) NOT NULL,
    "certificate_detail" TEXT,
    "candidate_id" TEXT NOT NULL,

    CONSTRAINT "C_Certificate_pkey" PRIMARY KEY ("cc_id")
);

-- CreateTable
CREATE TABLE "C_Education" (
    "ce_id" SERIAL NOT NULL,
    "school_name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "finish_date" TIMESTAMP(3) NOT NULL,
    "field_name" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,

    CONSTRAINT "C_Education_pkey" PRIMARY KEY ("ce_id")
);

-- CreateTable
CREATE TABLE "C_Experience" (
    "cexp_id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "job_position" TEXT NOT NULL,
    "previous_job_details" TEXT,
    "candidate_id" TEXT NOT NULL,

    CONSTRAINT "C_Experience_pkey" PRIMARY KEY ("cexp_id")
);

-- CreateTable
CREATE TABLE "Oauth_Token" (
    "token_id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidate_id" TEXT NOT NULL,

    CONSTRAINT "Oauth_Token_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "Recruiter" (
    "recruiter_id" TEXT NOT NULL,
    "org_email" TEXT NOT NULL,
    "org_mobile" TEXT,
    "org_password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'RECRUITER',
    "org_tax_number" TEXT,
    "org_name" TEXT,
    "org_field" TEXT,
    "org_scale" TEXT,
    "org_address" TEXT,
    "org_image" TEXT,

    CONSTRAINT "Recruiter_pkey" PRIMARY KEY ("recruiter_id")
);

-- CreateTable
CREATE TABLE "Job_Post" (
    "job_id" TEXT NOT NULL,
    "recruiter_id" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "job_image" TEXT,
    "type_of_work" TEXT,
    "location" TEXT,
    "job_salary" TEXT,
    "candidates_limit" INTEGER,
    "education_required" TEXT,
    "years_of_experience" TEXT,
    "type_of_industry" TEXT,
    "professional_skills" TEXT,
    "certificate_required" TEXT,
    "languages_required" TEXT,
    "job_benefit" TEXT,
    "leave_policy" TEXT,
    "job_description" TEXT,
    "work_enviroment" TEXT,
    "job_schedule" TEXT,
    "application_deadline" TIMESTAMP(3),
    "posted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_Post_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "Application" (
    "candidate_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Application_pkey" PRIMARY KEY ("candidate_id","job_id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "payment_id" TEXT NOT NULL,
    "recruiter_id" TEXT NOT NULL,
    "pay_amount" DOUBLE PRECISION NOT NULL,
    "transaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "Revenue_Report" (
    "report_id" TEXT NOT NULL,
    "total_revenue" DOUBLE PRECISION NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Revenue_Report_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "Job_Saved" (
    "candidate_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "saved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_Saved_pkey" PRIMARY KEY ("candidate_id","job_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Oauth_Token_candidate_id_provider_key" ON "Oauth_Token"("candidate_id", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "Recruiter_org_email_key" ON "Recruiter"("org_email");

-- AddForeignKey
ALTER TABLE "C_Language" ADD CONSTRAINT "C_Language_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("candidate_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "C_Project" ADD CONSTRAINT "C_Project_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("candidate_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "C_Certificate" ADD CONSTRAINT "C_Certificate_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("candidate_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "C_Education" ADD CONSTRAINT "C_Education_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("candidate_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "C_Experience" ADD CONSTRAINT "C_Experience_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("candidate_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Oauth_Token" ADD CONSTRAINT "Oauth_Token_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("candidate_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Post" ADD CONSTRAINT "Job_Post_recruiter_id_fkey" FOREIGN KEY ("recruiter_id") REFERENCES "Recruiter"("recruiter_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("candidate_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job_Post"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_recruiter_id_fkey" FOREIGN KEY ("recruiter_id") REFERENCES "Recruiter"("recruiter_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Saved" ADD CONSTRAINT "Job_Saved_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("candidate_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Saved" ADD CONSTRAINT "Job_Saved_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job_Post"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;
