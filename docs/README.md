# AIRE Documentation System

**AICTE Admission Reconciliation & Evidence Platform**

Welcome to the authoritative documentation for AIRE. This documentation system is organized into focused, modular domains to ensure strict traceability, clear ownership, and reliable engineering workflows.

---

## Documentation Structure

| Domain                    | Path                                                                      | Description                                                                             |
| ------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **00 Governance**         | [`docs/00-governance/`](./00-governance/documentation-map.md)             | Authority policy, documentation map, requirement traceability, and decision registers.  |
| **01 Product**            | [`docs/01-product/`](./01-product/product-overview.md)                    | Vision, problem statement, scope boundaries, user personas, and glossary.               |
| **02 Experience**         | [`docs/02-experience/`](./02-experience/experience-overview.md)           | Information architecture, interaction contracts, design foundations, and accessibility. |
| **03 Design System**      | [`docs/03-design-system/`](./03-design-system/README.md)                  | Semantic tokens, typography, component foundations, WCAG 2.2 AA rules, and decisions.   |
| **03 Architecture**       | [`docs/03-architecture/`](./03-architecture/architecture-overview.md)     | System context, modular monolith design, technology decisions, and deployment.          |
| **04 Domain**             | [`docs/04-domain/`](./04-domain/domain-overview.md)                       | Domain models, business rules (intake, reconciliation, policy), and core workflows.     |
| **05 Security & Privacy** | [`docs/05-security-privacy/`](./05-security-privacy/security-overview.md) | Authentication, authorization (RLS), privacy by design, Identity Vault, and audit.      |
| **06 Data**               | [`docs/06-data/`](./06-data/data-architecture.md)                         | Database schemas, entity relationships, data lifecycle, and ingestion validation.       |
| **07 API & Integrations** | [`docs/07-api-integrations/`](./07-api-integrations/api-overview.md)      | REST conventions, external adapters (APAAR, ABC, DigiLocker), and OpenAPI specs.        |
| **08 Engineering**        | [`docs/08-engineering/`](./08-engineering/coding-standards.md)            | Repository layout, coding standards, testing pyramid, observability, and workflow.      |
| **09 Delivery**           | [`docs/09-delivery/`](./09-delivery/implementation-roadmap.md)            | Roadmap (Phases 0–12), exit criteria, vertical slice demonstration, and risk register.  |
| **10 Reference**          | [`docs/10-reference/`](./10-reference/source-materials.md)                | Regulatory sources (APH), technical standards, and research notes.                      |

---

## Essential Navigation Links

- **Documentation Map & Reading Guide:** [`docs/00-governance/documentation-map.md`](./00-governance/documentation-map.md)
- **Source of Truth Policy:** [`docs/00-governance/source-of-truth-policy.md`](./00-governance/source-of-truth-policy.md)
- **Requirements Traceability Matrix (243 Requirements):** [`docs/00-governance/requirements-traceability.md`](./00-governance/requirements-traceability.md)
- **Decision Register:** [`docs/00-governance/decisions/decision-register.md`](./00-governance/decisions/decision-register.md)
- **Design System & Foundations:** [`docs/03-design-system/README.md`](./03-design-system/README.md)
- **UI/UX Audit Records:** [`docs/04-frontend/ui-ux-audit.md`](./04-frontend/ui-ux-audit.md)
- **SSO Provider Boundary Guide:** [`docs/SSO_PROVIDER_INTEGRATION_BOUNDARY.md`](./SSO_PROVIDER_INTEGRATION_BOUNDARY.md)

---

## Authority & Contribution Rule

> [!IMPORTANT]
> The modular specifications under `docs/` are the authoritative source of truth for ongoing implementation. The legacy `PROJECT_PLAN.md` has been converted into an executive baseline and index. When implementing features, consult the specific domain document rather than loading monolithic project files.
