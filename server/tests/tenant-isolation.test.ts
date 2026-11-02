import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  getPrismaClient,
  getRuntimePrismaClient,
  withTenantContext,
  disconnectDatabase,
} from "../src/config/database.js";

describe("PostgreSQL Database Row-Level Security (RLS) & Tenant Isolation", () => {
  const adminPrisma = getPrismaClient();
  const runtimePrisma = getRuntimePrismaClient();

  const timestamp = Date.now();
  let inst1Id: string;
  let inst2Id: string;

  beforeAll(async () => {
    // Set up two test institutions using admin client
    const inst1 = await adminPrisma.institution.create({
      data: {
        code: `RLS_INST_1_${timestamp}`,
        name: "RLS Test Institution 1",
        status: "ACTIVE",
      },
    });
    inst1Id = inst1.id;

    const inst2 = await adminPrisma.institution.create({
      data: {
        code: `RLS_INST_2_${timestamp}`,
        name: "RLS Test Institution 2",
        status: "ACTIVE",
      },
    });
    inst2Id = inst2.id;
  });

  afterAll(async () => {
    await adminPrisma.institutionRecord.deleteMany({
      where: { institutionId: { in: [inst1Id, inst2Id] } },
    });
    await adminPrisma.institution.deleteMany({
      where: { id: { in: [inst1Id, inst2Id] } },
    });
    await disconnectDatabase();
  });

  it("inserts records within respective tenant contexts", async () => {
    const record1 = await withTenantContext(inst1Id, async (tx) => {
      return tx.institutionRecord.create({
        data: {
          institutionId: inst1Id,
          title: "Tenant 1 Confidential Document",
          payload: { classification: "Restricted", count: 10 },
        },
      });
    });

    const record2 = await withTenantContext(inst2Id, async (tx) => {
      return tx.institutionRecord.create({
        data: {
          institutionId: inst2Id,
          title: "Tenant 2 Confidential Document",
          payload: { classification: "Restricted", count: 20 },
        },
      });
    });

    expect(record1.id).toBeDefined();
    expect(record1.institutionId).toBe(inst1Id);
    expect(record2.id).toBeDefined();
    expect(record2.institutionId).toBe(inst2Id);
  });

  it("enforces strict read isolation: Tenant 1 context sees ONLY Tenant 1 records", async () => {
    const records = await withTenantContext(inst1Id, async (tx) => {
      return tx.institutionRecord.findMany();
    });

    expect(records.length).toBeGreaterThan(0);
    // Every single record must belong to inst1Id
    records.forEach((record) => {
      expect(record.institutionId).toBe(inst1Id);
    });

    // Zero records from inst2Id must be visible
    const hasTenant2Record = records.some((r) => r.institutionId === inst2Id);
    expect(hasTenant2Record).toBe(false);
  });

  it("enforces strict read isolation: Tenant 2 context sees ONLY Tenant 2 records", async () => {
    const records = await withTenantContext(inst2Id, async (tx) => {
      return tx.institutionRecord.findMany();
    });

    expect(records.length).toBeGreaterThan(0);
    records.forEach((record) => {
      expect(record.institutionId).toBe(inst2Id);
    });

    const hasTenant1Record = records.some((r) => r.institutionId === inst1Id);
    expect(hasTenant1Record).toBe(false);
  });

  it("blocks cross-tenant write attempt via RLS WITH CHECK policy", async () => {
    // Attempting to insert a record for inst2Id while tenant context is set to inst1Id
    await expect(
      withTenantContext(inst1Id, async (tx) => {
        return tx.institutionRecord.create({
          data: {
            institutionId: inst2Id, // Cross-tenant spoof attempt
            title: "Malicious Spoofed Record",
          },
        });
      }),
    ).rejects.toThrow(/violates row-level security policy/i);
  });

  it("returns zero records when queried without tenant context", async () => {
    // Direct query through runtime client without setting app.current_tenant_id
    const records = await runtimePrisma.institutionRecord.findMany();
    expect(records).toEqual([]);
  });

  it("rejects invalid or empty tenant IDs in withTenantContext", async () => {
    await expect(
      withTenantContext("", async (tx) => {
        return tx.institutionRecord.findMany();
      }),
    ).rejects.toThrow(/INVALID_TENANT_CONTEXT/);
  });

  it("prevents tenant context leakage across sequential transactions on pooled connections", async () => {
    // Transaction 1: Inst 1
    const t1Records = await withTenantContext(inst1Id, async (tx) => {
      return tx.institutionRecord.findMany();
    });
    expect(t1Records.every((r) => r.institutionId === inst1Id)).toBe(true);

    // Transaction 2: Inst 2
    const t2Records = await withTenantContext(inst2Id, async (tx) => {
      return tx.institutionRecord.findMany();
    });
    expect(t2Records.every((r) => r.institutionId === inst2Id)).toBe(true);

    // Transaction 3: Query without context on same client must see zero records (no residual context)
    const rawSetting = await runtimePrisma.$queryRaw<
      { current_setting: string }[]
    >`SELECT current_setting('app.current_tenant_id', true)`;
    expect(rawSetting[0].current_setting).toBe("");

    const leakageRecords = await runtimePrisma.institutionRecord.findMany();
    expect(leakageRecords).toEqual([]);
  });

  it("proves runtime database role (aire_app_user) cannot bypass RLS", async () => {
    // Query directly via raw SQL using the runtime role without setting context
    const rows = await runtimePrisma.$queryRaw<
      unknown[]
    >`SELECT * FROM institution_records`;
    expect(rows).toEqual([]);
  });
});
