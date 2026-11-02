-- Baseline Migration for AIRE Phase 1
-- Specification: PROJECT_PLAN.md Section 11.4, 12.2, 12.3

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE IF NOT EXISTS "system_health_checks" (
    "id" TEXT NOT NULL,
    "probe_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "metadata" JSONB,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_health_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "audit_events_baseline" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "service" TEXT NOT NULL,
    "correlation_id" TEXT NOT NULL,
    "actor_id" TEXT,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT,
    "event_type" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "audit_events_baseline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "outbox_events" (
    "id" TEXT NOT NULL,
    "aggregate_type" TEXT NOT NULL,
    "aggregate_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "correlation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "audit_events_baseline_correlation_id_idx" ON "audit_events_baseline"("correlation_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "audit_events_baseline_timestamp_idx" ON "audit_events_baseline"("timestamp");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "outbox_events_status_created_at_idx" ON "outbox_events"("status", "created_at");
