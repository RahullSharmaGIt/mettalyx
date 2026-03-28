-- AlterTable
ALTER TABLE "bids" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "unlockRequested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updateCount" INTEGER NOT NULL DEFAULT 0;
