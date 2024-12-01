-- CreateTable
CREATE TABLE "File" (
    "fileId" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileHash" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("fileId")
);
