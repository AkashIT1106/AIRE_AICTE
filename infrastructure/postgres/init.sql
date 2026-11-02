-- PostgreSQL Database Initialization Baseline
-- AIRE Platform (PROJECT_PLAN.md Section 12 & 16)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Log completion of initialization script
DO $$
BEGIN
  RAISE NOTICE 'AIRE Database Initialization Complete';
END $$;

