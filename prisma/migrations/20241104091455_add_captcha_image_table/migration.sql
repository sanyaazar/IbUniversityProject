-- CreateTable
CREATE TABLE "CaptchaImage" (
    "id" SERIAL NOT NULL,
    "image" BYTEA NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaptchaImage_pkey" PRIMARY KEY ("id")
);
