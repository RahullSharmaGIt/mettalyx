-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OEM', 'VENDOR');

-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING_REVIEW', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'QC', 'COMPLETED', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "companyName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'OEM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "VendorStatus" NOT NULL DEFAULT 'PENDING',
    "machines" JSONB NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "verifiedAt" TIMESTAMP(3),
    "isOnboarded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "vendor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "material" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "tolerance" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "oemId" TEXT NOT NULL,
    "vendorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_files" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "job_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_status_logs" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL,
    "note" TEXT,
    "changedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_status_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_userId_key" ON "vendor_profiles"("userId");

-- CreateIndex
CREATE INDEX "jobs_oemId_idx" ON "jobs"("oemId");

-- CreateIndex
CREATE INDEX "jobs_vendorId_idx" ON "jobs"("vendorId");

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");

-- CreateIndex
CREATE INDEX "job_files_jobId_idx" ON "job_files"("jobId");

-- CreateIndex
CREATE INDEX "job_status_logs_jobId_idx" ON "job_status_logs"("jobId");

-- AddForeignKey
ALTER TABLE "vendor_profiles" ADD CONSTRAINT "vendor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_oemId_fkey" FOREIGN KEY ("oemId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_files" ADD CONSTRAINT "job_files_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_status_logs" ADD CONSTRAINT "job_status_logs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
