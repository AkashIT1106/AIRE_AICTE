import { describe, expect, it } from "vitest";
import {
  computePolicyPackContentHash,
  evaluateChapterVIIPenalAction,
  evaluateIntakeCeiling,
  evaluateStatutoryReservations,
  evaluateSupernumeraryQuotas,
  runPolicyFixture,
  runPolicyTestSuite,
  simulatePolicyReplay,
} from "@aire/policy-engine";
import type {
  CohortAdmissionData,
  PolicyTestFixtureDto,
} from "@aire/policy-engine";

describe("Policy Engine: Deterministic Rule Handlers", () => {
  describe("RULE_INTAKE_CEILING", () => {
    it("returns COMPLIANT when admitted count is within sanctioned intake", () => {
      const result = evaluateIntakeCeiling(120, 115);
      expect(result.status).toBe("COMPLIANT");
      expect(result.breachMagnitude).toBeUndefined();
    });

    it("returns COMPLIANT at exact capacity", () => {
      const result = evaluateIntakeCeiling(60, 60);
      expect(result.status).toBe("COMPLIANT");
    });

    it("returns VIOLATION when admitted count exceeds sanctioned intake", () => {
      const result = evaluateIntakeCeiling(100, 105);
      expect(result.status).toBe("VIOLATION");
      expect(result.breachMagnitude).toBe(5);
      expect(result.clauseReference).toContain("Section 2.4");
    });
  });

  describe("RULE_STATUTORY_RESERVATION", () => {
    it("computes standard floor rounding for SC (15%), ST (7.5%), OBC (27%) and Open remainder", () => {
      // S = 100: SC = floor(15) = 15, ST = floor(7.5) = 7, OBC = floor(27) = 27, Open = 100 - (15+7+27) = 51
      const compliantCategories = { OPEN: 50, SC: 15, ST: 7, OBC: 27 };
      const result = evaluateStatutoryReservations(100, compliantCategories);
      expect(result.status).toBe("COMPLIANT");
    });

    it("detects breach when SC admissions exceed statutory quota", () => {
      const breachedCategories = { OPEN: 40, SC: 18, ST: 7, OBC: 25 };
      const result = evaluateStatutoryReservations(100, breachedCategories);
      expect(result.status).toBe("VIOLATION");
      expect(result.message).toContain(
        "SC admissions (18) exceed quota limit (15)",
      );
    });

    it("detects breach when ST admissions exceed statutory quota", () => {
      const breachedCategories = { OPEN: 40, SC: 14, ST: 9, OBC: 25 };
      const result = evaluateStatutoryReservations(100, breachedCategories);
      expect(result.status).toBe("VIOLATION");
      expect(result.message).toContain(
        "ST admissions (9) exceed quota limit (7)",
      );
    });
  });

  describe("RULE_SUPERNUMERARY_QUOTA", () => {
    it("computes ceiling rounding for EWS (10%) and TFW (5%)", () => {
      // S = 60: EWS = ceil(6) = 6, TFW = ceil(3) = 3, Lateral = floor(6) = 6
      const compliantSupernumerary = { EWS: 6, TFW: 3, lateralEntry: 5 };
      const result = evaluateSupernumeraryQuotas(60, compliantSupernumerary);
      expect(result.status).toBe("COMPLIANT");
    });

    it("detects violation when EWS exceeds ceiling", () => {
      const breachedSupernumerary = { EWS: 8, TFW: 3, lateralEntry: 5 };
      const result = evaluateSupernumeraryQuotas(60, breachedSupernumerary);
      expect(result.status).toBe("VIOLATION");
      expect(result.message).toContain(
        "EWS enrollments (8) exceed 10% ceiling (6)",
      );
    });

    it("detects violation when TFW exceeds ceiling", () => {
      const breachedSupernumerary = { EWS: 5, TFW: 5, lateralEntry: 5 };
      const result = evaluateSupernumeraryQuotas(60, breachedSupernumerary);
      expect(result.status).toBe("VIOLATION");
      expect(result.message).toContain(
        "TFW enrollments (5) exceed 5% ceiling (3)",
      );
    });
  });

  describe("RULE_CHAPTER_VII_PENAL_ACTION", () => {
    it("flags any admissions under NO_ADMISSION status as severe violation", () => {
      const result = evaluateChapterVIIPenalAction("NO_ADMISSION", 10);
      expect(result.status).toBe("VIOLATION");
      expect(result.message).toContain("NO_ADMISSION");
      expect(result.clauseReference).toContain("Chapter VII");
    });

    it("flags any admissions under WITHDRAWAL_OF_APPROVAL as violation", () => {
      const result = evaluateChapterVIIPenalAction(
        "WITHDRAWAL_OF_APPROVAL",
        25,
      );
      expect(result.status).toBe("VIOLATION");
      expect(result.message).toContain("WITHDRAWN");
    });

    it("flags breach when admissions exceed curtailed intake under REDUCED_INTAKE", () => {
      const result = evaluateChapterVIIPenalAction("REDUCED_INTAKE", 45, 30);
      expect(result.status).toBe("VIOLATION");
      expect(result.breachMagnitude).toBe(15);
    });

    it("passes when status is APPROVED or RESTORATION", () => {
      expect(evaluateChapterVIIPenalAction("APPROVED", 60).status).toBe(
        "COMPLIANT",
      );
      expect(evaluateChapterVIIPenalAction("RESTORATION", 60).status).toBe(
        "COMPLIANT",
      );
    });
  });
});

describe("Policy Engine: Hashing & Fixture Runner", () => {
  it("computes deterministic SHA-256 hash regardless of rule insertion order", () => {
    const packA = {
      code: "APH-2026-V1",
      academicYear: "2026-27",
      edition: "1.0",
      rules: [
        {
          code: "RULE_B",
          category: "QUOTA",
          clauseReference: "2.1",
          parameters: { val: 1 },
        },
        {
          code: "RULE_A",
          category: "CAPACITY",
          clauseReference: "1.1",
          parameters: { val: 2 },
        },
      ],
    };

    const packB = {
      code: "APH-2026-V1",
      academicYear: "2026-27",
      edition: "1.0",
      rules: [
        {
          code: "RULE_A",
          category: "CAPACITY",
          clauseReference: "1.1",
          parameters: { val: 2 },
        },
        {
          code: "RULE_B",
          category: "QUOTA",
          clauseReference: "2.1",
          parameters: { val: 1 },
        },
      ],
    };

    const hashA = computePolicyPackContentHash(packA);
    const hashB = computePolicyPackContentHash(packB);
    expect(hashA).toBe(hashB);
    expect(hashA).toHaveLength(64);
  });

  it("executes synthetic test fixture accurately", () => {
    const fixture = {
      id: "fix-1",
      name: "Standard 60-seat compliant cohort",
      inputData: {
        academicYear: "2026-27",
        sanctionedIntake: 60,
        admittedRegularCount: 58,
        categories: { OPEN: 29, SC: 9, ST: 4, OBC: 16 },
        supernumerary: { EWS: 6, TFW: 3 },
        institutionalStatus: "APPROVED",
      },
      expectedOutput: {
        status: "COMPLIANT",
      },
    };

    const execution = runPolicyFixture(fixture);
    expect(execution.passed).toBe(true);
    expect(execution.actualStatus).toBe("COMPLIANT");
  });

  it("calculates 100% pass rate and evidence hash on clean fixture suite", () => {
    const fixtures: PolicyTestFixtureDto[] = [
      {
        id: "fix-1",
        policyPackId: "pack-1",
        name: "Compliant cohort",
        inputData: {
          academicYear: "2026-27",
          sanctionedIntake: 100,
          admittedRegularCount: 95,
          categories: { OPEN: 48, SC: 15, ST: 7, OBC: 25 },
          supernumerary: { EWS: 10, TFW: 5 },
          institutionalStatus: "APPROVED",
        },
        expectedOutput: { status: "COMPLIANT" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "fix-2",
        policyPackId: "pack-1",
        name: "Over-admission cohort",
        inputData: {
          academicYear: "2026-27",
          sanctionedIntake: 100,
          admittedRegularCount: 110,
          categories: { OPEN: 55, SC: 17, ST: 8, OBC: 30 },
          supernumerary: { EWS: 10, TFW: 5 },
          institutionalStatus: "APPROVED",
        },
        expectedOutput: { status: "VIOLATION" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const suite = runPolicyTestSuite("pack-1", fixtures);
    expect(suite.totalFixtures).toBe(2);
    expect(suite.passedFixtures).toBe(2);
    expect(suite.passRatePercentage).toBe(100);
    expect(suite.allPassed).toBe(true);
    expect(suite.evidenceHash).toHaveLength(64);
  });
});

describe("Policy Engine: Temporal Replay Simulator", () => {
  it("evaluates historical cohort and produces structured comparative metrics", () => {
    const cohort: CohortAdmissionData = {
      academicYear: "2024-25",
      sanctionedIntake: 120,
      admittedRegularCount: 130, // Over-admission by 10
      categories: { OPEN: 65, SC: 20, ST: 10, OBC: 35 },
      supernumerary: { EWS: 15, TFW: 8 },
      institutionalStatus: "APPROVED",
    };

    const simulation = simulatePolicyReplay(
      { id: "pack-sim", code: "AICTE-APH-2026-27-V1.0" },
      cohort,
    );

    expect(simulation.headcountEvaluated).toBe(130);
    expect(simulation.overallStatus).toBe("VIOLATION");
    expect(simulation.summary.violationCount).toBeGreaterThan(0);
    const intakeBreach = simulation.ruleResults.find(
      (r) => r.ruleCode === "RULE_INTAKE_CEILING",
    );
    expect(intakeBreach?.breachMagnitude).toBe(10);
  });
});
