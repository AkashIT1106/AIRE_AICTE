# Cross-Cutting Test Suites

Per PROJECT_PLAN.md Section 37:

- `integration/`: Multi-service API and database integration tests
- `e2e/`: Full user journeys (Playwright)
- `security/`: RLS boundary tests, privilege escalation checks, tenant isolation
- `privacy/`: Purpose specification, data minimization, vault protection
- `performance/`: Throughput and reconciliation latency benchmarks
