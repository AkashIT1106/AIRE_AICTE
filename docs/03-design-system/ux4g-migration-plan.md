# Later Migration Plan (Existing Routes)

| Metadata     | Value                                          |
| ------------ | ---------------------------------------------- |
| Document     | `docs/03-design-system/ux4g-migration-plan.md` |
| Status       | `PLANNED` (not executed in this task)          |
| Last Updated | 3 November 2026                                |

Do **not** redesign application pages in this change set. Apply the library later, screen by screen.

## Order

1. **Shared chrome:** replace remaining raw hex in `AppShell` identity band/header with semantic tokens; keep skip link; wire toasts at the shell once product agrees.
2. **Forms:** Login and batch upload should consume `FormField`, `FileUpload`, `ErrorSummary`, `Button` loading.
3. **Tables:** Submissions, quarantine, auditor logs → `Table` + `Pagination` + `StatusIndicator`.
4. **Feedback:** page empty/loading/error already exist; replace one-off markup.
5. **Workflow pages:** Batch upload → `BatchUploadPanel` family; quarantine → triage table; student record → `StudentRecordSummary`; auditor → `AuditLogFilter` + `AuditEventEntry`.
6. **Do last:** dashboards/metrics (`MetricCard`) so numbers stay bound to real APIs, not showcase fiction.

## Rules for each screen

- One primary button.
- Semantic token classes only.
- Status text + icon.
- Do not change authorization, API contracts, or Zod domain schemas except UI error display.
- Verify the touched route at 360 / 768 / 1280 widths before calling the screen done.
