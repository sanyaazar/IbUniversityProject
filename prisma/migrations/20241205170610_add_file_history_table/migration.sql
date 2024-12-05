-- CreateTable
CREATE TABLE "FileHistory" (
    "fileId" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "updatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "FileHistory_pkey" PRIMARY KEY ("fileId","updatedDate")
);
