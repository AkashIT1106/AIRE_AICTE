import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { getPrismaClient, disconnectDatabase } from "../src/config/database.js";
import { UserRole, MembershipStatus } from "@aire/authorization";
import { ErrorCode } from "@aire/shared-types";
import { SubmissionService } from "../src/services/submission.service.js";

describe("Phase 6: Admission Ledger & Identity Gateway API End-to-End", () => {
  const app = createApp();
  const prisma = getPrismaClient();

  const timestamp = Date.now();
  let inst1Id: string;
  let inst2Id: string;
  let prog1Id: string;
  let prog2Id: string;

  let operatorCookie: string[];
  let opUserId: string;
  let otherTenantCookie: string[];

  let batchId: string;
  let createdAdmissionId: string;

  beforeAll(async () => {
    // 1. Create two test institutions
    const inst1 = await prisma.institution.create({
      data: {
        code: `P6_INST_1_${timestamp}`,
        name: "Phase 6 Engineering College 1",
        status: "ACTIVE",
      },
    });
    inst1Id = inst1.id;

    const inst2 = await prisma.institution.create({
      data: {
        code: `P6_INST_2_${timestamp}`,
        name: "Phase 6 Engineering College 2",
        status: "ACTIVE",
      },
    });
    inst2Id = inst2.id;

    // 2. Create programmes
    const prog1 = await prisma.programme.create({
      data: {
        canonicalCode: `P6_CS_${timestamp}`,
        name: "Computer Science & Engineering",
        degreeLevel: "UG",
        discipline: "Engineering",
        durationYears: 4,
        status: "ACTIVE",
      },
    });
    prog1Id = prog1.id;

    const prog2 = await prisma.programme.create({
      data: {
        canonicalCode: `P6_AI_${timestamp}`,
        name: "Artificial Intelligence & Data Science",
        degreeLevel: "UG",
        discipline: "Engineering",
        durationYears: 4,
        status: "ACTIVE",
      },
    });
    prog2Id = prog2.id;

    // Helper to register user
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

    // 3. Register Operator for Inst 1
    const [userId1, opCookies] = await registerUser(
      `op-p6-${timestamp}@inst1.edu`,
      "Operator P6 Inst 1",
    );
    opUserId = userId1;
    operatorCookie = opCookies;

    await prisma.institutionMember.create({
      data: {
        institutionId: inst1Id,
        userId: opUserId,
        role: UserRole.INSTITUTION_OPERATOR,
        status: MembershipStatus.ACTIVE,
      },
    });

    // 4. Register Operator for Inst 2
    const [userId2, otherCookies] = await registerUser(
      `op-p6-other-${timestamp}@inst2.edu`,
      "Operator P6 Inst 2",
    );
    otherTenantCookie = otherCookies;

    await prisma.institutionMember.create({
      data: {
        institutionId: inst2Id,
        userId: userId2,
        role: UserRole.INSTITUTION_OPERATOR,
        status: MembershipStatus.ACTIVE,
      },
    });

    // 5. Ingest and seal an admission cohort via POST /api/v1/institutions/:instId/submissions
    const submissionRes = await request(app)
      .post(`/api/v1/institutions/${inst1Id}/submissions`)
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id)
      .send({
        academicYear: "2026-27",
        programme: prog1.name,
        fileName: "phase6_cohort.csv",
        records: [
          {
            studentName: "Devansh Nair",
            rollNumber: `CS26_${timestamp}_001`,
            dateOfBirth: "2004-03-21",
            gender: "MALE",
            category: "GEN",
            quota: "General",
            apaarId: "123456789012",
          },
          {
            studentName: "Ananya Deshmukh",
            rollNumber: `CS26_${timestamp}_002`,
            dateOfBirth: "2004-08-14",
            gender: "FEMALE",
            category: "OBC-NCL",
            quota: "Home State Quota",
            apaarId: "987654321098",
          },
        ],
      });

    expect(submissionRes.status).toBe(201);
    batchId = submissionRes.body.data.id;

    // Seal the batch -> triggers promotion to admission ledger & identity vault
    const sealRes = await request(app)
      .post(`/api/v1/institutions/${inst1Id}/submissions/${batchId}/seal`)
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id)
      .send({
        signatureConfirmation: true,
        notes: "Sealing Phase 6 cohort",
      });

    expect(sealRes.status).toBe(200);
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it("GET /api/v1/institutions/:instId/admissions lists active promoted admissions", async () => {
    const res = await request(app)
      .get(`/api/v1/institutions/${inst1Id}/admissions`)
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id);

    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(2);
    expect(res.body.data.data.length).toBe(2);

    const first = res.body.data.data[0];
    expect(first.tenantId).toBe(inst1Id);
    expect(first.status).toBe("ACTIVE");
    expect(first.studentToken).toMatch(/^tok_/);
    createdAdmissionId = first.id;
  });

  it("GET /api/v1/institutions/:instId/admissions/:id returns single admission record details", async () => {
    const res = await request(app)
      .get(`/api/v1/institutions/${inst1Id}/admissions/${createdAdmissionId}`)
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(createdAdmissionId);
    expect(res.body.data.ledgerEvents.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.ledgerEvents[0].eventType).toBe("ADMITTED");
  });

  it("GET /api/v1/institutions/:instId/admissions/:id/ledger verifies cryptographic chain integrity", async () => {
    const res = await request(app)
      .get(
        `/api/v1/institutions/${inst1Id}/admissions/${createdAdmissionId}/ledger`,
      )
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id);

    expect(res.status).toBe(200);
    expect(res.body.data.integrity.valid).toBe(true);
    expect(res.body.data.events.length).toBeGreaterThanOrEqual(1);
  });

  it("POST .../branch-change appends BRANCH_CHANGE ledger event and updates programme reference", async () => {
    const res = await request(app)
      .post(
        `/api/v1/institutions/${inst1Id}/admissions/${createdAdmissionId}/branch-change`,
      )
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id)
      .send({
        newProgrammeId: prog2Id,
        reason: "Merit sliding allocation approved",
        approvalReference: "ORDER/2026/SLIDE/001",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.record.programmeId).toBe(prog2Id);
    expect(res.body.data.ledgerEvent.eventType).toBe("BRANCH_CHANGE");
    expect(res.body.data.ledgerEvent.sequenceNumber).toBe(2);

    // Verify hash chain remains valid with new event
    const ledgerCheck = await request(app)
      .get(
        `/api/v1/institutions/${inst1Id}/admissions/${createdAdmissionId}/ledger`,
      )
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id);

    expect(ledgerCheck.body.data.integrity.valid).toBe(true);
    expect(ledgerCheck.body.data.events.length).toBe(2);
  });

  it("POST .../verify-identity verifies student APAAR via IdentityGateway in MOCK mode", async () => {
    const res = await request(app)
      .post(
        `/api/v1/institutions/${inst1Id}/admissions/${createdAdmissionId}/verify-identity`,
      )
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id);

    expect(res.status).toBe(200);
    expect(res.body.data.verificationResult.status).toBe("VERIFIED");
    expect(res.body.data.record.apaarStatus).toBe("VERIFIED");
  });

  it("POST .../vault-access decrypts PII under statutory purpose code with audit logging", async () => {
    const res = await request(app)
      .post(
        `/api/v1/institutions/${inst1Id}/admissions/${createdAdmissionId}/vault-access`,
      )
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id)
      .send({
        purposeCode: "REGULATORY_SCRUTINY",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.demographics.studentName).toBeDefined();
    expect(res.body.data.demographics.dateOfBirth).toBeDefined();
  });

  it("POST .../cancel cancels admission and appends CANCELLATION ledger event", async () => {
    const res = await request(app)
      .post(
        `/api/v1/institutions/${inst1Id}/admissions/${createdAdmissionId}/cancel`,
      )
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id)
      .send({
        cancellationReason: "Student opted for IIT admission",
        evidenceDocumentHash: "sha256:abcd1234abcd5678abcd9012abcd3456",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.record.status).toBe("CANCELLED");
    expect(res.body.data.ledgerEvent.eventType).toBe("CANCELLATION");

    // Attempting further operations on cancelled record is rejected
    const branchChangeAgain = await request(app)
      .post(
        `/api/v1/institutions/${inst1Id}/admissions/${createdAdmissionId}/branch-change`,
      )
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id)
      .send({
        newProgrammeId: prog1Id,
        reason: "Late transfer",
        approvalReference: "ORDER/999",
      });

    expect(branchChangeAgain.status).toBe(400);
    expect(branchChangeAgain.body.error.message).toContain(
      "CANNOT_TRANSFER_INACTIVE_RECORD",
    );
  });

  it("enforces tenant isolation: Operator from Institution 2 cannot view Institution 1 admissions", async () => {
    const res = await request(app)
      .get(`/api/v1/institutions/${inst1Id}/admissions`)
      .set("Cookie", otherTenantCookie)
      .set("X-Institution-ID", inst1Id);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe(ErrorCode.PERMISSION_DENIED);
  });

  it("rejects unauthenticated requests with 401 UNAUTHORIZED", async () => {
    const res = await request(app).get(
      `/api/v1/institutions/${inst1Id}/admissions`,
    );

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe(ErrorCode.UNAUTHORIZED);
  });
});
