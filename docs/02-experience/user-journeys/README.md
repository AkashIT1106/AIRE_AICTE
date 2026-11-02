# User Journey Index

| Metadata               | Value                                                                             |
| ---------------------- | --------------------------------------------------------------------------------- |
| Document               | `docs/02-experience/user-journeys/README.md`                                      |
| Authoritative Source   | [`docs/04-frontend/journey-inventory.md`](../../04-frontend/journey-inventory.md) |
| Status                 | `AUDIT RECORD`                                                                    |
| Total Journeys Tracked | 8 Core Journeys                                                                   |

---

## 1. Journey Overview

The Stage 0 UI/UX audit identified eight essential end-to-end user journeys required by `PROJECT_PLAN.md`:

| Journey ID | Journey Title                            | Primary Persona              | Implementation Status |
| ---------- | ---------------------------------------- | ---------------------------- | --------------------- |
| **J-01**   | Authenticate & Access Workspace          | Institution Operator / Admin | `MISSING`             |
| **J-02**   | Upload & Normalise Admission Batch       | Institution Operator         | `MISSING`             |
| **J-03**   | Resolve Ingestion Warnings & Seal Cohort | Institution Operator / Admin | `MISSING`             |
| **J-04**   | AICTE Scrutiny & Policy Reconciliation   | AICTE Reviewer               | `MISSING`             |
| **J-05**   | Issue Show Cause & Review Evidence       | AICTE Reviewer / Inst Admin  | `MISSING`             |
| **J-06**   | Student Verification & AEP Retrieval     | Student                      | `MISSING`             |
| **J-07**   | External Cryptographic AEP Verification  | External Verifier            | `MISSING`             |
| **J-08**   | Auditor Inspection & Regulatory Replay   | Auditor                      | `MISSING`             |

> [!NOTE]
> All eight journeys are currently classified as `MISSING` at the Phase 1 codebase baseline. For complete step-by-step audit steps and failure modes, inspect [`docs/04-frontend/journey-inventory.md`](../../04-frontend/journey-inventory.md).
