/*
  Warnings:

  - You are about to drop the column `recruiterId` on the `Image` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_recruiterId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "recruiterId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
