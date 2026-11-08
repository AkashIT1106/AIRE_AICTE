import type {
  CohortAdmissionData,
  EvaluationResultStatus,
  InstitutionalPenalStatus,
  RuleEvaluationResult,
} from "./types.js";

/**
 * Standard AICTE Intake Ceiling Evaluation (APH Section 2.4).
 * Admitted regular students must not exceed approved sanctioned intake.
 */
export function evaluateIntakeCeiling(
  sanctionedIntake: number,
  admittedRegularCount: number,
): RuleEvaluationResult {
  const code = "RULE_INTAKE_CEILING";
  const name = "Approved Sanctioned Intake Ceiling";
  const clauseReference = "AICTE APH Section 2.4";

  if (admittedRegularCount > sanctionedIntake) {
    const breachMagnitude = admittedRegularCount - sanctionedIntake;
    return {
      ruleCode: code,
      ruleName: name,
      clauseReference,
      status: "VIOLATION" as EvaluationResultStatus,
      message: `Over-admission breach: Admitted regular students (${admittedRegularCount}) exceed sanctioned intake (${sanctionedIntake}) by ${breachMagnitude} seats.`,
      breachMagnitude,
      details: {
        sanctionedIntake,
        admittedRegularCount,
        overAdmissionCount: breachMagnitude,
      },
    };
  }

  return {
    ruleCode: code,
    ruleName: name,
    clauseReference,
    status: "COMPLIANT" as EvaluationResultStatus,
    message: `Admitted enrollment (${admittedRegularCount}/${sanctionedIntake}) complies with sanctioned intake ceiling.`,
    details: {
      sanctionedIntake,
      admittedRegularCount,
      utilizationRate:
        sanctionedIntake > 0
          ? Number(((admittedRegularCount / sanctionedIntake) * 100).toFixed(2))
          : 0,
    },
  };
}

/**
 * Statutory Reservation Quota Evaluation (APH Section 2.8).
 * Quotas computed via statutory percentages with standard floor rounding:
 * - SC: floor(S * 0.150)
 * - ST: floor(S * 0.075)
 * - OBC-NCL: floor(S * 0.270)
 * - Open/GEN: Remainder of S
 */
export function evaluateStatutoryReservations(
  sanctionedIntake: number,
  categories: CohortAdmissionData["categories"],
): RuleEvaluationResult {
  const code = "RULE_STATUTORY_RESERVATION";
  const name = "Statutory Category Reservation Breakdown";
  const clauseReference = "AICTE APH Section 2.8";

  const scLimit = Math.floor(sanctionedIntake * 0.15);
  const stLimit = Math.floor(sanctionedIntake * 0.075);
  const obcLimit = Math.floor(sanctionedIntake * 0.27);
  const openLimit = sanctionedIntake - (scLimit + stLimit + obcLimit);

  const breaches: string[] = [];
  if (categories.SC > scLimit) {
    breaches.push(
      `SC admissions (${categories.SC}) exceed quota limit (${scLimit})`,
    );
  }
  if (categories.ST > stLimit) {
    breaches.push(
      `ST admissions (${categories.ST}) exceed quota limit (${stLimit})`,
    );
  }
  if (categories.OBC > obcLimit) {
    breaches.push(
      `OBC admissions (${categories.OBC}) exceed quota limit (${obcLimit})`,
    );
  }
  if (categories.OPEN > openLimit) {
    breaches.push(
      `Open admissions (${categories.OPEN}) exceed unreserved capacity (${openLimit})`,
    );
  }

  if (breaches.length > 0) {
    return {
      ruleCode: code,
      ruleName: name,
      clauseReference,
      status: "VIOLATION" as EvaluationResultStatus,
      message: `Reservation quota breaches detected: ${breaches.join("; ")}`,
      details: {
        limits: { SC: scLimit, ST: stLimit, OBC: obcLimit, OPEN: openLimit },
        admitted: categories,
      },
    };
  }

  return {
    ruleCode: code,
    ruleName: name,
    clauseReference,
    status: "COMPLIANT" as EvaluationResultStatus,
    message:
      "Category seat distributions strictly comply with statutory reservation thresholds.",
    details: {
      limits: { SC: scLimit, ST: stLimit, OBC: obcLimit, OPEN: openLimit },
      admitted: categories,
    },
  };
}

/**
 * Supernumerary Quota Evaluation (APH Chapter II / Section 2.9).
 * Supernumerary seats are over and above sanctioned intake with ceiling rounding:
 * - EWS: ceil(S * 0.10)
 * - TFW: ceil(S * 0.05)
 * - Lateral Entry: floor(S * 0.10)
 */
export function evaluateSupernumeraryQuotas(
  sanctionedIntake: number,
  supernumerary: CohortAdmissionData["supernumerary"],
): RuleEvaluationResult {
  const code = "RULE_SUPERNUMERARY_QUOTA";
  const name = "Supernumerary Seat Allocation Ceiling";
  const clauseReference = "AICTE APH Section 2.9 & Chapter II";

  const ewsLimit = Math.ceil(sanctionedIntake * 0.1);
  const tfwLimit = Math.ceil(sanctionedIntake * 0.05);
  const lateralLimit = Math.floor(sanctionedIntake * 0.1);

  const breaches: string[] = [];
  if (supernumerary.EWS > ewsLimit) {
    breaches.push(
      `EWS enrollments (${supernumerary.EWS}) exceed 10% ceiling (${ewsLimit})`,
    );
  }
  if (supernumerary.TFW > tfwLimit) {
    breaches.push(
      `TFW enrollments (${supernumerary.TFW}) exceed 5% ceiling (${tfwLimit})`,
    );
  }
  if (
    supernumerary.lateralEntry !== undefined &&
    supernumerary.lateralEntry > lateralLimit
  ) {
    breaches.push(
      `Lateral Entry admissions (${supernumerary.lateralEntry}) exceed 10% ceiling (${lateralLimit})`,
    );
  }

  if (breaches.length > 0) {
    return {
      ruleCode: code,
      ruleName: name,
      clauseReference,
      status: "VIOLATION" as EvaluationResultStatus,
      message: `Supernumerary ceiling exceeded: ${breaches.join("; ")}`,
      details: {
        limits: { EWS: ewsLimit, TFW: tfwLimit, lateralEntry: lateralLimit },
        admitted: supernumerary,
      },
    };
  }

  return {
    ruleCode: code,
    ruleName: name,
    clauseReference,
    status: "COMPLIANT" as EvaluationResultStatus,
    message:
      "Supernumerary seat allocations comply with EWS, TFW, and Lateral Entry ceilings.",
    details: {
      limits: { EWS: ewsLimit, TFW: tfwLimit, lateralEntry: lateralLimit },
      admitted: supernumerary,
    },
  };
}

/**
 * Institutional Penal Action Evaluation (APH Chapter VII).
 * Validates whether admissions are lawful given the institution's official AICTE regulatory status.
 */
export function evaluateChapterVIIPenalAction(
  status: InstitutionalPenalStatus = "APPROVED",
  admittedCount: number,
  curtailedIntake?: number,
): RuleEvaluationResult {
  const code = "RULE_CHAPTER_VII_PENAL_ACTION";
  const name = "Regulatory Compliance & Penal Sanctions Review";
  const clauseReference = "AICTE APH Chapter VII";

  if (status === "NO_ADMISSION" && admittedCount > 0) {
    return {
      ruleCode: code,
      ruleName: name,
      clauseReference,
      status: "VIOLATION" as EvaluationResultStatus,
      message: `Institution is under NO_ADMISSION status under APH Chapter VII. All ${admittedCount} student admissions are illegal.`,
      breachMagnitude: admittedCount,
      details: { status, admittedCount },
    };
  }

  if (status === "WITHDRAWAL_OF_APPROVAL" && admittedCount > 0) {
    return {
      ruleCode: code,
      ruleName: name,
      clauseReference,
      status: "VIOLATION" as EvaluationResultStatus,
      message: `AICTE approval has been WITHDRAWN under APH Chapter VII. Admitted enrollment of ${admittedCount} is prohibited.`,
      breachMagnitude: admittedCount,
      details: { status, admittedCount },
    };
  }

  if (
    status === "REDUCED_INTAKE" &&
    curtailedIntake !== undefined &&
    admittedCount > curtailedIntake
  ) {
    const breachMagnitude = admittedCount - curtailedIntake;
    return {
      ruleCode: code,
      ruleName: name,
      clauseReference,
      status: "VIOLATION" as EvaluationResultStatus,
      message: `Institution is under REDUCED_INTAKE penalty. Admissions (${admittedCount}) exceed curtailed quota (${curtailedIntake}) by ${breachMagnitude} seats.`,
      breachMagnitude,
      details: { status, admittedCount, curtailedIntake },
    };
  }

  return {
    ruleCode: code,
    ruleName: name,
    clauseReference,
    status: "COMPLIANT" as EvaluationResultStatus,
    message: `Institution holds valid operational status (${status}) under AICTE APH Chapter VII.`,
    details: { status, admittedCount },
  };
}

/**
 * Evaluate all core rules against cohort data.
 */
export function evaluateCohort(
  cohort: CohortAdmissionData,
): RuleEvaluationResult[] {
  const results: RuleEvaluationResult[] = [];

  // 1. Intake ceiling
  results.push(
    evaluateIntakeCeiling(cohort.sanctionedIntake, cohort.admittedRegularCount),
  );

  // 2. Statutory reservations
  results.push(
    evaluateStatutoryReservations(cohort.sanctionedIntake, cohort.categories),
  );

  // 3. Supernumerary
  results.push(
    evaluateSupernumeraryQuotas(cohort.sanctionedIntake, cohort.supernumerary),
  );

  // 4. Chapter VII penal actions
  results.push(
    evaluateChapterVIIPenalAction(
      cohort.institutionalStatus ?? "APPROVED",
      cohort.admittedRegularCount,
    ),
  );

  return results;
}
