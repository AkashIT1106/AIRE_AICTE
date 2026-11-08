-- CreateTable
CREATE TABLE "submission_batches" (
    "id" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "academic_year" TEXT NOT NULL,
    "programme_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER,
    "file_hash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "total_count" INTEGER NOT NULL DEFAULT 0,
    "valid_count" INTEGER NOT NULL DEFAULT 0,
    "quarantine_count" INTEGER NOT NULL DEFAULT 0,
    "merkle_root_hash" TEXT,
    "sealed_at" TIMESTAMP(3),
    "sealed_by_id" TEXT,
    "submitted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staged_admission_records" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "programme_id" TEXT NOT NULL,
    "academic_year" TEXT NOT NULL,
    "row_number" INTEGER NOT NULL,
    "student_name" TEXT NOT NULL,
    "roll_number" TEXT NOT NULL,
    "date_of_birth" TEXT NOT NULL,
    "gender" TEXT,
    "category" TEXT NOT NULL,
    "quota" TEXT NOT NULL,
    "apaar_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACCEPTED',
    "raw_payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staged_admission_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quarantined_admission_records" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "row_number" INTEGER NOT NULL,
    "raw_payload" JSONB NOT NULL,
    "errors" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUARANTINED',
    "remediated_record_id" TEXT,
    "remediated_at" TIMESTAMP(3),
    "remediated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quarantined_admission_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "submission_batches_institution_id_idx" ON "submission_batches"("institution_id");
CREATE INDEX "submission_batches_institution_id_academic_year_idx" ON "submission_batches"("institution_id", "academic_year");
CREATE INDEX "submission_batches_institution_id_status_idx" ON "submission_batches"("institution_id", "status");

-- CreateIndex
CREATE INDEX "staged_admission_records_institution_id_idx" ON "staged_admission_records"("institution_id");
CREATE INDEX "staged_admission_records_batch_id_idx" ON "staged_admission_records"("batch_id");
CREATE INDEX "staged_admission_records_institution_id_roll_number_idx" ON "staged_admission_records"("institution_id", "roll_number");
CREATE INDEX "staged_admission_records_institution_id_programme_id_idx" ON "staged_admission_records"("institution_id", "programme_id");

-- CreateIndex
CREATE INDEX "quarantined_admission_records_institution_id_idx" ON "quarantined_admission_records"("institution_id");
CREATE INDEX "quarantined_admission_records_batch_id_idx" ON "quarantined_admission_records"("batch_id");
CREATE INDEX "quarantined_admission_records_batch_id_status_idx" ON "quarantined_admission_records"("batch_id", "status");

-- AddForeignKey
ALTER TABLE "submission_batches" ADD CONSTRAINT "submission_batches_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "submission_batches" ADD CONSTRAINT "submission_batches_programme_id_fkey" FOREIGN KEY ("programme_id") REFERENCES "programmes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "submission_batches" ADD CONSTRAINT "submission_batches_submitted_by_id_fkey" FOREIGN KEY ("submitted_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "submission_batches" ADD CONSTRAINT "submission_batches_sealed_by_id_fkey" FOREIGN KEY ("sealed_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staged_admission_records" ADD CONSTRAINT "staged_admission_records_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "submission_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "staged_admission_records" ADD CONSTRAINT "staged_admission_records_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "staged_admission_records" ADD CONSTRAINT "staged_admission_records_programme_id_fkey" FOREIGN KEY ("programme_id") REFERENCES "programmes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quarantined_admission_records" ADD CONSTRAINT "quarantined_admission_records_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "submission_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quarantined_admission_records" ADD CONSTRAINT "quarantined_admission_records_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quarantined_admission_records" ADD CONSTRAINT "quarantined_admission_records_remediated_by_id_fkey" FOREIGN KEY ("remediated_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- PostgreSQL Row-Level Security Configuration
ALTER TABLE "submission_batches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "submission_batches" FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_submission_batches_policy ON "submission_batches"
  FOR ALL
  USING (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  )
  WITH CHECK (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  );

ALTER TABLE "staged_admission_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "staged_admission_records" FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_staged_admission_records_policy ON "staged_admission_records"
  FOR ALL
  USING (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  )
  WITH CHECK (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  );

ALTER TABLE "quarantined_admission_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "quarantined_admission_records" FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_quarantined_admission_records_policy ON "quarantined_admission_records"
  FOR ALL
  USING (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  )
  WITH CHECK (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  );

-- Permissions for restricted app user
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'aire_app_user') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "submission_batches" TO aire_app_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "staged_admission_records" TO aire_app_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "quarantined_admission_records" TO aire_app_user;
  END IF;
END $$;
