import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { getPrismaClient, disconnectDatabase } from "../src/config/database.js";
import { UserRole, MembershipStatus } from "@aire/authorization";

describe("AIRE Centralized Authorization & Membership Controls", () => {
  const app = createApp();
  const prisma = getPrismaClient();

  const timestamp = Date.now();
  let inst1Id: string;
  let inst2Id: string;

  let adminUserCookie: string[];
  let operatorUserCookie: string[];
  let inactiveUserCookie: string[];
  let revokedUserCookie: string[];
  let aicteAdminUserCookie: string[];

  beforeAll(async () => {
    // 1. Create two test institutions
    const inst1 = await prisma.institution.create({
      data: {
        code: `INST_AUTH_1_${timestamp}`,
        name: "Authorization Test Institute 1",
        status: "ACTIVE",
      },
    });
    inst1Id = inst1.id;

    const inst2 = await prisma.institution.create({
      data: {
        code: `INST_AUTH_2_${timestamp}`,
        name: "Authorization Test Institute 2",
        status: "ACTIVE",
      },
    });
    inst2Id = inst2.id;

    // Helper to register a test user and return cookie
    async function registerUser(
      email: string,
      name: string,
    ): Promise<string[]> {
      const res = await request(app).post("/api/auth/sign-up/email").send({
        email,
        password: "Password123!Secure",
        name,
      });
      return res.headers["set-cookie"];
    }

    // 2. Register users
    adminUserCookie = await registerUser(
      `admin-${timestamp}@inst1.edu`,
      "Institution 1 Admin",
    );
    operatorUserCookie = await registerUser(
      `operator-${timestamp}@inst1.edu`,
      "Institution 1 Operator",
    );
    inactiveUserCookie = await registerUser(
      `inactive-${timestamp}@inst1.edu`,
      "Inactive Member",
    );
    revokedUserCookie = await registerUser(
      `revoked-${timestamp}@inst1.edu`,
      "Revoked Member",
    );
    aicteAdminUserCookie = await registerUser(
      `aicte-${timestamp}@aicte.gov.in`,
      "AICTE Platform Admin",
    );

    // Get user IDs from db
    const adminUser = await prisma.user.findUniqueOrThrow({
      where: { email: `admin-${timestamp}@inst1.edu` },
    });
    const operatorUser = await prisma.user.findUniqueOrThrow({
      where: { email: `operator-${timestamp}@inst1.edu` },
    });
    const inactiveUser = await prisma.user.findUniqueOrThrow({
      where: { email: `inactive-${timestamp}@inst1.edu` },
    });
    const revokedUser = await prisma.user.findUniqueOrThrow({
      where: { email: `revoked-${timestamp}@inst1.edu` },
    });
    const aicteAdminUser = await prisma.user.findUniqueOrThrow({
      where: { email: `aicte-${timestamp}@aicte.gov.in` },
    });

    // 3. Assign institution memberships
    await prisma.institutionMember.createMany({
      data: [
        {
          institutionId: inst1Id,
          userId: adminUser.id,
          role: UserRole.INSTITUTION_ADMIN,
          status: MembershipStatus.ACTIVE,
        },
        {
          institutionId: inst1Id,
          userId: operatorUser.id,
          role: UserRole.INSTITUTION_OPERATOR,
          status: MembershipStatus.ACTIVE,
        },
        {
          institutionId: inst1Id,
          userId: inactiveUser.id,
          role: UserRole.INSTITUTION_OPERATOR,
          status: MembershipStatus.INACTIVE,
        },
        {
          institutionId: inst1Id,
          userId: revokedUser.id,
          role: UserRole.INSTITUTION_OPERATOR,
          status: MembershipStatus.REVOKED,
        },
      ],
    });

    // 4. Assign platform role to AICTE admin
    await prisma.platformUserRole.create({
      data: {
        userId: aicteAdminUser.id,
        role: UserRole.AICTE_ADMIN,
        status: "ACTIVE",
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

  it("permits active member to access their institution records", async () => {
    const res = await request(app)
      .get(`/api/v1/institutions/${inst1Id}/records`)
      .set("Cookie", adminUserCookie);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("blocks user from accessing another institution (manipulated institution ID)", async () => {
    // User belongs only to inst1Id, attempts to query inst2Id
    const res = await request(app)
      .get(`/api/v1/institutions/${inst2Id}/records`)
      .set("Cookie", adminUserCookie);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("PERMISSION_DENIED");
    expect(res.body.error.message).toContain("Tenant access denied");
  });

  it("blocks inactive membership from accessing institution records", async () => {
    const res = await request(app)
      .get(`/api/v1/institutions/${inst1Id}/records`)
      .set("Cookie", inactiveUserCookie);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("PERMISSION_DENIED");
    expect(res.body.error.message).toContain("MEMBERSHIP_INACTIVE");
  });

  it("blocks revoked membership from accessing institution records", async () => {
    const res = await request(app)
      .get(`/api/v1/institutions/${inst1Id}/records`)
      .set("Cookie", revokedUserCookie);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("PERMISSION_DENIED");
    expect(res.body.error.message).toContain("MEMBERSHIP_REVOKED");
  });

  it("prevents role escalation: INSTITUTION_OPERATOR cannot perform admin write", async () => {
    const res = await request(app)
      .post(`/api/v1/institutions/${inst1Id}/records`)
      .set("Cookie", operatorUserCookie)
      .send({
        title: "Escalation Attempt Record",
        payload: { attempt: "illegal_write" },
      });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("PERMISSION_DENIED");
    expect(res.body.error.message).toContain("institution:write");
  });

  it("allows INSTITUTION_ADMIN to write institution record", async () => {
    const res = await request(app)
      .post(`/api/v1/institutions/${inst1Id}/records`)
      .set("Cookie", adminUserCookie)
      .send({
        title: "Authorized Admin Record",
        payload: { valid: true },
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.title).toBe("Authorized Admin Record");
  });

  it("allows AICTE_ADMIN platform role to inspect institution records across tenants", async () => {
    const res = await request(app)
      .get(`/api/v1/institutions/${inst1Id}/records`)
      .set("Cookie", aicteAdminUserCookie);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  it("records audit events in database for denied access attempts", async () => {
    const auditEvents = await prisma.auditEvent.findMany({
      where: {
        action: "TENANT_ACCESS_DENIED",
        tenantId: inst2Id,
      },
    });

    expect(auditEvents.length).toBeGreaterThan(0);
    expect(auditEvents[0].status).toBe("DENIED");
  });
});
