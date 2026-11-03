# AIRE Design & Frontend Implementation Roadmap

**Status:** Approved Engineering Blueprint  
**Date:** 3 November 2026  
**Audience:** Engineering Leads, Frontend Developers, QA Engineers, Domain Approvers  
**Authority:** Derived from `AGENTS.md`, `docs/design/UX-DECISIONS.md`, and `docs/09-delivery/implementation-roadmap.md`.

---

## 1. Roadmap Architecture & Execution Principles

This roadmap translates the audit synthesis, UX decisions, and component adoption plan into **5 independent, reviewable engineering phases**.

### Core Execution Rules:
1. **Separation of Concerns:** Design system, tokens, and layout refactoring are isolated into Phases 1 & 2 before feature component integration in Phases 3 & 4.
2. **Strict Non-Destructive Progression:** No phase may break existing passing unit tests (220 tests in `@aire/client`).
3. **Explicit Gate Approval:** Every phase requires explicit sign-off on its acceptance criteria before triggering the subsequent prompt.

---

## 2. Technical Specification for J-03 Cohort Attestation & Sealing

This specification details the technical requirements and architecture for Journey `J-03` (**Cohort Legal Certification, Attestation & Cryptographic Tamper Sealing**) prior to backend implementation.

### 2.1 Distinction: Mandatory Requirements vs Proposed Implementation Details

| Architecture Area | Mandatory Regulatory Requirement (`CONFIRMED`) | Proposed Engineering Implementation Detail |
| :--- | :--- | :--- |
| **Legal Attestation** | Principal/Head of Institution must explicitly certify records under penalty of derecognition under the AICTE Act 1987. | Checked via mandatory checkbox in an accessible Radix modal dialog; modal submit button remains disabled until checked. |
| **Authentication Non-Repudiation** | Step-up re-authentication required for irreversible administrative sealing if session age exceeds 15 minutes. | Client checks `session.createdAt` / `session.lastAuthenticated`. Prompts for user password; verifies via `POST /api/auth/verify-password` (Better Auth). |
| **Data Integrity Guarantee** | Batch records must be cryptographically hashed into an immutable digest to prove provenance. | Deterministic SHA-256 Merkle root computation over sorted, canonically serialized candidate JSON strings. |
| **Atomic State Locking** | Batch must permanently transition from `VALIDATED` to `SEALED`; all editing and row additions permanently blocked. | Executed inside a PostgreSQL database transaction with RLS protection; triggers emit audit log and prevent future `UPDATE` queries. |
| **Regulatory Receipt** | Institution must receive a downloadable tamper-evident confirmation receipt. | Printable/downloadable receipt rendering Receipt ID (`REC-2026-[CODE]-[BATCH]`), Merkle root hash, server timestamp, and college AISHE code. |

### 2.2 Canonical Record Serialization & Merkle Tree Algorithm

To guarantee deterministic cryptographic hashing regardless of JSON key ordering:
1. **Field Sorting:** Each student admission record object is normalized by sorting keys lexicographically:
   `["apaarId", "category", "dateOfBirth", "quota", "rollNumber", "studentName"]`.
2. **Canonical String:** The object is serialized to JSON with no extraneous whitespace: `JSON.stringify(normalizedRecord)`.
3. **Leaf Hashing:** Each serialized record string is hashed with SHA-256: `H_i = SHA256(Record_i)`.
4. **Merkle Tree Aggregation:** Leaf hashes are sorted lexicographically, paired, and concatenated: `H_parent = SHA256(H_left + H_right)`. The process recurses until a single 32-byte (64-character hex) **Merkle Root** is computed.
5. **Storage:** The resulting Merkle root hash is permanently stored in the batch payload and logged to `AuditEvent`.

### 2.3 Proposed Endpoint Contract (Backend)

```http
POST /api/v1/institutions/:institutionId/submissions/:batchId/seal
Content-Type: application/json
X-Correlation-ID: <uuid>
X-Institution-ID: <institutionId>

{
  "attestationAccepted": true,
  "attestationText": "I, Dr. R. K. Sharma, Principal/Head of Institution, hereby certify under penalty of regulatory derecognition and statutory sanction under the AICTE Act that the 114 student records submitted herein represent genuine, enrolled students admitted strictly against approved intake quotas and reservation norms.",
  "password": "<step-up-password-if-prompted>"
}
```

*Response (200 OK):*
```json
{
  "data": {
    "batchId": "batch-2026-cse-01",
    "status": "SEALED",
    "sealedAt": "2026-11-03T14:30:00.000Z",
    "sealedBy": {
      "userId": "usr-admin-01",
      "name": "Dr. R. K. Sharma",
      "role": "INSTITUTION_ADMIN"
    },
    "merkleRoot": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "receiptNumber": "REC-2026-BTECH-CSE-104",
    "totalRecords": 114
  },
  "error": null
}
```

---

## 3. Phased Implementation Roadmap

### Phase 1: Design Tokens, Typography & Accessibility Foundation
*Prompt Target:* Prompt 03 (`prompts/03-implement-design-foundation.md`)

* **Objective:** Harmonize design tokens, eliminate raw hex styles in core layout, fix the 768px overflow defect, mount skip navigation, and establish accessible token contracts.
* **Files Likely to Change:**
  * `docs/design/02-DESIGN-TOKENS.css` (Synchronize with `client/design-tokens.json`).
  * `client/src/index.css` (Ensure focus rings, table classes, and skip-link styles are complete).
  * `client/src/components/layout/AppShell.tsx` (Add `<SkipLink />`, isolate live clock).
  * `client/src/components/layout/PublicHeader.tsx` (Remove pseudo-emblem SVG, remove broken dark toggle).
  * `client/src/pages/auth/LoginPage.tsx` (Remove unverified "MeitY GIGW 3.0" claim).
* **Dependencies:** Zero backend dependencies.
* **Risks:** Visual styling regressions on public pages.
* **Tests:** `pnpm --filter @aire/client test`, automated contrast assertions in `design-tokens.test.ts`.
* **Acceptance Criteria:**
  1. `<SkipLink href="#content" />` receives focus on initial Tab keypress in `AppShell`.
  2. Zero horizontal overflow at 768px tablet portrait breakpoint.
  3. No raw hex colors in header/footer layout components.
  4. Pseudo-emblem star and unverified GIGW claim removed.
* **Approval Gate:** Human visual and accessibility review of unified shell header.

---

### Phase 2: Application Shell Unification & Component Deduplication
*Prompt Target:* Prompt 04 & 05 (`prompts/04-implement-institution-shell.md`, `prompts/05-build-shared-components.md`)

* **Objective:** Resolve the triple-header geometry, move breadcrumbs in-flow, eliminate duplicate components (`FormField`, `EmptyState`), and wrap application router in `QueryClientProvider`.
* **Files Likely to Change:**
  * `client/src/App.tsx` (Initialize `QueryClientProvider`).
  * `client/src/components/layout/AppShell.tsx` (Consolidate 64px header, wire Radix Tooltips to collapsed sidebar).
  * `client/src/components/layout/Breadcrumbs.tsx` (Refactor to compose `client/src/components/ui/breadcrumbs.tsx`).
  * `client/src/components/forms/FormField.tsx` (Deprecate; migrate consumers to `ui/form-field.tsx`).
  * `client/src/components/feedback/EmptyState.tsx` (Deprecate; migrate consumers to `ui/empty-state.tsx`).
  * `client/src/components/ui/table.tsx` (Add keyboard-accessible region wrapper `tabIndex={0}`).
* **Dependencies:** Phase 1 token harmonization.
* **Risks:** Broken import paths if deprecated components are deleted before updating consumers.
* **Tests:** `tsc --noEmit`, `vitest run`, breadcrumb navigation tests.
* **Acceptance Criteria:**
  1. Header height is exactly 64px; breadcrumbs render inside `#content` without layout shifts.
  2. Collapsed 64px sidebar icons display accessible Radix Tooltips on hover and keyboard focus.
  3. All imports standardized on `client/src/components/ui/`; duplicate files deleted.
  4. App boots cleanly with `QueryClientProvider` active.
* **Approval Gate:** Inspection of clean component import tree and zero deprecated files.

---

### Phase 3: Institution Dashboard & Capacity Gauge Modernization
*Prompt Target:* Prompt 06 (`prompts/06-redesign-institution-dashboard.md`)

* **Objective:** Redesign `InstitutionDashboard.tsx` using semantic tokens, replace hardcoded `360` capacity bar with `QuotaCategoryIndicator`, and mount `InstitutionStatusPanel`.
* **Files Likely to Change:**
  * `client/src/pages/institution/InstitutionDashboard.tsx`
  * `client/src/components/workflow/QuotaCategoryIndicator.tsx` (Refine props/labels)
  * `client/src/components/workflow/InstitutionStatusPanel.tsx`
* **Dependencies:** Phase 1 & 2.
* **Risks:** Confusing registrars if capacity labels are inaccurate.
* **Tests:** Dashboard metric calculations unit tests, responsive reflow tests.
* **Acceptance Criteria:**
  1. Hardcoded `approvedCapacity = 360` removed; UI displays live allocation or `Pending EOA Sync`.
  2. Metric cards and tables use semantic tokens (`bg-surface-card`, `border-line-default`, `text-txt-primary`).
  3. High-density table wrapped in keyboard-scrollable container.
* **Approval Gate:** Product owner approval of capacity calculation presentation.

---

### Phase 4: Batch Upload & Quarantine Triage Integration
*Prompt Target:* Prompt 07 (`prompts/07-implement-batch-upload-workflow.md`)

* **Objective:** Integrate `BatchUploadPanel` into `BatchUploadPage.tsx` (providing RFC 4180 CSV parsing, column mapping, and preview), wire `QuarantineTriageTable` into `QuarantineTriagePage.tsx`, and build the J-03 Legal Attestation Modal (replacing `alert()`).
* **Files Likely to Change:**
  * `client/src/pages/institution/BatchUploadPage.tsx`
  * `client/src/pages/institution/QuarantineTriagePage.tsx`
  * `client/src/components/workflow/BatchUploadPanel.tsx`
  * `client/src/components/workflow/QuarantineTriageTable.tsx`
  * `client/src/components/workflow/J03AttestationModal.tsx` (New component implementing §2 specification)
* **Dependencies:** Operational `createBatch` and `remediateRow` backend APIs.
* **Risks:** Complex state coordination during multi-step file mapping.
* **Tests:** `AdmissionJourney.test.tsx`, `WorkflowEmpiricalChallenge.test.tsx`, CSV parsing fixtures.
* **Acceptance Criteria:**
  1. CSV files with quoted strings and commas parse without error or misalignment.
  2. Users can map source column headers to AIRE canonical schema.
  3. Quarantined records can be triaged and remediated inline using `QuarantineTriageTable`.
  4. Clicking "Proceed to Sign-Off" opens the J-03 Attestation Modal with mandatory declaration checkbox; zero JavaScript `alert()` calls.
* **Approval Gate:** End-to-end verification of upload-to-triage workflow.

---

### Phase 5: Independent UX, Accessibility & Quality Assurance
*Prompt Target:* Prompt 08 (`prompts/08-independent-ux-accessibility-qa.md`)

* **Objective:** Comprehensive independent verification of all 8 routes against WCAG 2.2 AA, UX4G, responsive reflow, and GIGW 3.0 criteria.
* **Tools Used:** Headless Playwright script (`infrastructure/scripts/ux4g-browser-check.py`), axe-core automated audit, keyboard-only manual traversal.
* **Acceptance Criteria:**
  1. Zero `critical` or `serious` axe-core violations across all 8 routes.
  2. CLS $\le 0.1$ and zero horizontal overflow across 320px, 390px, 768px, 1024px, 1280px, 1440px viewports.
  3. Keyboard focus visible and logical on all interactive controls.
* **Approval Gate:** Final sign-off by Enterprise UX Architect.

---
*End of DESIGN-IMPLEMENTATION-ROADMAP.md.*
