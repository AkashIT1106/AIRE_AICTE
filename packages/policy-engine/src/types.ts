import type {
  EvaluationResultStatus,
  InstitutionalPenalStatus,
  PolicyPackDto,
  PolicyRuleDto,
  PolicyTestFixtureDto,
  ReplaySimulationResultDto,
  RuleCategory,
  RuleSeverity,
} from "@aire/shared-types";

export {
  EvaluationResultStatus,
  InstitutionalPenalStatus,
  PolicyPackDto,
  PolicyRuleDto,
  PolicyTestFixtureDto,
  ReplaySimulationResultDto,
  RuleCategory,
  RuleSeverity,
};

export interface CohortAdmissionData {
  academicYear: string;
  sanctionedIntake: number;
  admittedRegularCount: number;
  categories: {
    OPEN: number;
    SC: number;
    ST: number;
    OBC: number;
  };
  supernumerary: {
    EWS: number;
    TFW: number;
    lateralEntry?: number;
  };
  institutionalStatus?: InstitutionalPenalStatus;
}

export interface RuleEvaluationResult {
  ruleCode: string;
  ruleName: string;
  clauseReference: string;
  status: EvaluationResultStatus;
  message: string;
  breachMagnitude?: number;
  details?: Record<string, unknown>;
}

export interface FixtureExecutionResult {
  fixtureId: string;
  fixtureName: string;
  passed: boolean;
  actualStatus: EvaluationResultStatus;
  expectedStatus: EvaluationResultStatus;
  failureReason?: string;
}

export interface TestSuiteExecutionResult {
  totalFixtures: number;
  passedFixtures: number;
  failedFixtures: number;
  passRatePercentage: number;
  allPassed: boolean;
  evidenceHash: string;
  fixtureResults: FixtureExecutionResult[];
}
