import { evaluateCohort } from "./rules.js";
import type {
  CohortAdmissionData,
  EvaluationResultStatus,
  ReplaySimulationResultDto,
} from "./types.js";

/**
 * Runs a deterministic temporal replay simulation against a cohort.
 */
export function simulatePolicyReplay(
  policyPack: { id: string; code: string },
  cohort: CohortAdmissionData,
): ReplaySimulationResultDto {
  const ruleResults = evaluateCohort(cohort);

  let compliantCount = 0;
  let violationCount = 0;
  let warningCount = 0;

  for (const r of ruleResults) {
    if (r.status === "COMPLIANT") compliantCount++;
    else if (r.status === "VIOLATION") violationCount++;
    else if (r.status === "WARNING") warningCount++;
  }

  const overallStatus: EvaluationResultStatus =
    violationCount > 0
      ? "VIOLATION"
      : warningCount > 0
        ? "WARNING"
        : "COMPLIANT";

  return {
    policyPackId: policyPack.id,
    policyCode: policyPack.code,
    evaluatedAt: new Date().toISOString(),
    headcountEvaluated: cohort.admittedRegularCount,
    overallStatus,
    ruleResults: ruleResults.map((r) => ({
      ruleCode: r.ruleCode,
      ruleName: r.ruleName,
      clauseReference: r.clauseReference,
      status: r.status,
      message: r.message,
      breachMagnitude: r.breachMagnitude,
      details: r.details,
    })),
    summary: {
      compliantCount,
      violationCount,
      warningCount,
    },
  };
}
