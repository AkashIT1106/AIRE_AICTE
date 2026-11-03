import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { getPrismaClient, disconnectDatabase } from "../src/config/database.js";
import { UserRole, MembershipStatus } from "@aire/authorization";
import { ErrorCode } from "@aire/shared-types";

describe("Journey J-02: Admission Batch Ingestion & Quarantine Triage", () => {
  const app = createApp();
  const prisma = getPrismaClient();

  const timestamp = Date.now();
  let inst1Id: string;
  let inst2Id: string;

  let operatorCookie: string[];
  let otherTenantOperatorCookie: string[];
  let createdBatchId: string;
  let quarantinedRowId: string;

  beforeAll(async () => {
    // 1. Create two test institutions
    const inst1 = await prisma.institution.create({
      data: {
        code: `J02_INST_1_${timestamp}`,
        name: "J02 Test Institute 1",
        status: "ACTIVE",
      },
    });
    inst1Id = inst1.id;

    const inst2 = await prisma.institution.create({
      data: {
        code: `J02_INST_2_${timestamp}`,
        name: "J02 Test Institute 2",
        status: "ACTIVE",
      },
    });
    inst2Id = inst2.id;

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

    // 2. Register Operator for Inst 1
    const [op1UserId, op1Cookies] = await registerUser(
      `operator1-${timestamp}@inst1.edu`,
      "Operator 1",
    );
    operatorCookie = op1Cookies;

    await prisma.institutionMember.create({
      data: {
        institutionId: inst1Id,
        userId: op1UserId,
        role: UserRole.INSTITUTION_OPERATOR,
        status: MembershipStatus.ACTIVE,
      },
    });

    // 3. Register Operator for Inst 2 (other tenant)
    const [op2UserId, op2Cookies] = await registerUser(
      `operator2-${timestamp}@inst2.edu`,
      "Operator 2",
    );
    otherTenantOperatorCookie = op2Cookies;

    await prisma.institutionMember.create({
      data: {
        institutionId: inst2Id,
        userId: op2UserId,
        role: UserRole.INSTITUTION_OPERATOR,
        status: MembershipStatus.ACTIVE,
      },
    });
  });

  afterAll(async () => {
    await prisma.institutionRecord.deleteMany({
      where: { institutionId: { in: [inst1Id, inst2Id] } },
    });
    await prisma.institutionMember.deleteMany({
      where: { institutionId: { in: [inst1Id, inst2Id] } },
    });
    await prisma.institution.deleteMany({
      where: { id: { in: [inst1Id, inst2Id] } },
    });
    await disconnectDatabase();
  });

  it("POST /api/v1/institutions/:instId/submissions creates a batch and separates valid vs quarantined rows", async () => {
    const payload = {
      academicYear: "2026-27",
      programme: "B.Tech Computer Science and Engineering",
      fileName: "admissions_batch_1.csv",
      records: [
        // Valid Row 1
        {
          studentName: "Aarav Sharma",
          rollNumber: "2026-CSE-101",
          dateOfBirth: "2005-04-12",
          category: "GEN",
          quota: "General / All India",
          apaarId: "9821-4412-1042",
        },
        // Valid Row 2
        {
          studentName: "Priya Patel",
          rollNumber: "2026-CSE-102",
          dateOfBirth: "2005-08-25",
          category: "OBC-NCL",
          quota: "Home State Quota",
        },
        // Defective Row 3 (Invalid Category code)
        {
          studentName: "Ananya Iyer",
          rollNumber: "2026-CSE-103",
          dateOfBirth: "2005-11-19",
          category: "OBC-NCL-TYPO",
          quota: "Home State Quota",
        },
      ],
    };

    const res = await request(app)
      .post(`/api/v1/institutions/${inst1Id}/submissions`)
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.error).toBeNull();
    expect(res.body.data).toBeDefined();

    const batch = res.body.data;
    createdBatchId = batch.id;

    expect(batch.academicYear).toBe("2026-27");
    expect(batch.programme).toBe("B.Tech Computer Science and Engineering");
    expect(batch.totalCount).toBe(3);
    expect(batch.validCount).toBe(2);
    expect(batch.quarantineCount).toBe(1);
    expect(batch.status).toBe("QUARANTINED");

    expect(batch.stagedRecords.length).toBe(2);
    expect(batch.stagedRecords[0].data.studentName).toBe("Aarav Sharma");

    expect(batch.quarantineRecords.length).toBe(1);
    expect(batch.quarantineRecords[0].rawData.studentName).toBe("Ananya Iyer");
    expect(batch.quarantineRecords[0].errors[0].field).toBe("category");

    quarantinedRowId = batch.quarantineRecords[0].rowId;
  });

  it("GET /api/v1/institutions/:instId/submissions returns list of batches for the tenant", async () => {
    const res = await request(app)
      .get(`/api/v1/institutions/${inst1Id}/submissions`)
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id);

    expect(res.status).toBe(200);
    expect(res.body.error).toBeNull();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].id).toBe(createdBatchId);
  });

  it("GET /api/v1/institutions/:instId/submissions/:batchId retrieves the single batch with records", async () => {
    const res = await request(app)
      .get(`/api/v1/institutions/${inst1Id}/submissions/${createdBatchId}`)
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id);

    expect(res.status).toBe(200);
    expect(res.body.error).toBeNull();
    expect(res.body.data.id).toBe(createdBatchId);
    expect(res.body.data.quarantineRecords.length).toBe(1);
  });

  it("PATCH quarantine remediation with invalid data rejects with 400 and validation errors", async () => {
    const res = await request(app)
      .patch(
        `/api/v1/institutions/${inst1Id}/submissions/${createdBatchId}/quarantine/${quarantinedRowId}`,
      )
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id)
      .send({
        category: "STILL_INVALID",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe(ErrorCode.VALIDATION_ERROR);
  });

  it("PATCH quarantine remediation with valid correction resolves row and promotes to staged", async () => {
    const res = await request(app)
      .patch(
        `/api/v1/institutions/${inst1Id}/submissions/${createdBatchId}/quarantine/${quarantinedRowId}`,
      )
      .set("Cookie", operatorCookie)
      .set("X-Institution-ID", inst1Id)
      .send({
        category: "OBC-NCL",
      });

    expect(res.status).toBe(200);
    expect(res.body.error).toBeNull();

    const updatedBatch = res.body.data;
    expect(updatedBatch.quarantineCount).toBe(0);
    expect(updatedBatch.validCount).toBe(3);
    expect(updatedBatch.quarantineRecords.length).toBe(0);
    expect(updatedBatch.stagedRecords.length).toBe(3);
    // When 0 quarantined rows remain, status becomes READY_FOR_SIGN_OFF
    expect(updatedBatch.status).toBe("READY_FOR_SIGN_OFF");
  });

  it("enforces tenant isolation: Operator from Institution 2 cannot view Institution 1 batches", async () => {
    const res = await request(app)
      .get(`/api/v1/institutions/${inst1Id}/submissions`)
      .set("Cookie", otherTenantOperatorCookie)
      .set("X-Institution-ID", inst1Id);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe(ErrorCode.PERMISSION_DENIED);
  });

  it("rejects unauthenticated requests with 401 UNAUTHORIZED", async () => {
    const res = await request(app).get(
      `/api/v1/institutions/${inst1Id}/submissions`,
    );

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe(ErrorCode.UNAUTHORIZED);
  });
});
