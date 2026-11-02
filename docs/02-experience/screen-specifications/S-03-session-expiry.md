# S-03 — Session Expiry & Heartbeat Modal

| Metadata             | Value                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-03`                                                                                                                                 |
| Screen Name          | Session Expiry Warning & Inactivity Heartbeat Modal                                                                                    |
| Purpose              | Warn users 5 minutes before the 30-minute idle session timeout, provide accessible renewal trigger, and handle secure automatic logout |
| User Roles Allowed   | All Authenticated Roles                                                                                                                |
| Related Journeys     | [`J-01`](../user-journeys/J-01-authentication.md)                                                                                      |
| Primary Route        | Modal overlay (triggered across any view)                                                                                              |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                  |
| Source Reference     | PROJECT_PLAN.md §16.1; [`docs/05-security-privacy/authentication.md`](../../05-security-privacy/authentication.md) §2                  |
| Related Requirements | [`AIRE-REQ-098`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-125`](../../00-governance/requirements-traceability.md) |
| Last Updated         | 2 November 2026                                                                                                                        |

---

## 1. Information Hierarchy & Content

1. **Modal Header:** Alert triangle icon + _"Session Inactivity Warning"_.
2. **Countdown Message:** _"Your session will expire in 04:59 due to inactivity. Unsaved changes will be lost if the session terminates."_
3. **Actions:**
   - Primary: _"Stay Signed In"_ (`bg-indigo-600 text-white`, resets idle timer).
   - Secondary: _"Sign Out Now"_ (cleanly clears session and routes to `/login`).

---

## 2. Behavioral Contract

- Appears at minute 25 of continuous user inactivity.
- Focus is automatically trapped inside the modal.
- Hitting `Enter` or clicking _"Stay Signed In"_ fires a heartbeat API request (`POST /api/auth/session/touch`), resets the idle timer, and dismisses the modal.
- If countdown reaches 0:00, the modal closes, in-memory caches are purged, and the browser redirects to `/login?reason=session_expired`.
