# S-32 — Demographic Correction Request Form

| Metadata             | Value                                                                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Screen ID            | `S-32`                                                                                                                                        |
| Screen Name          | Student Demographic Clerical Correction Request Form                                                                                          |
| Purpose              | Enable students to submit structured clerical correction requests (name typo, DOB mistake) directly to their admitted institution             |
| User Roles Allowed   | `STUDENT`                                                                                                                                     |
| Related Journeys     | [`J-06`](../user-journeys/J-06-student-verification.md)                                                                                       |
| Primary Route        | `/student/correction`                                                                                                                         |
| Status               | `CONFIRMED (PLANNED)`                                                                                                                         |
| Source Reference     | PROJECT_PLAN.md §5.1, §15.6; [`docs/02-experience/user-journeys/J-06-student-verification.md`](../user-journeys/J-06-student-verification.md) |
| Related Requirements | [`AIRE-REQ-051`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-191`](../../00-governance/requirements-traceability.md)        |
| Last Updated         | 2 November 2026                                                                                                                               |

---

## 1. Information Hierarchy & Content

1. **Header Context:** Breadcrumb: `Student Portal > Request Correction`.
2. **Current Record Preview (Read-Only):** Displays candidate name, DOB, and roll number as reported by the college.
3. **Structured Correction Inputs:**
   - Field in Error selector (Candidate Name, Date of Birth).
   - Proposed Correct Value input.
   - Reason for Correction (textarea).
   - Supporting Document Upload (PDF of Class 10 Certificate / Digilocker verified document).
4. **Action Controls:**
   - Primary: _"Submit Correction Request to College Registrar"_.
   - Secondary: _"Cancel"_.
