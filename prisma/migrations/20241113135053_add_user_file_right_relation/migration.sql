/*
  Warnings:

  - The primary key for the `FileRight` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `userId` on the `FileRight` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "FileRight" DROP CONSTRAINT "FileRight_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "FileRight_pkey" PRIMARY KEY ("FileName", "userId", "rightId");

-- AddForeignKey
ALTER TABLE "FileRight" ADD CONSTRAINT "FileRight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
