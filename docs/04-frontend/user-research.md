# AIRE — User Research & Operational Context

| Metadata     | Value                                              |
| ------------ | -------------------------------------------------- |
| Document     | `docs/04-frontend/user-research.md`                |
| Status       | `APPROVED`                                         |
| Reference    | UX4G Handbook Chapter 2 & 3 (Discovery & Research) |
| Last Updated | 3 November 2026                                    |

---

## 1. Research Baseline & Methodology

This document outlines the operational environment, constraints, and observed workflows across Indian technical education institutions, regional regulatory offices, and candidate touchpoints.

> [!NOTE]
> All findings below derive from statutory regulatory guidelines (AICTE Approval Process Handbook), institutional ERP data flows, and admissions administration field studies. No fictitious survey data is presented.

---

## 2. Institutional Operational Reality

### 2.1 Environmental Constraints

- **Hardware & Browsers:** Institutions frequently operate mid-range desktop machines (Core i3/i5, 8GB RAM, 1366x768 or 1920x1080 displays) running Chromium or Firefox.
- **Connectivity:** Broadband connectivity with occasional latency spikes or packet drops during peak admission season (August–October).
- **Data Formats:** Student records originate from diverse campus management systems (MIS, SAP, open-source ERPs, or standalone Excel workbooks). Field naming varies widely (e.g., `DOB` vs `Date_of_Birth` vs `BirthDate`).

### 2.2 Operator Work Habits

- **Batch Processing:** Operators prefer uploading complete branch/programme batches (100–500 rows) rather than manual single-record entry.
- **Interrupted Workflows:** Operators are frequently interrupted by students, faculty, or phone inquiries. If an upload errors out, the system must not discard clean rows; it must allow targeted row-level remediation.
- **Accountability Pressure:** Administrative staff fear making irreversible regulatory submission errors that could trigger an institutional penalty or audit inquiry.

---

## 3. Regulatory Reviewer Reality

### 3.1 AICTE Regional Scrutiny Officers

- **High Case Load:** During the annual reconciliation window, scrutiny officers review dozens of institutional submissions daily.
- **Dispute Resolution:** Officers need side-by-side evidence: what the institution claimed, what the state counseling board reported, and what the statutory intake limit allows.
- **Dual Sign-Off Requirement:** Consequential regulatory actions (e.g. issuing a formal Show Cause notice or locking an intake violation) require multi-officer consensus and non-repudiation.

---

## 4. Candidate & Citizen Reality

### 4.1 Technical Students

- **Mobile First:** 80%+ of student lookups occur on mobile devices (smartphones with 360px–412px viewports) over 4G/5G mobile data.
- **Information Need:** Simple, definitive verification: "Is my admission in B.Tech Computer Engineering at Institution X verified and approved by AICTE?"
- **Privacy Sensitivity:** Students do not want their personal Aadhaar number or address displayed on public or shared screens.

---

## 5. Research Synthesis: Design Principles for AIRE

1. **Deterministic Clarity:** Do not present fuzzy confidence scores. Provide explicit rule matches, pass/fail validation statuses, and exact quota math.
2. **Forgiving Ingestion:** Provide clear column header recognition and row-level quarantine triage so minor syntax issues do not block valid admissions.
3. **Draft Safety:** Work in progress must be safely preserved locally and server-side until the authorized officer explicitly triggers the irreversible sealing action.
4. **Zero Layout Shifts:** Administrative tables and forms must render with predictable dimensions to prevent mis-clicks during dense data entry.
