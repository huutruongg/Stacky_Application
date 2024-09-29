-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "JobPost" ADD COLUMN     "postStatus" "PostStatus" NOT NULL DEFAULT 'PENDING';
