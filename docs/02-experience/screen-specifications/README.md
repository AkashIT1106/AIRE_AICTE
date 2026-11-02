# Screen Specifications Index

| Metadata              | Value                                                                           |
| --------------------- | ------------------------------------------------------------------------------- |
| Document              | `docs/02-experience/screen-specifications/README.md`                            |
| Authoritative Source  | [`docs/04-frontend/screen-inventory.md`](../../04-frontend/screen-inventory.md) |
| Status                | `AUDIT RECORD`                                                                  |
| Total Screens Tracked | 41 Screens (S-00 to S-40)                                                       |

---

## 1. Screen Architecture

The application interface is catalogued across five functional groups:

- **Shell & Authentication (S-00 to S-05):** Application shell, login, session expiry, institution switcher.
- **Institution Workspace (S-10 to S-16):** Batch upload, ingestion progress, cohort ledger, exception responder.
- **AICTE Workspace (S-20 to S-26):** National intake overview, regional reconciliation, Show Cause dispatcher.
- **Student Portal (S-30 to S-33):** Admission verification card, AEP credential view, correction request form.
- **Verifier & Auditor (S-38 to S-40):** Public AEP verification card, audit log explorer, regulatory replay simulator.

For detailed screen component contracts, mock states, and audit evidence, refer to [`docs/04-frontend/screen-inventory.md`](../../04-frontend/screen-inventory.md).
