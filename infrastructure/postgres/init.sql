-- PostgreSQL Database Initialization Baseline
-- AIRE Platform (PROJECT_PLAN.md Section 12 & 16)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Dedicated application role for runtime queries with NOBYPASSRLS per Section 17.1
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'aire_app_user') THEN
    CREATE ROLE aire_app_user WITH LOGIN PASSWORD 'aire_app_secure_dev_password' NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;
  END IF;
END $$;

-- Log completion of initialization script
DO $$
BEGIN
  RAISE NOTICE 'AIRE Database Initialization Complete';
END $$;

