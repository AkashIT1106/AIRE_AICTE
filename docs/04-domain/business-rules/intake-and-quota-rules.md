# Intake and Quota Arithmetic Rules

| Metadata             | Value                                                                                                                                                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document             | `docs/04-domain/business-rules/intake-and-quota-rules.md`                                                                                                                                                                                                                          |
| Authoritative For    | Quota Arithmetic, Reservation Percentages, Supernumerary Formulas                                                                                                                                                                                                                  |
| Status               | `CONFIRMED`                                                                                                                                                                                                                                                                        |
| Source               | PROJECT_PLAN.md §22, §28                                                                                                                                                                                                                                                           |
| Related Requirements | [`AIRE-REQ-007`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-013`](../../00-governance/requirements-traceability.md), [`AIRE-REQ-160`](../../00-governance/requirements-traceability.md) to [`AIRE-REQ-165`](../../00-governance/requirements-traceability.md) |

---

## 1. Sanctioned Intake vs Admitted Intake

For any approved programme $P$ in academic year $Y$:

$$	ext{Total Sanctioned Intake } (S) = 	ext{Approved Regular Seats}$$

$$	ext{Total Admitted Regular Students } (A_{reg}) \le S$$

If $A_{reg} > S$, the programme is in **Over-Admission Breach** of magnitude $(A_{reg} - S)$.

---

## 2. Statutory Reservation Breakdown

Unless overridden by an institution-specific state reservation policy pack, statutory quotas are calculated as percentages of $S$:

| Category                             | Statutory Percentage       | Formula                                     | Rounding Rule         |
| ------------------------------------ | -------------------------- | ------------------------------------------- | --------------------- |
| **Scheduled Castes (SC)**            | 15.0%                      | $Q_{SC} = \lfloor S imes 0.150              |
| floor$                               | Standard legal floor       |
| **Scheduled Tribes (ST)**            | 7.5%                       | $Q_{ST} = \lfloor S imes 0.075              |
| floor$                               | Standard legal floor       |
| **Other Backward Classes (OBC-NCL)** | 27.0%                      | $Q_{OBC} = \lfloor S imes 0.270             |
| floor$                               | Central institutional norm |
| **General / Open (GEN)**             | Remainder                  | $Q_{GEN} = S - (Q_{SC} + Q_{ST} + Q_{OBC})$ | Unreserved allocation |

---

## 3. Supernumerary Seat Quotas

Supernumerary seats are allocated **over and above** the regular sanctioned intake $S$. They cannot be converted into regular seats or transferred across quotas:

### A. Economically Weaker Sections (EWS)

- **Quota:** 10% over and above sanctioned intake.
- **Formula:** $Q_{EWS} = \lceil S imes 0.10
  ceil$.
- **Condition:** Must possess verified government income & asset certificate.

### B. Tuition Fee Waiver Scheme (TFW)

- **Quota:** Up to 5% over and above sanctioned intake.
- **Formula:** $Q_{TFW} = \lceil S imes 0.05
  ceil$.
- **Condition:** Annual parental income < ₹8.00 Lakhs; strictly merit-based.

### C. Prime Minister's Special Scholarship Scheme (PMSSS / J&K)

- Allocated by central authorities; maximum quota specified in EOA.
- Cannot be filled by non-PMSSS students.

### D. Lateral Entry (Direct 2nd Year Admission)

- **Quota:** Up to 10% of approved intake in the preceding year plus unfulfilled vacant seats of the 1st year.
- **Formula:** $Q_{LE} = \lfloor S_{prev} imes 0.10
  floor + V_{1st\_year}$.
