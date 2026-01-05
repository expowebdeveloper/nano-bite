/*
  Warnings:

  - You are about to drop the column `assignedToId` on the `CaseRecord` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CaseRecord" DROP CONSTRAINT "CaseRecord_assignedToId_fkey";

-- AlterTable
ALTER TABLE "CaseRecord" DROP COLUMN "assignedToId",
ADD COLUMN     "assignedToDesignerId" TEXT,
ADD COLUMN     "assignedToQcId" TEXT;

-- AddForeignKey
ALTER TABLE "CaseRecord" ADD CONSTRAINT "CaseRecord_assignedToDesignerId_fkey" FOREIGN KEY ("assignedToDesignerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseRecord" ADD CONSTRAINT "CaseRecord_assignedToQcId_fkey" FOREIGN KEY ("assignedToQcId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
