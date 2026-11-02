# Known Gaps, Risks, and Open Questions

| Metadata             | Value                                                           |
| -------------------- | --------------------------------------------------------------- |
| Document             | `docs/09-delivery/known-gaps-and-risks.md`                      |
| Authoritative For    | Risk Register, Technical Debt, Open Questions                   |
| Status               | `CONFIRMED`                                                     |
| Source               | PROJECT_PLAN.md §43, Phase 1 Audit                              |
| Related Requirements | [`AIRE-REQ-243`](../00-governance/requirements-traceability.md) |

---

## 1. Technical Debt & Prerequisite Repairs (Phase 1 Audit)

1. **Prisma Migrations Baseline:** `server/package.json` had `"prisma:migrate": "prisma db push"`. This must be transitioned to committed migrations (`prisma migrate dev`) with an initial `0_init` baseline.
2. **PostgreSQL Restricted Role:** Local Docker environment currently runs as `aire_user` (superuser). A non-superuser role `aire_app_user` (`NOSUPERUSER`, `NOBYPASSRLS`) must be created in Docker initialization scripts to ensure genuine database-enforced RLS testing.

---

## 2. External Risks & Mitigations

- **APAAR API Latency / Downtime:** Mitigated by asynchronous BullMQ processing, circuit breakers, and automatic 30-day provisional verification windows.
- **State Reservation Policy Divergence:** Mitigated by modular, versioned Policy Packs that allow state-specific quota percentages without modifying core engine arithmetic.

---

## 3. Open Questions Register

- `Q-001`: Will AICTE mandate specific GIGW color themes or allow the modern accessible slate/indigo design foundation? _(Status: Open)_
- `Q-002`: Will external verifier access be hosted on a separate sub-domain or integrated into the main application shell? _(Status: Open — see Decision D-001)_
