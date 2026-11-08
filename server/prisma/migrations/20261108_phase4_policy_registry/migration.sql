-- AIRE Phase 4: Module M04 Regulatory Policy Registry & Rule Engine
-- Specification: docs/04-domain/business-rules/policy-lifecycle-rules.md, docs/04-domain/business-rules/intake-and-quota-rules.md

-- CreateTable policy_packs
CREATE TABLE "policy_packs" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "academic_year" TEXT NOT NULL,
    "edition" TEXT NOT NULL DEFAULT '1.0',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "state_code" TEXT,
    "gazette_reference" TEXT,
    "content_hash" TEXT,
    "author_id" TEXT NOT NULL,
    "effective_from" TIMESTAMP(3),
    "effective_to" TIMESTAMP(3),
    "superseded_by_id" TEXT,
    "parent_pack_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_packs_pkey" PRIMARY KEY ("id")
);

-- CreateTable policy_rules
CREATE TABLE "policy_rules" (
    "id" TEXT NOT NULL,
    "policy_pack_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "clause_reference" TEXT NOT NULL,
    "description" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'VIOLATION',
    "parameters" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable policy_test_fixtures
CREATE TABLE "policy_test_fixtures" (
    "id" TEXT NOT NULL,
    "policy_pack_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "input_data" JSONB NOT NULL,
    "expected_output" JSONB NOT NULL,
    "last_run_status" TEXT,
    "last_run_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_test_fixtures_pkey" PRIMARY KEY ("id")
);

-- CreateTable policy_activation_signoffs
CREATE TABLE "policy_activation_signoffs" (
    "id" TEXT NOT NULL,
    "policy_pack_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "gazette_notification_number" TEXT NOT NULL,
    "step_up_verified_at" TIMESTAMP(3) NOT NULL,
    "fixture_run_evidence_hash" TEXT NOT NULL,
    "signoff_notes" TEXT,
    "activated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "policy_activation_signoffs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "policy_packs_code_key" ON "policy_packs"("code");
CREATE INDEX "policy_packs_academic_year_status_idx" ON "policy_packs"("academic_year", "status");
CREATE INDEX "policy_packs_status_idx" ON "policy_packs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "policy_rules_policy_pack_id_code_key" ON "policy_rules"("policy_pack_id", "code");
CREATE INDEX "policy_rules_policy_pack_id_idx" ON "policy_rules"("policy_pack_id");

-- CreateIndex
CREATE INDEX "policy_test_fixtures_policy_pack_id_idx" ON "policy_test_fixtures"("policy_pack_id");

-- CreateIndex
CREATE INDEX "policy_activation_signoffs_policy_pack_id_idx" ON "policy_activation_signoffs"("policy_pack_id");
CREATE INDEX "policy_activation_signoffs_reviewer_id_idx" ON "policy_activation_signoffs"("reviewer_id");

-- AddForeignKey
ALTER TABLE "policy_packs" ADD CONSTRAINT "policy_packs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "policy_packs" ADD CONSTRAINT "policy_packs_superseded_by_id_fkey" FOREIGN KEY ("superseded_by_id") REFERENCES "policy_packs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "policy_packs" ADD CONSTRAINT "policy_packs_parent_pack_id_fkey" FOREIGN KEY ("parent_pack_id") REFERENCES "policy_packs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_rules" ADD CONSTRAINT "policy_rules_policy_pack_id_fkey" FOREIGN KEY ("policy_pack_id") REFERENCES "policy_packs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_test_fixtures" ADD CONSTRAINT "policy_test_fixtures_policy_pack_id_fkey" FOREIGN KEY ("policy_pack_id") REFERENCES "policy_packs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_activation_signoffs" ADD CONSTRAINT "policy_activation_signoffs_policy_pack_id_fkey" FOREIGN KEY ("policy_pack_id") REFERENCES "policy_packs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "policy_activation_signoffs" ADD CONSTRAINT "policy_activation_signoffs_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Permissions for restricted app user
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'aire_app_user') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "policy_packs" TO aire_app_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "policy_rules" TO aire_app_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "policy_test_fixtures" TO aire_app_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "policy_activation_signoffs" TO aire_app_user;
  END IF;
END $$;
