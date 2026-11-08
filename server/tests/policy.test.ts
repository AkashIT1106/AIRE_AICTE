import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { getPrismaClient, disconnectDatabase } from "../src/config/database.js";
import { UserRole } from "@aire/authorization";

describe("Phase 4: Regulatory Policy Registry & Rule Engine (Module M04)", () => {
  const app = createApp();
  const prisma = getPrismaClient();

  const timestamp = Date.now();
  let authorId: string;
  let authorCookie: string[];

  let reviewerId: string;
  let reviewerCookie: string[];

  let nonAdminCookie: string[];

  let policyPackId: string;
  const policyCode = `AICTE-APH-2026-TEST-${timestamp}`;

  beforeAll(async () => {
    async function registerUser(
      email: string,
      name: string,
    ): Promise<[string, string[]]> {
      const res = await request(app).post("/api/auth/sign-up/email").send({
        email,
        password: "Password123!Secure",
        name,
      });
      return [res.body.user.id, res.headers["set-cookie"]];
    }

    // 1. Author Admin (AICTE_ADMIN)
    const [u1Id, u1Cookie] = await registerUser(
      `policy_author_${timestamp}@aicte.gov.in`,
      "Dr. Policy Author",
    );
    authorId = u1Id;
    authorCookie = u1Cookie;
    await prisma.platformUserRole.create({
      data: { userId: authorId, role: UserRole.AICTE_ADMIN, status: "ACTIVE" },
    });

    // 2. Reviewer Admin (AICTE_ADMIN - secondary sign-off)
    const [u2Id, u2Cookie] = await registerUser(
      `policy_reviewer_${timestamp}@aicte.gov.in`,
      "Dr. Policy Reviewer",
    );
    reviewerId = u2Id;
    reviewerCookie = u2Cookie;
    await prisma.platformUserRole.create({
      data: {
        userId: reviewerId,
        role: UserRole.AICTE_ADMIN,
        status: "ACTIVE",
      },
    });

    // 3. Regular non-admin operator
    const [, u3Cookie] = await registerUser(
      `regular_operator_${timestamp}@college.edu.in`,
      "College Operator",
    );
    nonAdminCookie = u3Cookie;
  });

  afterAll(async () => {
    if (policyPackId) {
      await prisma.policyPack.deleteMany({ where: { id: policyPackId } });
    }
    await disconnectDatabase();
  });

  describe("Authentication and RBAC Guards", () => {
    it("rejects unauthenticated requests to policy endpoints", async () => {
      const res = await request(app).get("/api/v1/policies");
      expect(res.status).toBe(401);
    });

    it("rejects non-admin users attempting to create policy packs", async () => {
      const res = await request(app)
        .post("/api/v1/policies")
        .set("Cookie", nonAdminCookie)
        .send({
          code: `UNAUTH-PACK-${timestamp}`,
          name: "Unauthorized Policy",
          academicYear: "2026-27",
        });

      expect(res.status).toBe(403);
    });
  });

  describe("Policy Pack Lifecycle Progression", () => {
    it("allows AICTE_ADMIN to create a policy pack in DRAFT status", async () => {
      const res = await request(app)
        .post("/api/v1/policies")
        .set("Cookie", authorCookie)
        .send({
          code: policyCode,
          name: "AICTE Approval Process Handbook 2026-27 Test Edition",
          academicYear: "2026-27",
          edition: "1.0",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.code).toBe(policyCode);
      expect(res.body.data.status).toBe("DRAFT");
      expect(res.body.data.contentHash).toBeDefined();

      policyPackId = res.body.data.id;
    });

    it("prevents duplicate policy codes", async () => {
      const res = await request(app)
        .post("/api/v1/policies")
        .set("Cookie", authorCookie)
        .send({
          code: policyCode,
          name: "Duplicate Pack",
          academicYear: "2026-27",
        });

      expect(res.status).toBe(409);
    });

    it("allows adding declarative rules to DRAFT pack and updates content hash", async () => {
      const initialPack = await prisma.policyPack.findUnique({
        where: { id: policyPackId },
      });

      const res = await request(app)
        .post(`/api/v1/policies/${policyPackId}/rules`)
        .set("Cookie", authorCookie)
        .send({
          code: "RULE_INTAKE_CEILING",
          name: "Approved Intake Ceiling",
          category: "CAPACITY",
          clauseReference: "APH 2026-27 Section 2.4",
          severity: "VIOLATION",
          parameters: { maxOverAdmission: 0 },
        });

      expect(res.status).toBe(201);
      expect(res.body.data.code).toBe("RULE_INTAKE_CEILING");

      const updatedPack = await prisma.policyPack.findUnique({
        where: { id: policyPackId },
      });
      expect(updatedPack?.contentHash).not.toBe(initialPack?.contentHash);
    });

    it("allows adding synthetic test fixtures to DRAFT pack", async () => {
      const res = await request(app)
        .post(`/api/v1/policies/${policyPackId}/fixtures`)
        .set("Cookie", authorCookie)
        .send({
          name: "Standard compliant 60-seat batch",
          description: "Cohort fully within approved intake",
          inputData: {
            academicYear: "2026-27",
            sanctionedIntake: 60,
            admittedRegularCount: 60,
            categories: { OPEN: 30, SC: 9, ST: 4, OBC: 16 },
            supernumerary: { EWS: 6, TFW: 3 },
            institutionalStatus: "APPROVED",
          },
          expectedOutput: {
            status: "COMPLIANT",
          },
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Standard compliant 60-seat batch");
    });

    it("executes fixtures and verifies 100% pass rate", async () => {
      const res = await request(app)
        .post(`/api/v1/policies/${policyPackId}/test`)
        .set("Cookie", authorCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.allPassed).toBe(true);
      expect(res.body.data.passRatePercentage).toBe(100);
      expect(res.body.data.evidenceHash).toBeDefined();
    });

    it("transitions pack from DRAFT to COUNCIL_REVIEW", async () => {
      const res = await request(app)
        .post(`/api/v1/policies/${policyPackId}/submit-review`)
        .set("Cookie", authorCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("COUNCIL_REVIEW");
    });

    it("enforces separation of duties: author cannot self-activate policy pack", async () => {
      const res = await request(app)
        .post(`/api/v1/policies/${policyPackId}/activate`)
        .set("Cookie", authorCookie)
        .send({
          gazetteNotificationNumber: `GAZETTE-${timestamp}`,
          signoffNotes: "Attempting self-signoff",
        });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain(
        "SEPARATION_OF_DUTIES_VIOLATION",
      );
    });

    it("allows secondary administrator to activate pack into IN_FORCE status with Gazette reference", async () => {
      const res = await request(app)
        .post(`/api/v1/policies/${policyPackId}/activate`)
        .set("Cookie", reviewerCookie)
        .send({
          gazetteNotificationNumber: `GAZETTE-AICTE-${timestamp}`,
          signoffNotes:
            "Executive Committee approved via Public Notice 2026-27",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("IN_FORCE");
      expect(res.body.data.gazetteReference).toBe(`GAZETTE-AICTE-${timestamp}`);
      expect(res.body.data.activationSignoffs).toHaveLength(1);
      expect(res.body.data.activationSignoffs[0].reviewerId).toBe(reviewerId);
    });

    it("enforces immutability on IN_FORCE policy pack", async () => {
      const res = await request(app)
        .post(`/api/v1/policies/${policyPackId}/rules`)
        .set("Cookie", authorCookie)
        .send({
          code: "RULE_LATE_ADDITION",
          name: "Unauthorized Rule",
          category: "TIMELINE",
          clauseReference: "Section 9",
          parameters: {},
        });

      expect(res.status).toBe(409);
      expect(res.body.error.message).toContain("IMMUTABLE_POLICY_ERROR");
    });
  });

  describe("Temporal Replay Simulation", () => {
    it("executes simulated policy evaluation against cohort without altering database", async () => {
      const res = await request(app)
        .post("/api/v1/policies/replay")
        .set("Cookie", nonAdminCookie)
        .send({
          policyPackId,
          cohort: {
            academicYear: "2026-27",
            sanctionedIntake: 120,
            admittedRegularCount: 128, // Over-admission of 8
            categories: { OPEN: 64, SC: 20, ST: 9, OBC: 35 },
            supernumerary: { EWS: 12, TFW: 6, lateralEntry: 10 },
            institutionalStatus: "APPROVED",
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.data.overallStatus).toBe("VIOLATION");
      expect(res.body.data.headcountEvaluated).toBe(128);
      const intakeRule = res.body.data.ruleResults.find(
        (r: any) => r.ruleCode === "RULE_INTAKE_CEILING",
      );
      expect(intakeRule.status).toBe("VIOLATION");
      expect(intakeRule.breachMagnitude).toBe(8);
    });
  });
});
