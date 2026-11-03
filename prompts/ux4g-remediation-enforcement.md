# AIRE — UX4G Remediation, Validation & Enforcement Task Plan

| Metadata | Value                                                             |
| -------- | ----------------------------------------------------------------- |
| Task     | UX4G Remediation, Real-Browser Validation & Automated Enforcement |
| Date     | 3 November 2026                                                   |
| Mode     | `during` (session override)                                       |
| Status   | `IN_PROGRESS`                                                     |

---

## 1. Goal

Eliminate verified UX4G gaps identified in the read-only reconciliation audit:

1. Remove unsafe `DEMO_INSTITUTION_ID` fallbacks in the institution workspace; enforce strict default-deny when tenant context is missing.
2. Correct mobile touch targets for header interactive controls (institution selector, user profile trigger, mobile drawer links) to guarantee $\ge 44\text{px} \times 44\text{px}$ touch targets.
3. Validate the actual rendered application across required viewports (320, 360, 390, 768, 1024, 1280, 1440 px) and measure real CLS and accessibility in a headless Chromium browser.
4. Establish repeatable, automated UX4G enforcement in `package.json` and CI runner script (`infrastructure/scripts/ci-local.sh`).
5. Update `docs/04-frontend/ux4g-compliance-matrix.md` with verified runtime evidence.

---

## 2. Inspected Code & Context

- `client/src/pages/institution/InstitutionDashboard.tsx`: Currently has fallback `const effectiveInstitutionId = activeInstitution?.id || DEMO_INSTITUTION_ID;`.
- `client/src/pages/institution/BatchUploadPage.tsx`: Currently has `const institutionId = activeInstitution?.id || DEMO_INSTITUTION_ID;`.
- `client/src/pages/institution/QuarantineTriagePage.tsx`: Currently has fallback `const effectiveInstitutionId = activeInstitution?.id || DEMO_INSTITUTION_ID;`.
- `client/src/components/layout/AppShell.tsx`: Header tenant selector and profile menu buttons currently use `h-8` (32px), failing mobile touch target rules.
- `client/src/pages/institution/AdmissionJourney.test.tsx`: Tests currently assume Delhi Institute of Technology fallback.
- `infrastructure/scripts/ci-local.sh`: Runs lint, format, typecheck, build, test.

---

## 3. Scope and Non-Goals

### In Scope

- Remove all `DEMO_INSTITUTION_ID` fallbacks in client code; show accessible tenant-required alert when `activeInstitution` is null.
- Add unit tests proving missing tenant context fails safely and prevents queries.
- Update header controls in `AppShell.tsx` to `min-h-[44px] min-w-[44px]` on mobile/touch while preserving desktop visual hierarchy.
- Add browser test harness (`scripts/ux4g-browser-check.py` using Playwright + Chromium) to test all 7 viewports (320px..1440px), measure CLS via `PerformanceObserver`, check horizontal overflow, and verify touch targets.
- Wire UX4G validation into `package.json` (`test:ux4g`) and `infrastructure/scripts/ci-local.sh`.
- Update `docs/04-frontend/ux4g-compliance-matrix.md` with exact evidence.

### Non-Goals

- Do NOT implement J-03 cohort sealing or cryptographic Merkle tree.
- Do NOT implement Identity Vault backend encryption or Redis/BullMQ streaming queues.
- Do NOT alter canonical tokens or create a second design system.
- Do NOT claim WCAG certification without full manual assistive-technology audit.

---

## 4. Acceptance Criteria

1. Zero occurrences of `DEMO_INSTITUTION_ID` in production code.
2. If `activeInstitution` is null, institution pages render an accessible warning alert and perform zero network queries.
3. All interactive mobile controls in header and navigation measure $\ge 44\text{px} \times 44\text{px}$ in a real browser.
4. Real-browser validation at 320px, 360px, 390px, 768px, 1024px, 1280px, 1440px passes with 0 horizontal overflow.
5. Measured CLS $\le 0.1$ across all key routes.
6. All existing unit and monorepo tests pass (100%).
7. CI script (`ci-local.sh`) runs and enforces UX4G validation.
