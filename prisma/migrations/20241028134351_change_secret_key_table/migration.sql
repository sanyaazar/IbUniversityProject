/*
  Warnings:

  - Added the required column `PcName` to the `SecretKey` table without a default value. This is not possible if the table is not empty.
  - The required column `pcId` was added to the `SecretKey` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "SecretKey_WmicUUID_key";

-- AlterTable
ALTER TABLE "SecretKey" ADD COLUMN     "PcName" TEXT NOT NULL,
ADD COLUMN     "pcId" UUID NOT NULL,
ADD CONSTRAINT "SecretKey_pkey" PRIMARY KEY ("pcId");
