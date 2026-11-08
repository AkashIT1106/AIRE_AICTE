-- CreateTable
CREATE TABLE "admission_records" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "programme_id" TEXT NOT NULL,
    "academic_year" TEXT NOT NULL,
    "student_token" TEXT NOT NULL,
    "apaar_status" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "apaar_verified_at" TIMESTAMP(3),
    "category" TEXT NOT NULL,
    "quota" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admission_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_events" (
    "id" TEXT NOT NULL,
    "admission_record_id" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "sequence_number" INTEGER NOT NULL,
    "previous_hash" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "actor_id" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_vault_records" (
    "id" TEXT NOT NULL,
    "student_token" TEXT NOT NULL,
    "encrypted_payload" TEXT NOT NULL,
    "encrypted_dek" TEXT NOT NULL,
    "apaar_hash" TEXT,
    "key_version" TEXT NOT NULL DEFAULT 'v1',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_vault_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admission_records_student_token_key" ON "admission_records"("student_token");
CREATE INDEX "admission_records_tenant_id_idx" ON "admission_records"("tenant_id");
CREATE INDEX "admission_records_tenant_id_academic_year_idx" ON "admission_records"("tenant_id", "academic_year");
CREATE INDEX "admission_records_tenant_id_programme_id_idx" ON "admission_records"("tenant_id", "programme_id");
CREATE INDEX "admission_records_batch_id_idx" ON "admission_records"("batch_id");
CREATE INDEX "admission_records_student_token_idx" ON "admission_records"("student_token");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_events_admission_record_id_sequence_number_key" ON "ledger_events"("admission_record_id", "sequence_number");
CREATE INDEX "ledger_events_admission_record_id_idx" ON "ledger_events"("admission_record_id");
CREATE INDEX "ledger_events_institution_id_idx" ON "ledger_events"("institution_id");
CREATE INDEX "ledger_events_timestamp_idx" ON "ledger_events"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "identity_vault_records_student_token_key" ON "identity_vault_records"("student_token");
CREATE INDEX "identity_vault_records_student_token_idx" ON "identity_vault_records"("student_token");
CREATE INDEX "identity_vault_records_apaar_hash_idx" ON "identity_vault_records"("apaar_hash");

-- AddForeignKey
ALTER TABLE "admission_records" ADD CONSTRAINT "admission_records_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "admission_records" ADD CONSTRAINT "admission_records_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "submission_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "admission_records" ADD CONSTRAINT "admission_records_programme_id_fkey" FOREIGN KEY ("programme_id") REFERENCES "programmes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_events" ADD CONSTRAINT "ledger_events_admission_record_id_fkey" FOREIGN KEY ("admission_record_id") REFERENCES "admission_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ledger_events" ADD CONSTRAINT "ledger_events_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ledger_events" ADD CONSTRAINT "ledger_events_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- PostgreSQL Row-Level Security Configuration
ALTER TABLE "admission_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admission_records" FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_admission_records_policy ON "admission_records"
  FOR ALL
  USING (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  )
  WITH CHECK (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  );

ALTER TABLE "ledger_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ledger_events" FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_ledger_events_policy ON "ledger_events"
  FOR ALL
  USING (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  )
  WITH CHECK (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  );

-- Identity vault table security
ALTER TABLE "identity_vault_records" ENABLE ROW LEVEL SECURITY;

CREATE POLICY identity_vault_records_policy ON "identity_vault_records"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Permissions for restricted app user
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'aire_app_user') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "admission_records" TO aire_app_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "ledger_events" TO aire_app_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "identity_vault_records" TO aire_app_user;
  END IF;
END $$;
