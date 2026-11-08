import { computeFixtureEvidenceHash } from "./hashing.js";
import { evaluateCohort } from "./rules.js";
import type {
  CohortAdmissionData,
  EvaluationResultStatus,
  FixtureExecutionResult,
  PolicyTestFixtureDto,
  TestSuiteExecutionResult,
} from "./types.js";

/**
 * Execute a single synthetic policy fixture.
 */
export function runPolicyFixture(fixture: {
  id: string;
  name: string;
  inputData: Record<string, unknown>;
  expectedOutput: Record<string, unknown>;
}): FixtureExecutionResult {
  const cohort = fixture.inputData as unknown as CohortAdmissionData;
  const ruleResults = evaluateCohort(cohort);

  const hasViolation = ruleResults.some((r) => r.status === "VIOLATION");
  const actualStatus: EvaluationResultStatus = hasViolation
    ? "VIOLATION"
    : "COMPLIANT";
  const expectedStatus =
    (fixture.expectedOutput.status as EvaluationResultStatus) ?? "COMPLIANT";

  const passed = actualStatus === expectedStatus;

  return {
    fixtureId: fixture.id,
    fixtureName: fixture.name,
    passed,
    actualStatus,
    expectedStatus,
    failureReason: passed
      ? undefined
      : `Expected status ${expectedStatus} but received ${actualStatus}.`,
  };
}

/**
 * Executes a suite of fixtures and evaluates the pass rate.
 */
export function runPolicyTestSuite(
  policyPackId: string,
  fixtures: PolicyTestFixtureDto[],
): TestSuiteExecutionResult {
  if (fixtures.length === 0) {
    return {
      totalFixtures: 0,
      passedFixtures: 0,
      failedFixtures: 0,
      passRatePercentage: 100,
      allPassed: true,
      evidenceHash: computeFixtureEvidenceHash({
        policyPackId,
        timestamp: new Date().toISOString(),
        passRatePercentage: 100,
        results: [],
      }),
      fixtureResults: [],
    };
  }

  const fixtureResults = fixtures.map((f) => runPolicyFixture(f));
  const passedFixtures = fixtureResults.filter((f) => f.passed).length;
  const failedFixtures = fixtureResults.length - passedFixtures;
  const passRatePercentage = Number(
    ((passedFixtures / fixtureResults.length) * 100).toFixed(2),
  );
  const allPassed = passedFixtures === fixtureResults.length;

  const evidenceHash = computeFixtureEvidenceHash({
    policyPackId,
    timestamp: new Date().toISOString(),
    passRatePercentage,
    results: fixtureResults.map((r) => ({
      fixtureId: r.fixtureId,
      passed: r.passed,
    })),
  });

  return {
    totalFixtures: fixtures.length,
    passedFixtures,
    failedFixtures,
    passRatePercentage,
    allPassed,
    evidenceHash,
    fixtureResults,
  };
}
