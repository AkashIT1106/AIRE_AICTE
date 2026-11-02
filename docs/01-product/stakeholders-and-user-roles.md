# Stakeholders and User Roles

| Metadata             | Value                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/01-product/stakeholders-and-user-roles.md`                                                                                   |
| Authoritative For    | User Personas, Role Definitions, RBAC Hierarchy, Separation of Duties                                                              |
| Status               | `CONFIRMED`                                                                                                                        |
| Source               | PROJECT_PLAN.md §5.1, §5.2, §5.3, §5.4, §5.5                                                                                       |
| Related Requirements | [`AIRE-REQ-074`](../00-governance/requirements-traceability.md) to [`AIRE-REQ-077`](../00-governance/requirements-traceability.md) |

---

## 1. Stakeholder Ecosystem

AIRE serves five primary stakeholder categories:

1. **Regulators:** All India Council for Technical Education (Headquarters and Regional Offices).
2. **Institutions:** AICTE-approved Universities, Engineering Colleges, and Technical Institutes.
3. **Students:** Enrolled technical students seeking verifiable admission entitlement.
4. **External Verifiers:** Employers, higher education institutions, credential verification agencies.
5. **Auditors:** Government oversight bodies (CAG, Ministry of Education, State Technical Boards).

---

## 2. User Roles & Workspace Matrix

| Role Identifier  | Role Name                        | Primary Workspace     | Scope Level           | Key Permissions                                                                                   |
| ---------------- | -------------------------------- | --------------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| `AICTE_ADMIN`    | AICTE Super Administrator        | AICTE Workspace       | Global                | Full system administration, policy activation, user role management.                              |
| `AICTE_REVIEWER` | AICTE Regional Reviewer          | AICTE Workspace       | Regional / State      | Scrutinize cohorts, issue Show Cause Notices, review evidence, propose exception closure.         |
| `INST_ADMIN`     | Institution Administrator        | Institution Workspace | Institution           | Manage institution operators, sign off on submissions, upload compliance evidence.                |
| `INST_OPERATOR`  | Institution Registrar / Operator | Institution Workspace | Institution / Campus  | Upload admission batches, resolve ingestion warnings, prepare draft submissions.                  |
| `STUDENT`        | Enrolled Student                 | Student Workspace     | Individual Record     | View personal admission entitlement status, download AEP, submit demographic correction requests. |
| `VERIFIER`       | External Verifier                | Verifier Portal       | Public / Token-scoped | Validate AEP cryptographic signatures via QR code or verification token.                          |
| `AUDITOR`        | Regulatory Auditor               | Auditor Workspace     | Global / Scoped       | Read-only inspection of immutable audit trails, reconciliation history, and evidence vaults.      |

---

## 3. Scope Hierarchy

Access permissions are evaluated against a 5-tier organizational hierarchy:

$$	ext{Global} \longrightarrow 	ext{Regional} \longrightarrow 	ext{Institution} \longrightarrow 	ext{Campus} \longrightarrow 	ext{Programme}$$

- An `AICTE_ADMIN` possesses `GLOBAL` scope.
- An `AICTE_REVIEWER` is scoped to their designated `REGIONAL` territory.
- Institutional users (`INST_ADMIN`, `INST_OPERATOR`) are strictly bound to their `INSTITUTION` or `CAMPUS` tenant ID.
- Cross-institution queries by institutional roles are blocked natively at both the authorization middleware and PostgreSQL Row-Level Security layers.

---

## 4. Separation of Duties (SoD)

To eliminate conflicts of interest and prevent fraud, AIRE enforces four non-negotiable separation-of-duties rules:

1. **Submitter vs Reviewer:** An institution operator who creates or uploads an admission batch cannot review, adjudicate, or sign off on exceptions for that cohort.
2. **Reviewer vs Approver:** An `AICTE_REVIEWER` who issues a Show Cause Notice or reviews evidence cannot unilaterally close an exception with penalties; dual sign-off from an `AICTE_ADMIN` is required.
3. **System Admin vs Auditor:** System administrators cannot alter, truncate, or delete audit logs. Auditors have read-only access to audit logs and zero operational mutation permissions.
4. **Rule Author vs Activator:** A policy author who drafts a new regulatory policy pack cannot activate it into production without independent review and automated test fixture passage.
