import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getPrismaClient, disconnectDatabase } from "../src/config/database.js";
import { InstitutionRegistryService } from "../src/services/institution-registry.service.js";
import { ApprovalRegistryService } from "../src/services/approval-registry.service.js";

describe("Phase 3 Registry Services & Audit Integration", () => {
  const prisma = getPrismaClient();
  const timestamp = Date.now();
  let testInstId: string;
  let testProgId: string;

  beforeAll(async () => {
    // Create an institution for service testing
    const inst = await prisma.institution.create({
      data: {
        code: `SERV_INST_${timestamp}`,
        name: "Service Test University",
        aicteId: `AICTE-SERV-${timestamp}`,
        status: "ACTIVE",
      },
    });
    testInstId = inst.id;

    // Create a canonical programme
    const prog = await prisma.programme.create({
      data: {
        canonicalCode: `PROG-AI-${timestamp}`,
        name: `Artificial Intelligence ${timestamp}`,
        degreeLevel: "UG",
        discipline: "Computer Science",
        durationYears: 4,
        status: "ACTIVE",
      },
    });
    testProgId = prog.id;
  });

  afterAll(async () => {
    // Cleanup created data
    await prisma.seatEntitlement.deleteMany({
      where: { programmeId: testProgId },
    });
    await prisma.approvalOrder.deleteMany({
      where: { institutionId: testInstId },
    });
    await prisma.programmeAlias.deleteMany({
      where: { programmeId: testProgId },
    });
    await prisma.campus.deleteMany({
      where: { institutionId: testInstId },
    });
    await prisma.programme.deleteMany({
      where: { id: testProgId },
    });
    await prisma.institution.deleteMany({
      where: { id: testInstId },
    });
    await disconnectDatabase();
  });

  it("updates institution profile and logs audit event", async () => {
    const updated = await InstitutionRegistryService.updateInstitution(
      testInstId,
      {
        legalName: "Service Test University Legal Entity",
        state: "Maharashtra",
        district: "Pune",
        pincode: "411001",
      },
      {
        actorId: "actor-123",
        correlationId: `corr-${timestamp}`,
        tenantId: testInstId,
      },
    );

    expect(updated.id).toBe(testInstId);
    expect(updated.legalName).toBe("Service Test University Legal Entity");
    expect(updated.state).toBe("Maharashtra");

    // Verify audit event was persisted
    const auditEvent = await prisma.auditEvent.findFirst({
      where: {
        action: "INSTITUTION_PROFILE_UPDATED",
        resourceId: testInstId,
      },
      orderBy: { timestamp: "desc" },
    });
    expect(auditEvent).not.toBeNull();
    expect(auditEvent?.status).toBe("SUCCESS");
  });

  it("creates a campus and matches programme aliases", async () => {
    const campus = await InstitutionRegistryService.createCampus(
      testInstId,
      {
        code: `CAMP-${timestamp}`,
        name: "Pune City Campus",
        state: "Maharashtra",
        status: "ACTIVE",
      },
      {
        actorId: "actor-123",
        correlationId: `corr-campus-${timestamp}`,
      },
    );

    expect(campus.id).toBeDefined();
    expect(campus.code).toBe(`CAMP-${timestamp}`);

    // Create programme alias
    const alias = await InstitutionRegistryService.createProgrammeAlias(
      {
        programmeId: testProgId,
        rawTitle: `AI & ML ${timestamp}`,
        normalisedTitle: `ai ml ${timestamp}`,
        institutionId: testInstId,
        confidence: 0.95,
      },
      {
        actorId: "actor-123",
        correlationId: `corr-alias-${timestamp}`,
      },
    );

    expect(alias.id).toBeDefined();

    // Match the alias
    const match = await InstitutionRegistryService.matchProgrammeAlias(
      `AI & ML ${timestamp}`,
      testInstId,
    );
    expect(match.matchedBy).toBe("ALIAS");
    expect(match.programme?.id).toBe(testProgId);
    expect(match.confidence).toBe(0.95);
  });

  it("creates approval order with seat entitlements and supports order supersession", async () => {
    const orderNumber1 = `EOA-${timestamp}-1`;
    const order1 = await ApprovalRegistryService.createApprovalOrder(
      {
        institutionId: testInstId,
        academicYear: "2026-27",
        orderNumber: orderNumber1,
        orderType: "EOA",
        issueDate: new Date(),
        status: "ACTIVE",
      },
      [
        {
          programmeId: testProgId,
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
      {
        actorId: "admin-actor",
        correlationId: `corr-order-${timestamp}`,
      },
    );

    expect(order1.id).toBeDefined();
    expect(order1.orderNumber).toBe(orderNumber1);
    expect(order1.entitlements?.length).toBe(1);
    expect(order1.status).toBe("ACTIVE");

    // Supersede order1 with order2
    const orderNumber2 = `EOA-${timestamp}-2-REVISED`;
    const order2 = await ApprovalRegistryService.supersedeApprovalOrder(
      order1.id,
      {
        institutionId: testInstId,
        academicYear: "2026-27",
        orderNumber: orderNumber2,
        orderType: "EOA",
        issueDate: new Date(),
        status: "ACTIVE",
      },
      [
        {
          programmeId: testProgId,
          sanctionedIntake: 90,
          openSeats: 45,
          scSeats: 14,
          stSeats: 7,
          obcSeats: 24,
          ewsSeats: 0,
          tfwSeats: 5,
          supernumerarySeats: 0,
        },
      ],
      {
        actorId: "admin-actor",
        correlationId: `corr-supersede-${timestamp}`,
      },
    );

    expect(order2.id).toBeDefined();
    expect(order2.orderNumber).toBe(orderNumber2);

    // Verify order1 is now SUPERSEDED
    const prevOrder = await ApprovalRegistryService.getApprovalOrder(order1.id);
    expect(prevOrder?.status).toBe("SUPERSEDED");
    expect(prevOrder?.supersededById).toBe(order2.id);

    // Verify audit event for supersession
    const auditEvent = await prisma.auditEvent.findFirst({
      where: {
        action: "APPROVAL_ORDER_SUPERSEDED",
        resourceId: order1.id,
      },
    });
    expect(auditEvent).not.toBeNull();
  });
});
