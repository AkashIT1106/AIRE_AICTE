/**
 * Policy evaluation status and rule representation types.
 */
export enum EvaluationResultStatus {
  COMPLIANT = "COMPLIANT",
  VIOLATION = "VIOLATION",
  WARNING = "WARNING",
  INCONCLUSIVE = "INCONCLUSIVE",
}

export interface RuleDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  version: string;
  category: "CAPACITY" | "QUOTA" | "ELIGIBILITY" | "TIMELINE";
}

export interface RuleEvaluationInput {
  ruleId: string;
  entityId: string;
  context: Record<string, unknown>;
}

export interface RuleEvaluationOutput {
  ruleId: string;
  status: EvaluationResultStatus;
  message: string;
  details?: Record<string, unknown>;
  evaluatedAt: string;
}
