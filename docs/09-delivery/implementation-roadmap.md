# Implementation Roadmap (Phases 0 – 12)

| Metadata          | Value                                            |
| ----------------- | ------------------------------------------------ |
| Document          | `docs/09-delivery/implementation-roadmap.md`     |
| Authoritative For | 13-Phase Roadmap, Phase Sequencing, Dependencies |
| Status            | `CONFIRMED`                                      |
| Source            | PROJECT_PLAN.md §40                              |

---

## 1. Roadmap Overview

```
Phase 0: Research & Requirements Validation (Complete)
   |
Phase 1: Engineering Foundation & Monorepo Setup (Complete)
   |
Phase 2: Identity, Access & Security Foundation (Active / In Planning)
   |
Phase 3: Institution, Programme & Approval Registry
   |
Phase 4: Regulatory Policy Registry & Rule Engine
   |
Phase 5: Institution Submission & Ingestion Pipeline
   |
Phase 6: Identity Gateway & Admission Ledger
   |
Phase 7: Entitlement & Reconciliation Engines
   |
Phase 8: Exception Review Workbench
   |
Phase 9: Verifiable Student Records & AEP Generation
   |
Phase 10: Dashboards, Analytics & Reporting
   |
Phase 11: Security & Privacy Hardening (Adversarial Audit)
   |
Phase 12: Demonstration, Evaluation & Delivery
```

---

## 2. Phase Detail & Dependencies

- **Phase 1 (Complete):** Established monorepo, Docker services, Prisma client, BullMQ worker, React placeholder.
- **Phase 2 (Active):** Repair migration baseline (`0_init`), initialize restricted `aire_app_user` role, implement Better Auth authentication, centralized authorization middleware, and PostgreSQL Forced RLS.
- **Phases 3–12:** Follow approved sequence in accordance with `PROJECT_PLAN.md` §40.
