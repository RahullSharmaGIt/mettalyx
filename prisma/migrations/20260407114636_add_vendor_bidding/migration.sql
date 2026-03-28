-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('PENDING', 'REJECTED', 'WON');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "minPriceFloor" DOUBLE PRECISION,
ADD COLUMN     "targetVendorPrice" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "bids" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "proposedPrice" DOUBLE PRECISION NOT NULL,
    "proposedLeadTime" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "BidStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bids_jobId_idx" ON "bids"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "bids_vendorId_jobId_key" ON "bids"("vendorId", "jobId");

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
