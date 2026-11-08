import { describe, it, expect, vi } from "vitest";
import {
  AdmissionLedgerService,
  GENESIS_PREVIOUS_HASH,
} from "../services/admission-ledger.service.js";

// Mock audit service
vi.mock("../services/audit.service.js", () => ({
  logAuditEvent: vi.fn().mockResolvedValue(undefined),
}));

describe("AdmissionLedgerService (M08 Lifecycle Ledger)", () => {
  it("should compute deterministic SHA-256 event hash matching canonical format", () => {
    const payload = {
      fromProgramme: "prog_cs",
      toProgramme: "prog_ai",
      reason: "Merit transfer",
    };
    const timestamp = "2026-11-09T00:00:00.000Z";
    const hash1 = AdmissionLedgerService.computeEventHash(
      GENESIS_PREVIOUS_HASH,
      1,
      "ADMITTED",
      payload,
      timestamp,
      "admin_1",
    );
    const hash2 = AdmissionLedgerService.computeEventHash(
      GENESIS_PREVIOUS_HASH,
      1,
      "ADMITTED",
      {
        reason: "Merit transfer",
        toProgramme: "prog_ai",
        fromProgramme: "prog_cs",
      }, // permuted keys
      timestamp,
      "admin_1",
    );

    expect(hash1).toMatch(/^[0-9a-f]{64}$/);
    expect(hash1).toBe(hash2); // deterministic regardless of key order
  });

  it("should verify unbroken ledger event chain integrity", async () => {
    const recordId = "adm_test_001";
    const t1 = new Date("2026-08-01T10:00:00.000Z");
    const t2 = new Date("2026-09-01T10:00:00.000Z");

    const payload1 = { initialStatus: "ACTIVE" };
    const hash1 = AdmissionLedgerService.computeEventHash(
      GENESIS_PREVIOUS_HASH,
      1,
      "ADMITTED",
      payload1,
      t1.toISOString(),
      "admin_1",
    );

    const payload2 = { newProgrammeId: "prog_it" };
    const hash2 = AdmissionLedgerService.computeEventHash(
      hash1,
      2,
      "BRANCH_CHANGE",
      payload2,
      t2.toISOString(),
      "admin_1",
    );

    const mockEvents = [
      {
        id: "ev_1",
        admissionRecordId: recordId,
        sequenceNumber: 1,
        eventType: "ADMITTED",
        previousHash: GENESIS_PREVIOUS_HASH,
        hash: hash1,
        payload: payload1,
        timestamp: t1,
        actorId: "admin_1",
      },
      {
        id: "ev_2",
        admissionRecordId: recordId,
        sequenceNumber: 2,
        eventType: "BRANCH_CHANGE",
        previousHash: hash1,
        hash: hash2,
        payload: payload2,
        timestamp: t2,
        actorId: "admin_1",
      },
    ];

    const mockPrisma = {
      ledgerEvent: {
        findMany: vi.fn().mockResolvedValue(mockEvents),
      },
    };

    const result = await AdmissionLedgerService.verifyLedgerIntegrity(
      recordId,
      mockPrisma as any,
    );

    expect(result.valid).toBe(true);
    expect(result.eventCount).toBe(2);
  });

  it("should detect corrupted event hash and fail verification", async () => {
    const recordId = "adm_test_002";
    const t1 = new Date("2026-08-01T10:00:00.000Z");
    const payload1 = { initialStatus: "ACTIVE" };
    const hash1 = AdmissionLedgerService.computeEventHash(
      GENESIS_PREVIOUS_HASH,
      1,
      "ADMITTED",
      payload1,
      t1.toISOString(),
      "admin_1",
    );

    const mockEvents = [
      {
        id: "ev_1",
        admissionRecordId: recordId,
        sequenceNumber: 1,
        eventType: "ADMITTED",
        previousHash: GENESIS_PREVIOUS_HASH,
        hash: "corrupted_hash_" + hash1.slice(15), // Tampered hash!
        payload: payload1,
        timestamp: t1,
        actorId: "admin_1",
      },
    ];

    const mockPrisma = {
      ledgerEvent: {
        findMany: vi.fn().mockResolvedValue(mockEvents),
      },
    };

    const result = await AdmissionLedgerService.verifyLedgerIntegrity(
      recordId,
      mockPrisma as any,
    );

    expect(result.valid).toBe(false);
    expect(result.message).toContain("Event hash corrupted");
  });

  it("should detect broken sequence continuity and fail verification", async () => {
    const recordId = "adm_test_003";
    const t1 = new Date();
    const payload1 = {};
    const hash1 = AdmissionLedgerService.computeEventHash(
      GENESIS_PREVIOUS_HASH,
      1,
      "ADMITTED",
      payload1,
      t1.toISOString(),
      null,
    );

    const mockEvents = [
      {
        id: "ev_1",
        admissionRecordId: recordId,
        sequenceNumber: 1,
        eventType: "ADMITTED",
        previousHash: GENESIS_PREVIOUS_HASH,
        hash: hash1,
        payload: payload1,
        timestamp: t1,
        actorId: null,
      },
      {
        id: "ev_3", // skipped sequence 2!
        admissionRecordId: recordId,
        sequenceNumber: 3,
        eventType: "BRANCH_CHANGE",
        previousHash: hash1,
        hash: "def",
        payload: {},
        timestamp: new Date(),
        actorId: null,
      },
    ];

    const mockPrisma = {
      ledgerEvent: {
        findMany: vi.fn().mockResolvedValue(mockEvents),
      },
    };

    const result = await AdmissionLedgerService.verifyLedgerIntegrity(
      recordId,
      mockPrisma as any,
    );

    expect(result.valid).toBe(false);
    expect(result.message).toContain("Sequence gap detected");
  });
});
