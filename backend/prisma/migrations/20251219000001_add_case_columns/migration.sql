-- Add missing case metadata columns to align with current schema
ALTER TABLE "CaseRecord"
  ADD COLUMN IF NOT EXISTS "doctorSignature" TEXT,
  ADD COLUMN IF NOT EXISTS "date" TEXT,
  ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'Submitted',
  ADD COLUMN IF NOT EXISTS "caseId" TEXT,
  ADD COLUMN IF NOT EXISTS "attachments" JSONB;

-- Backfill caseId for existing rows to satisfy NOT NULL + UNIQUE
UPDATE "CaseRecord"
SET "caseId" = CONCAT('CASE-', FLOOR(EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT, '-', SUBSTRING(MD5(RANDOM()::text) FOR 8))
WHERE "caseId" IS NULL OR "caseId" = '';

-- Enforce NOT NULL and uniqueness on caseId
ALTER TABLE "CaseRecord"
  ALTER COLUMN "caseId" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'CaseRecord_caseId_key'
  ) THEN
    CREATE UNIQUE INDEX "CaseRecord_caseId_key" ON "CaseRecord"("caseId");
  END IF;
END$$;

