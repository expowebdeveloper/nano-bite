-- DropIndex
DROP INDEX "ActivityLog_caseId_idx";

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "CaseRecord"("caseId") ON DELETE RESTRICT ON UPDATE CASCADE;
