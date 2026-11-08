-- AIRE Phase 3: Modules M02 & M03 Registry
-- Specification: docs/04-domain/domain-model.md, developer_a.md

-- AlterTable
ALTER TABLE "institutions" ADD COLUMN "address" TEXT,
ADD COLUMN "aicte_id" TEXT,
ADD COLUMN "district" TEXT,
ADD COLUMN "legal_name" TEXT,
ADD COLUMN "pincode" TEXT,
ADD COLUMN "state" TEXT;

-- CreateTable
CREATE TABLE "campuses" (
    "id" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "state" TEXT,
    "district" TEXT,
    "pincode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programmes" (
    "id" TEXT NOT NULL,
    "canonical_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degree_level" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "duration_years" INTEGER NOT NULL DEFAULT 4,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programme_aliases" (
    "id" TEXT NOT NULL,
    "programme_id" TEXT NOT NULL,
    "raw_title" TEXT NOT NULL,
    "normalised_title" TEXT NOT NULL,
    "institution_id" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programme_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_orders" (
    "id" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "academic_year" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "order_type" TEXT NOT NULL DEFAULT 'EOA',
    "issue_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "superseded_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approval_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seat_entitlements" (
    "id" TEXT NOT NULL,
    "approval_order_id" TEXT NOT NULL,
    "programme_id" TEXT NOT NULL,
    "campus_id" TEXT,
    "sanctioned_intake" INTEGER NOT NULL,
    "open_seats" INTEGER NOT NULL DEFAULT 0,
    "sc_seats" INTEGER NOT NULL DEFAULT 0,
    "st_seats" INTEGER NOT NULL DEFAULT 0,
    "obc_seats" INTEGER NOT NULL DEFAULT 0,
    "ews_seats" INTEGER NOT NULL DEFAULT 0,
    "tfw_seats" INTEGER NOT NULL DEFAULT 0,
    "supernumerary_seats" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seat_entitlements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "institutions_aicte_id_key" ON "institutions"("aicte_id");

-- CreateIndex
CREATE INDEX "campuses_institution_id_idx" ON "campuses"("institution_id");

-- CreateIndex
CREATE UNIQUE INDEX "campuses_institution_id_code_key" ON "campuses"("institution_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "programmes_canonical_code_key" ON "programmes"("canonical_code");

-- CreateIndex
CREATE INDEX "programmes_degree_level_idx" ON "programmes"("degree_level");

-- CreateIndex
CREATE INDEX "programmes_discipline_idx" ON "programmes"("discipline");

-- CreateIndex
CREATE INDEX "programme_aliases_normalised_title_idx" ON "programme_aliases"("normalised_title");

-- CreateIndex
CREATE INDEX "programme_aliases_programme_id_idx" ON "programme_aliases"("programme_id");

-- CreateIndex
CREATE UNIQUE INDEX "programme_aliases_normalised_title_institution_id_key" ON "programme_aliases"("normalised_title", "institution_id");

-- CreateIndex
CREATE UNIQUE INDEX "approval_orders_order_number_key" ON "approval_orders"("order_number");

-- CreateIndex
CREATE INDEX "approval_orders_institution_id_academic_year_idx" ON "approval_orders"("institution_id", "academic_year");

-- CreateIndex
CREATE INDEX "approval_orders_status_idx" ON "approval_orders"("status");

-- CreateIndex
CREATE INDEX "seat_entitlements_approval_order_id_idx" ON "seat_entitlements"("approval_order_id");

-- CreateIndex
CREATE INDEX "seat_entitlements_programme_id_idx" ON "seat_entitlements"("programme_id");

-- CreateIndex
CREATE UNIQUE INDEX "seat_entitlements_approval_order_id_programme_id_campus_id_key" ON "seat_entitlements"("approval_order_id", "programme_id", "campus_id");

-- AddForeignKey
ALTER TABLE "campuses" ADD CONSTRAINT "campuses_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programme_aliases" ADD CONSTRAINT "programme_aliases_programme_id_fkey" FOREIGN KEY ("programme_id") REFERENCES "programmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programme_aliases" ADD CONSTRAINT "programme_aliases_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_orders" ADD CONSTRAINT "approval_orders_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_orders" ADD CONSTRAINT "approval_orders_superseded_by_id_fkey" FOREIGN KEY ("superseded_by_id") REFERENCES "approval_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat_entitlements" ADD CONSTRAINT "seat_entitlements_approval_order_id_fkey" FOREIGN KEY ("approval_order_id") REFERENCES "approval_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat_entitlements" ADD CONSTRAINT "seat_entitlements_programme_id_fkey" FOREIGN KEY ("programme_id") REFERENCES "programmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat_entitlements" ADD CONSTRAINT "seat_entitlements_campus_id_fkey" FOREIGN KEY ("campus_id") REFERENCES "campuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- -----------------------------------------------------------------------------
-- Dedicated Runtime Application Role Grants (Section 17.1)
-- -----------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "campuses" TO aire_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "programmes" TO aire_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "programme_aliases" TO aire_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "approval_orders" TO aire_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "seat_entitlements" TO aire_app_user;

-- -----------------------------------------------------------------------------
-- PostgreSQL Row-Level Security Configuration (Section 17.2)
-- -----------------------------------------------------------------------------
ALTER TABLE "campuses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "campuses" FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_campuses_policy ON "campuses"
  FOR ALL
  USING (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  )
  WITH CHECK (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  );

ALTER TABLE "approval_orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "approval_orders" FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_approval_orders_policy ON "approval_orders"
  FOR ALL
  USING (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  )
  WITH CHECK (
    institution_id = NULLIF(current_setting('app.current_tenant_id', true), '')
  );

ALTER TABLE "seat_entitlements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "seat_entitlements" FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_seat_entitlements_policy ON "seat_entitlements"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "approval_orders"
      WHERE "approval_orders"."id" = "seat_entitlements"."approval_order_id"
        AND "approval_orders"."institution_id" = NULLIF(current_setting('app.current_tenant_id', true), '')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "approval_orders"
      WHERE "approval_orders"."id" = "seat_entitlements"."approval_order_id"
        AND "approval_orders"."institution_id" = NULLIF(current_setting('app.current_tenant_id', true), '')
    )
  );
