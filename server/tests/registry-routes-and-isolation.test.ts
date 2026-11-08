import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import {
  getPrismaClient,
  withTenantContext,
  disconnectDatabase,
} from "../src/config/database.js";
import { UserRole, MembershipStatus } from "@aire/authorization";
import { ErrorCode } from "@aire/shared-types";

describe("Phase 3: Registry Endpoints, Multi-Tenant Authorization & PostgreSQL RLS", () => {
  const app = createApp();
  const prisma = getPrismaClient();

  const timestamp = Date.now();
  let inst1Id: string;
  let inst2Id: string;
  let progId: string;
  let campus1Id: string;
  let approvalOrder1Id: string;

  let inst1AdminCookie: string[];
  let inst2OperatorCookie: string[];
  let platformAdminCookie: string[];

  beforeAll(async () => {
    // 1. Create two test institutions
    const inst1 = await prisma.institution.create({
      data: {
        code: `REG_INST_1_${timestamp}`,
        name: "Test Engineering College 1",
        aicteId: `AICTE-1-${timestamp}`,
        status: "ACTIVE",
      },
    });
    inst1Id = inst1.id;

    const inst2 = await prisma.institution.create({
      data: {
        code: `REG_INST_2_${timestamp}`,
        name: "Test Polytechnic Institute 2",
        aicteId: `AICTE-2-${timestamp}`,
        status: "ACTIVE",
      },
    });
    inst2Id = inst2.id;

    // 2. Create canonical programme
    const prog = await prisma.programme.create({
      data: {
        canonicalCode: `UG-CSE-${timestamp}`,
        name: `B.Tech Computer Science ${timestamp}`,
        degreeLevel: "UG",
        discipline: "Engineering",
        durationYears: 4,
        status: "ACTIVE",
      },
    });
    progId = prog.id;

    // Helper to register user
    async function registerUser(email: string, name: string): Promise<[string, string[]]> {
      const res = await request(app).post("/api/auth/sign-up/email").send({
        email,
        password: "Password123!Secure",
        name,
      });
      return [res.body.user.id, res.headers["set-cookie"]];
    }

    // 3. User 1: Institution 1 Admin
    const [u1Id, u1Cookies] = await registerUser(
      `admin1-${timestamp}@inst1.edu`,
      "Inst 1 Admin",
    );
    inst1AdminCookie = u1Cookies;
    await prisma.institutionMember.create({
      data: {
        institutionId: inst1Id,
        userId: u1Id,
        role: "INSTITUTION_ADMIN",
        status: MembershipStatus.ACTIVE,
      },
    });

    // 4. User 2: Institution 2 Operator
    const [u2Id, u2Cookies] = await registerUser(
      `operator2-${timestamp}@inst2.edu`,
      "Inst 2 Operator",
    );
    inst2OperatorCookie = u2Cookies;
    await prisma.institutionMember.create({
      data: {
        institutionId: inst2Id,
        userId: u2Id,
        role: "INSTITUTION_OPERATOR",
        status: MembershipStatus.ACTIVE,
      },
    });

    // 5. User 3: AICTE System Admin
    const [u3Id, u3Cookies] = await registerUser(
      `aicteadmin-${timestamp}@aicte-india.org`,
      "AICTE Platform Admin",
    );
    platformAdminCookie = u3Cookies;
    await prisma.platformUserRole.create({
      data: {
        userId: u3Id,
        role: UserRole.SUPER_ADMIN,
        status: "ACTIVE",
      },
    });
  });

  afterAll(async () => {
    await prisma.seatEntitlement.deleteMany({
      where: { programmeId: progId },
    });
    await prisma.approvalOrder.deleteMany({
      where: { institutionId: { in: [inst1Id, inst2Id] } },
    });
    await prisma.campus.deleteMany({
      where: { institutionId: { in: [inst1Id, inst2Id] } },
    });
    await prisma.programme.deleteMany({
      where: { id: progId },
    });
    await prisma.institutionMember.deleteMany({
      where: { institutionId: { in: [inst1Id, inst2Id] } },
    });
    await prisma.institution.deleteMany({
      where: { id: { in: [inst1Id, inst2Id] } },
    });
    await disconnectDatabase();
  });

  // --- Task 4.1: Institution & Campus Routes ---

  it("retrieves institution profile for authorized institution member", async () => {
    const res = await request(app)
      .get(`/api/v1/institutions/${inst1Id}`)
      .set("Cookie", inst1AdminCookie)
      .set("x-institution-id", inst1Id);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(inst1Id);
    expect(res.body.data.name).toBe("Test Engineering College 1");
  });

  it("blocks cross-tenant access to institution profile", async () => {
    const res = await request(app)
      .get(`/api/v1/institutions/${inst1Id}`)
      .set("Cookie", inst2OperatorCookie)
      .set("x-institution-id", inst1Id);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe(ErrorCode.PERMISSION_DENIED);
  });

  it("creates a campus under the institution", async () => {
    const res = await request(app)
      .post(`/api/v1/institutions/${inst1Id}/campuses`)
      .set("Cookie", inst1AdminCookie)
      .set("x-institution-id", inst1Id)
      .send({
        code: `NORTH-${timestamp}`,
        name: "North Extension Campus",
        state: "Delhi",
        district: "North Delhi",
        pincode: "110007",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.code).toBe(`NORTH-${timestamp}`);
    campus1Id = res.body.data.id;
  });

  it("lists campuses for the authorized institution", async () => {
    const res = await request(app)
      .get(`/api/v1/institutions/${inst1Id}/campuses`)
      .set("Cookie", inst1AdminCookie)
      .set("x-institution-id", inst1Id);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((c: any) => c.id === campus1Id)).toBe(true);
  });

  // --- Task 4.2: Programmes & Approval Order Routes ---

  it("lists canonical programmes for authenticated users", async () => {
    const res = await request(app)
      .get("/api/v1/programmes")
      .set("Cookie", inst1AdminCookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((p: any) => p.id === progId)).toBe(true);
  });

  it("blocks non-admin from creating canonical programmes", async () => {
    const res = await request(app)
      .post("/api/v1/programmes")
      .set("Cookie", inst1AdminCookie)
      .send({
        canonicalCode: `DENIED-${timestamp}`,
        name: "Unauthorized Programme",
        degreeLevel: "UG",
        discipline: "Engineering",
      });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe(ErrorCode.PERMISSION_DENIED);
  });

  it("allows platform admin to create AICTE approval order with seat entitlements", async () => {
    const orderNumber = `AICTE-EOA-${timestamp}`;
    const res = await request(app)
      .post("/api/v1/approvals")
      .set("Cookie", platformAdminCookie)
      .send({
        order: {
          institutionId: inst1Id,
          academicYear: "2026-27",
          orderNumber,
          orderType: "EOA",
          status: "ACTIVE",
        },
        entitlements: [
          {
            programmeId: progId,
            campusId: campus1Id,
            sanctionedIntake: 60,
            openSeats: 30,
            scSeats: 9,
            stSeats: 5,
            obcSeats: 16,
            ewsSeats: 0,
            tfwSeats: 3,
            supernumerarySeats: 0,
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.orderNumber).toBe(orderNumber);
    expect(res.body.data.entitlements.length).toBe(1);
    approvalOrder1Id = res.body.data.id;
  });

  it("allows platform admin to supersede approval order", async () => {
    const revisedOrderNumber = `AICTE-EOA-${timestamp}-REV`;
    const res = await request(app)
      .post(`/api/v1/approvals/${approvalOrder1Id}/supersede`)
      .set("Cookie", platformAdminCookie)
      .send({
        order: {
          institutionId: inst1Id,
          academicYear: "2026-27",
          orderNumber: revisedOrderNumber,
          orderType: "EOA",
          status: "ACTIVE",
        },
        entitlements: [
          {
            programmeId: progId,
            campusId: campus1Id,
            sanctionedIntake: 120,
            openSeats: 60,
            scSeats: 18,
            stSeats: 9,
            obcSeats: 33,
            ewsSeats: 0,
            tfwSeats: 6,
            supernumerarySeats: 0,
          },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.data.orderNumber).toBe(revisedOrderNumber);

    // Verify previous order was marked SUPERSEDED
    const prev = await prisma.approvalOrder.findUnique({
      where: { id: approvalOrder1Id },
    });
    expect(prev?.status).toBe("SUPERSEDED");
  });

  // --- Task 4.3: PostgreSQL RLS Isolation Tests ---

  it("enforces PostgreSQL RLS on campuses table", async () => {
    // Under Tenant 1 context, reading campuses sees campus1Id
    const t1Campuses = await withTenantContext(inst1Id, async (tx) => {
      return tx.campus.findMany();
    });
    expect(t1Campuses.some((c) => c.id === campus1Id)).toBe(true);

    // Under Tenant 2 context, reading campuses returns ZERO campuses belonging to Tenant 1
    const t2Campuses = await withTenantContext(inst2Id, async (tx) => {
      return tx.campus.findMany();
    });
    expect(t2Campuses.some((c) => c.id === campus1Id)).toBe(false);
  });

  it("blocks cross-tenant write via PostgreSQL RLS WITH CHECK policy on campuses", async () => {
    // Attempting to create a campus for inst2Id while tenant context is set to inst1Id
    await expect(
      withTenantContext(inst1Id, async (tx) => {
        return tx.campus.create({
          data: {
            institutionId: inst2Id,
            code: `SNEAKY-${timestamp}`,
            name: "Sneaky Cross Tenant Campus",
            status: "ACTIVE",
          },
        });
      }),
    ).rejects.toThrow();
  });
});
