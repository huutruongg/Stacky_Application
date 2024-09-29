/*
  Warnings:

  - You are about to drop the column `recruiterId` on the `SensitiveInfo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SensitiveInfo" DROP CONSTRAINT "SensitiveInfo_recruiterId_fkey";

-- DropIndex
DROP INDEX "SensitiveInfo_recruiterId_key";

-- AlterTable
ALTER TABLE "SensitiveInfo" DROP COLUMN "recruiterId";
