import { getPrismaClient } from "../config/database.js";
import {
  computePolicyPackContentHash,
  runPolicyTestSuite,
  simulatePolicyReplay,
} from "@aire/policy-engine";
import type {
  CreatePolicyFixtureInput,
  CreatePolicyPackInput,
  CreatePolicyRuleInput,
  ReplaySimulationInput,
} from "@aire/validation";
import type {
  PolicyPackDto,
  PolicyPackStatus,
  PolicyRuleDto,
  PolicyTestFixtureDto,
  ReplaySimulationResultDto,
} from "@aire/shared-types";
import { logAuditEvent } from "./audit.service.js";

export class PolicyRegistryService {
  /**
   * Lists all policy packs, optionally filtered by academic year or status.
   */
  static async listPolicyPacks(filters: {
    academicYear?: string;
    status?: PolicyPackStatus;
    stateCode?: string;
  }): Promise<PolicyPackDto[]> {
    const prisma = getPrismaClient();

    const where: Record<string, unknown> = {};
    if (filters.academicYear) where.academicYear = filters.academicYear;
    if (filters.status) where.status = filters.status;
    if (filters.stateCode !== undefined) where.stateCode = filters.stateCode;

    const packs = await prisma.policyPack.findMany({
      where,
      include: {
        rules: true,
        fixtures: true,
        activationSignoffs: true,
      },
      orderBy: [{ academicYear: "desc" }, { createdAt: "desc" }],
    });

    return packs.map((p) => this.mapPackToDto(p));
  }

  /**
   * Retrieves a single policy pack with its rules, fixtures, and signoffs.
   */
  static async getPolicyPackById(id: string): Promise<PolicyPackDto | null> {
    const prisma = getPrismaClient();

    const pack = await prisma.policyPack.findUnique({
      where: { id },
      include: {
        rules: true,
        fixtures: true,
        activationSignoffs: true,
      },
    });

    return pack ? this.mapPackToDto(pack) : null;
  }

  /**
   * Creates a new policy pack in DRAFT status.
   */
  static async createPolicyPack(
    input: CreatePolicyPackInput,
    authorId: string,
    context: { correlationId: string },
  ): Promise<PolicyPackDto> {
    const prisma = getPrismaClient();

    // Verify code uniqueness
    const existing = await prisma.policyPack.findUnique({
      where: { code: input.code },
    });
    if (existing) {
      throw new Error(
        `POLICY_CODE_EXISTS: A policy pack with code '${input.code}' already exists`,
      );
    }

    const initialHash = computePolicyPackContentHash({
      code: input.code,
      academicYear: input.academicYear,
      edition: input.edition || "1.0",
      stateCode: input.stateCode,
      rules: [],
    });

    const pack = await prisma.policyPack.create({
      data: {
        code: input.code,
        name: input.name,
        academicYear: input.academicYear,
        edition: input.edition || "1.0",
        status: "DRAFT",
        stateCode: input.stateCode,
        contentHash: initialHash,
        authorId,
        effectiveFrom: input.effectiveFrom
          ? new Date(input.effectiveFrom)
          : null,
        effectiveTo: input.effectiveTo ? new Date(input.effectiveTo) : null,
      },
      include: {
        rules: true,
        fixtures: true,
        activationSignoffs: true,
      },
    });

    await logAuditEvent({
      severity: "info",
      correlationId: context.correlationId,
      actorId: authorId,
      action: "POLICY_PACK_CREATED",
      resourceType: "PolicyPack",
      resourceId: pack.id,
      status: "SUCCESS",
      metadata: {
        code: pack.code,
        academicYear: pack.academicYear,
        status: pack.status,
      },
    });

    return this.mapPackToDto(pack);
  }

  /**
   * Adds a declarative evaluation rule to a DRAFT policy pack.
   */
  static async addRuleToPack(
    policyPackId: string,
    input: CreatePolicyRuleInput,
    actorId: string,
    context: { correlationId: string },
  ): Promise<PolicyRuleDto> {
    const prisma = getPrismaClient();

    const pack = await prisma.policyPack.findUnique({
      where: { id: policyPackId },
      include: { rules: true },
    });
    if (!pack) {
      throw new Error(
        "POLICY_PACK_NOT_FOUND: The requested policy pack does not exist",
      );
    }

    if (pack.status !== "DRAFT") {
      throw new Error(
        `IMMUTABLE_POLICY_ERROR: Cannot add rules to policy pack in '${pack.status}' status. Only DRAFT packs can be modified.`,
      );
    }

    const rule = await prisma.policyRule.create({
      data: {
        policyPackId,
        code: input.code,
        name: input.name,
        category: input.category,
        clauseReference: input.clauseReference,
        description: input.description,
        severity: input.severity,
        parameters: input.parameters as object,
      },
    });

    // Update pack content hash
    const updatedRules = [...pack.rules, rule];
    const newHash = computePolicyPackContentHash({
      code: pack.code,
      academicYear: pack.academicYear,
      edition: pack.edition,
      stateCode: pack.stateCode,
      rules: updatedRules.map((r) => ({
        code: r.code,
        category: r.category,
        clauseReference: r.clauseReference,
        severity: r.severity,
        parameters: r.parameters,
      })),
    });

    await prisma.policyPack.update({
      where: { id: policyPackId },
      data: { contentHash: newHash },
    });

    await logAuditEvent({
      severity: "info",
      correlationId: context.correlationId,
      actorId,
      action: "POLICY_RULE_ADDED",
      resourceType: "PolicyRule",
      resourceId: rule.id,
      status: "SUCCESS",
      metadata: {
        policyPackId,
        ruleCode: rule.code,
        clauseReference: rule.clauseReference,
      },
    });

    return this.mapRuleToDto(rule);
  }

  /**
   * Adds a synthetic test fixture to a policy pack.
   */
  static async addFixtureToPack(
    policyPackId: string,
    input: CreatePolicyFixtureInput,
    actorId: string,
    context: { correlationId: string },
  ): Promise<PolicyTestFixtureDto> {
    const prisma = getPrismaClient();

    const pack = await prisma.policyPack.findUnique({
      where: { id: policyPackId },
    });
    if (!pack) {
      throw new Error(
        "POLICY_PACK_NOT_FOUND: The requested policy pack does not exist",
      );
    }

    if (pack.status !== "DRAFT") {
      throw new Error(
        `IMMUTABLE_POLICY_ERROR: Cannot add fixtures to policy pack in '${pack.status}' status`,
      );
    }

    const fixture = await prisma.policyTestFixture.create({
      data: {
        policyPackId,
        name: input.name,
        description: input.description,
        inputData: input.inputData as object,
        expectedOutput: input.expectedOutput as object,
      },
    });

    await logAuditEvent({
      severity: "info",
      correlationId: context.correlationId,
      actorId,
      action: "POLICY_FIXTURE_ADDED",
      resourceType: "PolicyTestFixture",
      resourceId: fixture.id,
      status: "SUCCESS",
      metadata: { policyPackId, fixtureName: fixture.name },
    });

    return this.mapFixtureToDto(fixture);
  }

  /**
   * Executes all test fixtures associated with a policy pack.
   */
  static async runPackFixtures(
    policyPackId: string,
    actorId: string,
    context: { correlationId: string },
  ) {
    const prisma = getPrismaClient();

    const pack = await prisma.policyPack.findUnique({
      where: { id: policyPackId },
      include: { fixtures: true },
    });
    if (!pack) {
      throw new Error(
        "POLICY_PACK_NOT_FOUND: The requested policy pack does not exist",
      );
    }

    const fixturesDto = pack.fixtures.map((f) => this.mapFixtureToDto(f));
    const suiteResult = runPolicyTestSuite(policyPackId, fixturesDto);

    // Update last run status on each fixture
    for (const res of suiteResult.fixtureResults) {
      await prisma.policyTestFixture.update({
        where: { id: res.fixtureId },
        data: {
          lastRunStatus: res.passed ? "PASSED" : "FAILED",
          lastRunAt: new Date(),
        },
      });
    }

    await logAuditEvent({
      severity: suiteResult.allPassed ? "info" : "warn",
      correlationId: context.correlationId,
      actorId,
      action: "POLICY_FIXTURES_EXECUTED",
      resourceType: "PolicyPack",
      resourceId: policyPackId,
      status: suiteResult.allPassed ? "SUCCESS" : "FAILURE",
      metadata: {
        totalFixtures: suiteResult.totalFixtures,
        passedFixtures: suiteResult.passedFixtures,
        passRatePercentage: suiteResult.passRatePercentage,
        evidenceHash: suiteResult.evidenceHash,
      },
    });

    return suiteResult;
  }

  /**
   * Submits a DRAFT policy pack for council review (AICTE Executive Committee).
   * Enforces 100% fixture pass rate requirement.
   */
  static async submitPackForCouncilReview(
    policyPackId: string,
    actorId: string,
    context: { correlationId: string },
  ): Promise<PolicyPackDto> {
    const prisma = getPrismaClient();

    const pack = await prisma.policyPack.findUnique({
      where: { id: policyPackId },
      include: { rules: true, fixtures: true },
    });
    if (!pack) {
      throw new Error(
        "POLICY_PACK_NOT_FOUND: The requested policy pack does not exist",
      );
    }

    if (pack.status !== "DRAFT") {
      throw new Error(
        `INVALID_STATE_TRANSITION: Cannot submit pack in '${pack.status}' status. Only DRAFT packs can be submitted for review.`,
      );
    }

    // Run fixtures to verify 100% pass threshold
    const fixturesDto = pack.fixtures.map((f) => this.mapFixtureToDto(f));
    const suiteResult = runPolicyTestSuite(policyPackId, fixturesDto);
    if (!suiteResult.allPassed) {
      throw new Error(
        `FIXTURE_VALIDATION_FAILED: Policy pack has failing fixtures (${suiteResult.passedFixtures}/${suiteResult.totalFixtures} passed). 100% pass rate required for review submission.`,
      );
    }

    const updated = await prisma.policyPack.update({
      where: { id: policyPackId },
      data: { status: "COUNCIL_REVIEW" },
      include: {
        rules: true,
        fixtures: true,
        activationSignoffs: true,
      },
    });

    await logAuditEvent({
      severity: "info",
      correlationId: context.correlationId,
      actorId,
      action: "POLICY_PACK_SUBMITTED_COUNCIL_REVIEW",
      resourceType: "PolicyPack",
      resourceId: policyPackId,
      status: "SUCCESS",
      metadata: {
        code: updated.code,
        previousStatus: "DRAFT",
        newStatus: "COUNCIL_REVIEW",
        evidenceHash: suiteResult.evidenceHash,
      },
    });

    return this.mapPackToDto(updated);
  }

  /**
   * Activates a policy pack into IN_FORCE status under official Gazette Notification.
   * Enforces dual-authorization separation of duties (reviewerId !== authorId).
   */
  static async activatePolicyPack(
    policyPackId: string,
    reviewerId: string,
    input: {
      gazetteNotificationNumber: string;
      signoffNotes?: string | null;
      stepUpVerifiedAt: Date;
    },
    context: { correlationId: string },
  ): Promise<PolicyPackDto> {
    const prisma = getPrismaClient();

    const pack = await prisma.policyPack.findUnique({
      where: { id: policyPackId },
      include: { rules: true, fixtures: true },
    });
    if (!pack) {
      throw new Error(
        "POLICY_PACK_NOT_FOUND: The requested policy pack does not exist",
      );
    }

    if (pack.status !== "COUNCIL_REVIEW") {
      throw new Error(
        `INVALID_STATE_TRANSITION: Cannot activate pack in '${pack.status}' status. Must be in COUNCIL_REVIEW status.`,
      );
    }

    // Separation of duties check
    if (pack.authorId === reviewerId) {
      throw new Error(
        "SEPARATION_OF_DUTIES_VIOLATION: Policy author cannot execute activation sign-off. Secondary AICTE administrator review required.",
      );
    }

    // Re-verify fixtures pass rate
    const fixturesDto = pack.fixtures.map((f) => this.mapFixtureToDto(f));
    const suiteResult = runPolicyTestSuite(policyPackId, fixturesDto);
    if (!suiteResult.allPassed) {
      throw new Error(
        "FIXTURE_VALIDATION_FAILED: Fixture tests failed during activation verification.",
      );
    }

    const activatedPack = await prisma.$transaction(async (tx) => {
      // Find currently active pack for this academic cycle to supersede
      const currentActive = await tx.policyPack.findFirst({
        where: {
          academicYear: pack.academicYear,
          status: "IN_FORCE",
          stateCode: pack.stateCode,
        },
      });

      // Record activation sign-off
      await tx.policyActivationSignoff.create({
        data: {
          policyPackId,
          reviewerId,
          gazetteNotificationNumber: input.gazetteNotificationNumber,
          stepUpVerifiedAt: input.stepUpVerifiedAt,
          fixtureRunEvidenceHash: suiteResult.evidenceHash,
          signoffNotes: input.signoffNotes,
        },
      });

      // Transition pack to IN_FORCE
      const inForcePack = await tx.policyPack.update({
        where: { id: policyPackId },
        data: {
          status: "IN_FORCE",
          gazetteReference: input.gazetteNotificationNumber,
          effectiveFrom: new Date(),
        },
        include: {
          rules: true,
          fixtures: true,
          activationSignoffs: true,
        },
      });

      // Supersede previous active pack if present
      if (currentActive && currentActive.id !== policyPackId) {
        await tx.policyPack.update({
          where: { id: currentActive.id },
          data: {
            status: "SUPERSEDED",
            supersededById: policyPackId,
            effectiveTo: new Date(),
          },
        });
      }

      return inForcePack;
    });

    await logAuditEvent({
      severity: "info",
      correlationId: context.correlationId,
      actorId: reviewerId,
      action: "POLICY_PACK_ACTIVATED",
      resourceType: "PolicyPack",
      resourceId: policyPackId,
      status: "SUCCESS",
      metadata: {
        code: activatedPack.code,
        gazetteNotificationNumber: input.gazetteNotificationNumber,
        newStatus: "IN_FORCE",
      },
    });

    return this.mapPackToDto(activatedPack);
  }

  /**
   * Executes a temporal regulatory replay simulation without mutating database records.
   */
  static async simulateReplay(
    input: ReplaySimulationInput,
    actorId: string,
    context: { correlationId: string },
  ): Promise<ReplaySimulationResultDto> {
    const prisma = getPrismaClient();

    const targetPack = await prisma.policyPack.findUnique({
      where: { id: input.policyPackId },
    });
    if (!targetPack) {
      throw new Error(
        "POLICY_PACK_NOT_FOUND: Target policy pack for replay does not exist",
      );
    }

    const simulation = simulatePolicyReplay(
      { id: targetPack.id, code: targetPack.code },
      input.cohort,
    );

    await logAuditEvent({
      severity: "info",
      correlationId: context.correlationId,
      actorId,
      action: "POLICY_REPLAY_EXECUTED",
      resourceType: "PolicyPack",
      resourceId: targetPack.id,
      status: "SUCCESS",
      metadata: {
        policyCode: targetPack.code,
        headcountEvaluated: simulation.headcountEvaluated,
        overallStatus: simulation.overallStatus,
      },
    });

    return simulation;
  }

  private static mapPackToDto(pack: any): PolicyPackDto {
    return {
      id: pack.id,
      code: pack.code,
      name: pack.name,
      academicYear: pack.academicYear,
      edition: pack.edition,
      status: pack.status as PolicyPackStatus,
      stateCode: pack.stateCode,
      gazetteReference: pack.gazetteReference,
      contentHash: pack.contentHash,
      authorId: pack.authorId,
      effectiveFrom: pack.effectiveFrom?.toISOString() ?? null,
      effectiveTo: pack.effectiveTo?.toISOString() ?? null,
      supersededById: pack.supersededById,
      parentPackId: pack.parentPackId,
      rules: pack.rules?.map((r: any) => this.mapRuleToDto(r)),
      fixtures: pack.fixtures?.map((f: any) => this.mapFixtureToDto(f)),
      activationSignoffs: pack.activationSignoffs?.map((s: any) => ({
        id: s.id,
        policyPackId: s.policyPackId,
        reviewerId: s.reviewerId,
        gazetteNotificationNumber: s.gazetteNotificationNumber,
        stepUpVerifiedAt: s.stepUpVerifiedAt.toISOString(),
        fixtureRunEvidenceHash: s.fixtureRunEvidenceHash,
        signoffNotes: s.signoffNotes,
        activatedAt: s.activatedAt.toISOString(),
      })),
      createdAt: pack.createdAt.toISOString(),
      updatedAt: pack.updatedAt.toISOString(),
    };
  }

  private static mapRuleToDto(rule: any): PolicyRuleDto {
    return {
      id: rule.id,
      policyPackId: rule.policyPackId,
      code: rule.code,
      name: rule.name,
      category: rule.category,
      clauseReference: rule.clauseReference,
      description: rule.description,
      severity: rule.severity,
      parameters: rule.parameters as Record<string, unknown>,
      createdAt: rule.createdAt.toISOString(),
      updatedAt: rule.updatedAt.toISOString(),
    };
  }

  private static mapFixtureToDto(fixture: any): PolicyTestFixtureDto {
    return {
      id: fixture.id,
      policyPackId: fixture.policyPackId,
      name: fixture.name,
      description: fixture.description,
      inputData: fixture.inputData as Record<string, unknown>,
      expectedOutput: fixture.expectedOutput as Record<string, unknown>,
      lastRunStatus: fixture.lastRunStatus,
      lastRunAt: fixture.lastRunAt?.toISOString() ?? null,
      createdAt: fixture.createdAt.toISOString(),
      updatedAt: fixture.updatedAt.toISOString(),
    };
  }
}
