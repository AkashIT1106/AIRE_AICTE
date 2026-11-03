# Task Prompt: UX4G Design System Full Application Migration

| Metadata       | Value                                                                            |
| -------------- | -------------------------------------------------------------------------------- |
| Document       | `prompts/ux4g-system-migration.md`                                               |
| Status         | `READY FOR APPROVAL`                                                             |
| Date           | 3 November 2026                                                                  |
| Target Package | `ux4g-web-components` v3.0.2                                                     |
| Chosen Theme   | Default UX4G Theme (Standard Government of India theme, no root color overrides) |

## 1. Goal

Migrate the entire AIRE React application from Tailwind CSS utility classes to the official Government of India UX4G Design System (`ux4g-web-components` v3.0.2) in strict accordance with `docs/MIGRATION.md` and `.agents/skills/ux4g-design/Design.md`.

## 2. Theme Selection

- **Theme:** Default UX4G Theme.
- **Attributes:** `<html lang="en" data-theme="light">` in `client/index.html`.
- **Overrides:** None (no custom `:root` color override block). All styling leverages standard UX4G tokens (`--ux4g-color-*`, `--ux4g-semantic-*`).

## 3. Scope & Inventory

### A. Primitives (Layer B - 27 components in `client/src/components/ui/`)

- `accordion.tsx` -> `ux4g-accordion`
- `alert.tsx` -> `ux4g-alert ux4g-alert-{variant}`
- `badge.tsx` -> `ux4g-badge ux4g-badge-{variant} ux4g-badge-sm`
- `breadcrumbs.tsx` -> `ux4g-breadcrumb`
- `button.tsx` -> `ux4g-btn ux4g-btn-{variant} ux4g-btn-{size}`
- `button-group.tsx` -> `ux4g-btn-group`
- `card.tsx` -> `ux4g-card ux4g-card-body ux4g-card-title`
- `checkbox.tsx` -> `ux4g-form-check`
- `confirmation-dialog.tsx` -> `ux4g-modal`
- `dialog.tsx` -> `ux4g-modal`
- `drawer.tsx` -> `ux4g-drawer`
- `dropdown-menu.tsx` -> `ux4g-dropdown`
- `empty-state.tsx` -> `ux4g-d-flex ux4g-flex-column ux4g-ai-center ux4g-text-center`
- `error-summary.tsx` -> `ux4g-alert ux4g-alert-error`
- `file-upload.tsx` -> `ux4g-upload`
- `form-field.tsx` -> `ux4g-form-group`
- `input.tsx` -> `ux4g-input ux4g-input-m`
- `label.tsx` -> `ux4g-label`
- `metric-card.tsx` -> `ux4g-card`
- `pagination.tsx` -> `ux4g-pagination`
- `progress.tsx` -> `ux4g-progress`
- `radio-group.tsx` -> `ux4g-form-check`
- `search-input.tsx` -> `ux4g-input-group`
- `select.tsx` -> `ux4g-select` / `ux4g-form-select`
- `separator.tsx` -> `ux4g-divider`
- `skeleton.tsx` -> `ux4g-skeleton ux4g-animate-pulse`
- `skip-link.tsx` -> `ux4g-skip-link`
- `status-indicator.tsx` -> `ux4g-badge`
- `stepper.tsx` -> `ux4g-stepper`
- `switch.tsx` -> `ux4g-form-switch`
- `table.tsx` -> `ux4g-table`
- `tabs.tsx` -> `ux4g-tab`
- `textarea.tsx` -> `ux4g-textarea ux4g-input`
- `timeline.tsx` -> `ux4g-timeline`
- `toast.tsx` -> `ux4g-toast`
- `tooltip.tsx` -> `ux4g-tooltip`

### B. Layout & Feedback (10 components)

- `client/src/components/layout/AppShell.tsx`
- `client/src/components/layout/PublicHeader.tsx`
- `client/src/components/layout/PublicFooter.tsx`
- `client/src/components/layout/Breadcrumbs.tsx`
- `client/src/components/auth/WorkspaceGuard.tsx`
- `client/src/components/feedback/EmptyState.tsx`
- `client/src/components/feedback/ErrorState.tsx`
- `client/src/components/feedback/LoadingState.tsx`
- `client/src/components/feedback/PageLoadingSkeleton.tsx`
- `client/src/components/feedback/DashboardSkeleton.tsx`
- `client/src/components/feedback/RouteErrorBoundary.tsx`
- `client/src/components/forms/FormField.tsx`

### C. Workflow Components (Layer C - 15 components in `client/src/components/workflow/`)

- `BatchUploadPanel.tsx`
- `FileProcessingProgress.tsx`
- `UploadValidationSummary.tsx`
- `ValidationIssueSummary.tsx`
- `QuarantineIssueRow.tsx`
- `QuarantineTriageTable.tsx`
- `StudentRecordSummary.tsx`
- `QuotaCategoryIndicator.tsx`
- `DuplicateRecordComparisonPanel.tsx`
- `SubmissionStatusTimeline.tsx`
- `InstitutionStatusPanel.tsx`
- `AuditEventEntry.tsx`
- `AuditLogFilter.tsx`
- `AuditLogViewer.tsx`
- `RecordVerificationSummary.tsx`

### D. Pages (13 pages in `client/src/pages/`)

- `LandingPage.tsx`
- `RootGateway.tsx`
- `pages/auth/LoginPage.tsx`
- `pages/institution/InstitutionDashboard.tsx`
- `pages/institution/BatchUploadPage.tsx`
- `pages/institution/QuarantineTriagePage.tsx`
- `pages/institution/SubmissionsHistoryPage.tsx`
- `pages/student/StudentRecordPage.tsx`
- `pages/auditor/AuditorLogsPage.tsx`
- `pages/aicte/AicteOverviewPage.tsx`
- `pages/error/NotFoundPage.tsx`
- `pages/error/AccessDeniedPage.tsx`
- `pages/DesignSystemShowcase.tsx`

## 4. Execution Sequence

1. **Foundation & Setup:** Install `ux4g-web-components` v3.0.2, inject styles into `client/src/main.tsx`, add `data-theme="light"` to `<html>`.
2. **Layer B UI Primitives:** Convert core controls and indicators in `client/src/components/ui/` to UX4G semantic classes, maintaining accessibility props and test contracts.
3. **Shell & Layout:** Migrate `AppShell`, public header/footer, breadcrumbs, and feedback skeletons.
4. **Layer C Workflow Components:** Migrate reconciliation tables, upload panels, metric cards, and review timelines.
5. **Pages:** Migrate landing page, authentication, dashboards, quarantine workbench, audit explorer, and error pages.
6. **Verification & Clean-up:** Execute test suite, verify WCAG AA contrast, responsive breakpoints (320px-1440px), and dark theme auto-switch.
