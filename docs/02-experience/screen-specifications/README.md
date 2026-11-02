# Screen Specifications Index

| Metadata             | Value                                                                                                                                                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/02-experience/screen-specifications/README.md`                                                                                                                                                                                                                               |
| Authoritative For    | Master Screen Catalog, Component Contracts, State Envelopes, Journey Traceability                                                                                                                                                                                                  |
| Status               | `CONFIRMED`                                                                                                                                                                                                                                                                        |
| Source               | PROJECT_PLAN.md §10.1, §32; [`docs/04-frontend/screen-inventory.md`](../../04-frontend/screen-inventory.md)                                                                                                                                                                        |
| Related Requirements | [`AIRE-REQ-078`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-083`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-048`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-055`](../../00-governance/requirements-traceability.md) |
| Last Updated         | 2 November 2026                                                                                                                                                                                                                                                                    |

---

## 1. Screen Architecture & Lifecycle

All AIRE user interfaces are structured into five cohesive functional groupings, guaranteeing strict role-based separation, clear state transitions, and accessible keyboard operability under WCAG 2.2 Level AA.

### Implementation Status Key

- **`IMPLEMENTED`**: Verifiable client code and automated tests exist in the codebase.
- **`PLACEHOLDER`**: Temporary scaffold or placeholder tile in client (e.g. `App.tsx` Phase 1 baseline).
- **`CONFIRMED (PLANNED)`**: Authoritative specification approved; awaiting scheduled implementation phase.
- **`PROPOSED`**: Additional optimization screen awaiting technical review.

---

## 2. Master Screen Inventory

| Screen ID | Screen Title                                | Primary Route                  | Authorized Roles                | Status                  | Related Journeys | Specification File                                                   |
| --------- | ------------------------------------------- | ------------------------------ | ------------------------------- | ----------------------- | ---------------- | -------------------------------------------------------------------- |
| **S-00**  | Application Shell & Layout Wrapper          | Global wrapper                 | All Roles                       | `CONFIRMED (PLANNED)`   | All              | [`S-00-application-shell.md`](./S-00-application-shell.md)           |
| **S-01**  | Local Authentication / Login                | `/login`                       | Public / Unauth                 | `CONFIRMED (PLANNED)`   | J-01             | [`S-01-login.md`](./S-01-login.md)                                   |
| **S-02**  | Security Step-Up Re-Authentication          | Modal prompt                   | Privileged Roles                | `CONFIRMED (PLANNED)`   | J-01, J-03, J-05 | [`S-02-reauthentication.md`](./S-02-reauthentication.md)             |
| **S-03**  | Session Expiry & Heartbeat Modal            | Modal / Redirect               | All Roles                       | `CONFIRMED (PLANNED)`   | J-01             | [`S-03-session-expiry.md`](./S-03-session-expiry.md)                 |
| **S-04**  | Multi-Tenant Organization Switcher          | Shell Header                   | Multi-Tenant Roles              | `CONFIRMED (PLANNED)`   | J-01             | [`S-04-context-switcher.md`](./S-04-context-switcher.md)             |
| **S-05**  | Foundation Status Screen                    | `/`                            | All (Temporary)                 | `IMPLEMENTED` (Phase 1) | None             | [`client/src/App.tsx`](../../../client/src/App.tsx)                  |
| **S-10**  | Institution Operations Dashboard            | `/institution/dashboard`       | `INST_ADMIN`, `INST_OPERATOR`   | `CONFIRMED (PLANNED)`   | J-01, J-02       | [`S-10-institution-dashboard.md`](./S-10-institution-dashboard.md)   |
| **S-11**  | Admission Batch Upload & Mapping            | `/institution/submissions/new` | `INST_OPERATOR`                 | `CONFIRMED (PLANNED)`   | J-02             | [`S-11-upload-batch.md`](./S-11-upload-batch.md)                     |
| **S-12**  | Ingestion Status & Quarantine Triage        | `/institution/submissions/:id` | `INST_OPERATOR`, `INST_ADMIN`   | `CONFIRMED (PLANNED)`   | J-02             | [`S-12-ingestion-progress.md`](./S-12-ingestion-progress.md)         |
| **S-13**  | Submission History & Sealed Hashes          | `/institution/submissions`     | `INST_ADMIN`, `INST_OPERATOR`   | `CONFIRMED (PLANNED)`   | J-03             | [`S-13-submission-history.md`](./S-13-submission-history.md)         |
| **S-14**  | Cohort Ledger & Quota Roster                | `/institution/ledger`          | `INST_ADMIN`, `INST_OPERATOR`   | `CONFIRMED (PLANNED)`   | J-03             | [`S-14-cohort-ledger.md`](./S-14-cohort-ledger.md)                   |
| **S-15**  | Institution Exceptions & Show Cause Notices | `/institution/exceptions`      | `INST_ADMIN`                    | `CONFIRMED (PLANNED)`   | J-05             | [`S-15-exceptions-notices.md`](./S-15-exceptions-notices.md)         |
| **S-16**  | Evidence Upload & Affidavit Drawer          | Drawer in S-15                 | `INST_ADMIN`                    | `CONFIRMED (PLANNED)`   | J-05             | [`S-16-evidence-upload-drawer.md`](./S-16-evidence-upload-drawer.md) |
| **S-20**  | AICTE National Compliance Overview          | `/aicte/overview`              | `AICTE_ADMIN`, `AICTE_REVIEWER` | `CONFIRMED (PLANNED)`   | J-04             | [`S-20-national-overview.md`](./S-20-national-overview.md)           |
| **S-21**  | AICTE Regional Scrutiny Hub                 | `/aicte/scrutiny`              | `AICTE_REVIEWER`, `AICTE_ADMIN` | `CONFIRMED (PLANNED)`   | J-04             | [`S-21-regional-scrutiny.md`](./S-21-regional-scrutiny.md)           |
| **S-22**  | Approval Order Master Registry              | `/aicte/approvals`             | `AICTE_ADMIN`                   | `CONFIRMED (PLANNED)`   | Master Data      | [`S-22-approval-registry.md`](./S-22-approval-registry.md)           |
| **S-23**  | Regulatory Policy Engine & Fixtures         | `/aicte/policies`              | `AICTE_ADMIN`                   | `CONFIRMED (PLANNED)`   | Master Data      | [`S-23-policy-engine.md`](./S-23-policy-engine.md)                   |
| **S-24**  | Show Cause Dispatcher & Hearing Queue       | `/aicte/exceptions`            | `AICTE_REVIEWER`, `AICTE_ADMIN` | `CONFIRMED (PLANNED)`   | J-05             | [`S-24-show-cause-dispatcher.md`](./S-24-show-cause-dispatcher.md)   |
| **S-25**  | Exception Adjudication & Dual Sign-Off      | `/aicte/exceptions/:id`        | `AICTE_REVIEWER`, `AICTE_ADMIN` | `CONFIRMED (PLANNED)`   | J-05             | [`S-25-exception-detail.md`](./S-25-exception-detail.md)             |
| **S-30**  | Student Admission Verification Card         | `/student/record`              | `STUDENT`                       | `CONFIRMED (PLANNED)`   | J-06             | [`S-30-student-record.md`](./S-30-student-record.md)                 |
| **S-31**  | AEP Credential View & Dynamic QR            | `/student/credential`          | `STUDENT`                       | `CONFIRMED (PLANNED)`   | J-06             | [`S-31-aep-download.md`](./S-31-aep-download.md)                     |
| **S-32**  | Demographic Correction Request Form         | `/student/correction`          | `STUDENT`                       | `CONFIRMED (PLANNED)`   | J-06             | [`S-32-correction-request.md`](./S-32-correction-request.md)         |
| **S-38**  | Public Cryptographic AEP Verifier Card      | `/verify/:token`               | `VERIFIER`, Public              | `CONFIRMED (PLANNED)`   | J-07             | [`S-38-verifier-card.md`](./S-38-verifier-card.md)                   |
| **S-39**  | Immutable Audit Log Explorer                | `/auditor/logs`                | `AUDITOR`, `AICTE_ADMIN`        | `CONFIRMED (PLANNED)`   | J-08             | [`S-39-audit-explorer.md`](./S-39-audit-explorer.md)                 |
| **S-40**  | Temporal Regulatory Replay Simulator        | `/auditor/replay`              | `AUDITOR`                       | `CONFIRMED (PLANNED)`   | J-08             | [`S-40-regulatory-replay.md`](./S-40-regulatory-replay.md)           |

---

## 3. Screen Standard Contracts & State Handlers

Every individual screen specification must define the mandatory **6-state component state machine**:

1. **Idle State:** Default baseline rendering with active focus indicators.
2. **Loading State:** Geometry-matched skeleton loaders (zero layout shift).
3. **Success State:** Non-disruptive feedback banners or toasts with correlation IDs.
4. **Partial State:** Partitioned views for mixed batches (e.g. valid staged rows vs. quarantined errors).
5. **Error State:** Human-readable explanations citing rule references and recovery actions.
6. **Disabled / Locked State:** Accessible tooltips explaining regulatory lockouts or authorization limits.
