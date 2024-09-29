/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `PublicProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PublicProfile" DROP COLUMN "phoneNumber";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT;
