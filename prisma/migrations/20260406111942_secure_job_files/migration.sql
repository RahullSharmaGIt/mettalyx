/*
  Warnings:

  - You are about to drop the column `name` on the `job_files` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `job_files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileKey]` on the table `job_files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileKey` to the `job_files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `job_files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedBy` to the `job_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_files" DROP COLUMN "name",
DROP COLUMN "url",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fileKey" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "uploadedBy" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "job_files_fileKey_key" ON "job_files"("fileKey");

-- CreateIndex
CREATE INDEX "job_files_uploadedBy_idx" ON "job_files"("uploadedBy");
