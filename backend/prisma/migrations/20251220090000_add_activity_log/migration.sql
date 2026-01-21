CREATE TABLE IF NOT EXISTS "ActivityLog" (
  "id" TEXT PRIMARY KEY,
  "caseId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "description" TEXT,
  "performedBy" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS "ActivityLog_caseId_idx" ON "ActivityLog"("caseId");


