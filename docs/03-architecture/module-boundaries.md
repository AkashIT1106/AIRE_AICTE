# Module Boundaries (M01 – M15)

| Metadata          | Value                                                     |
| ----------------- | --------------------------------------------------------- |
| Document          | `docs/03-architecture/module-boundaries.md`               |
| Authoritative For | 15 Core Modules, Dependency Rules, Inter-Module Contracts |
| Status            | `CONFIRMED`                                               |
| Source            | PROJECT_PLAN.md §11.1, §20 to §34                         |

---

## 1. The 15 Core Domain Modules

The platform is decomposed into 15 domain modules:

| Module ID | Module Name           | Primary Responsibility                                         | Authoritative Document                                                                                                 |
| --------- | --------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **M01**   | Identity & Access     | Authentication, Better Auth, session management, roles.        | [`docs/05-security-privacy/authentication.md`](../05-security-privacy/authentication.md)                               |
| **M02**   | Institution Registry  | Authoritative institution, campus, and programme references.   | [`docs/04-domain/domain-model.md`](../04-domain/domain-model.md)                                                       |
| **M03**   | Approval Registry     | AICTE EOA/LOA orders, sanctioned intake versions, quotas.      | [`docs/04-domain/business-rules/intake-and-quota-rules.md`](../04-domain/business-rules/intake-and-quota-rules.md)     |
| **M04**   | Policy Registry       | Versioned regulatory policy packs, rule fixtures, activation.  | [`docs/04-domain/business-rules/policy-lifecycle-rules.md`](../04-domain/business-rules/policy-lifecycle-rules.md)     |
| **M05**   | Submission Management | Institution admission upload, validation, freeze lifecycle.    | [`docs/04-domain/workflows/admission-submission-workflow.md`](../04-domain/workflows/admission-submission-workflow.md) |
| **M06**   | Data Ingestion        | Parsing, schema validation, quarantine of defective rows.      | [`docs/06-data/data-quality-and-validation.md`](../06-data/data-quality-and-validation.md)                             |
| **M07**   | Identity Gateway      | APAAR adapter gateway (Live, Sandbox, Mock).                   | [`docs/07-api-integrations/integration-overview.md`](../07-api-integrations/integration-overview.md)                   |
| **M08**   | Admission Ledger      | Append-only chronological student lifecycle events.            | [`docs/06-data/data-lifecycle.md`](../06-data/data-lifecycle.md)                                                       |
| **M09**   | Entitlement Engine    | Approved vs admitted intake arithmetic, reservation limits.    | [`docs/04-domain/business-rules/intake-and-quota-rules.md`](../04-domain/business-rules/intake-and-quota-rules.md)     |
| **M10**   | Cohort Reconciliation | Cross-institutional mismatch detection, ghost enrollment scan. | [`docs/04-domain/business-rules/reconciliation-rules.md`](../04-domain/business-rules/reconciliation-rules.md)         |
| **M11**   | Exception Workbench   | Show Cause Notices, evidence review, dual sign-off.            | [`docs/04-domain/workflows/exception-review-workflow.md`](../04-domain/workflows/exception-review-workflow.md)         |
| **M12**   | Verifiable Records    | AEP generation, W3C Verifiable Credentials, QR codes.          | [`docs/04-domain/business-rules/reconciliation-rules.md`](../04-domain/business-rules/reconciliation-rules.md)         |
| **M13**   | Dashboards & Reports  | Role-scoped aggregate metrics, server-side pagination.         | [`docs/01-product/scope-and-requirements.md`](../01-product/scope-and-requirements.md)                                 |
| **M14**   | Integration Hub       | Circuit breakers, external credential rotation, retries.       | [`docs/07-api-integrations/integration-overview.md`](../07-api-integrations/integration-overview.md)                   |
| **M15**   | Privacy & Governance  | DPDP compliance, envelope encryption, automated retention.     | [`docs/05-security-privacy/privacy-by-design.md`](../05-security-privacy/privacy-by-design.md)                         |

---

## 2. Dependency Rules

1. **No Circular Dependencies:** A module cannot import or invoke a module that depends upon it.
2. **Persistence Boundary:** A module's repository queries only tables owned by that module. Cross-module data must be accessed via exported Service interfaces.
3. **Outbox Pattern:** Cross-module updates that require eventual consistency are dispatched via the transactional Outbox pattern to BullMQ queues.
