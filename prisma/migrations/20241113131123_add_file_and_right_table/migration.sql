/*
  Warnings:

  - You are about to drop the `CaptchaImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RightType" AS ENUM ('READ', 'READ_COPY', 'READ_WRITE_COPY');

-- DropTable
DROP TABLE "CaptchaImage";

-- CreateTable
CREATE TABLE "FileRight" (
    "FileName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rightId" INTEGER NOT NULL,

    CONSTRAINT "FileRight_pkey" PRIMARY KEY ("FileName","userId","rightId")
);

-- CreateTable
CREATE TABLE "Right" (
    "rightId" SERIAL NOT NULL,
    "right" "RightType" NOT NULL,

    CONSTRAINT "Right_pkey" PRIMARY KEY ("rightId")
);

-- AddForeignKey
ALTER TABLE "FileRight" ADD CONSTRAINT "FileRight_rightId_fkey" FOREIGN KEY ("rightId") REFERENCES "Right"("rightId") ON DELETE RESTRICT ON UPDATE CASCADE;
