import { describe, it, expect, vi } from "vitest";
import {
  IdentityVaultService,
  StudentDemographicPayload,
} from "../services/identity-vault.service.js";

// Mock audit service to verify purpose-bound logging
vi.mock("../services/audit.service.js", () => ({
  logAuditEvent: vi.fn().mockResolvedValue(undefined),
}));

describe("IdentityVaultService (M15 / ADR-008)", () => {
  const sampleDemographics: StudentDemographicPayload = {
    studentName: "Aarav Sharma",
    dateOfBirth: "2004-05-15",
    gender: "MALE",
    rollNumber: "2026-CS-001",
    apaarId: "123456789012",
    category: "GEN",
    quota: "General",
  };

  it("should generate a valid pseudonymous student token with prefix tok_", () => {
    const token = IdentityVaultService.generateStudentToken();
    expect(token).toMatch(/^tok_[0-9a-f]{32}$/);
  });

  it("should compute deterministic blinded search hash for APAAR ID", () => {
    const hash1 = IdentityVaultService.computeBlindedApaarHash("123456789012");
    const hash2 =
      IdentityVaultService.computeBlindedApaarHash(" 123456789012 ");
    const hash3 = IdentityVaultService.computeBlindedApaarHash("999999999999");

    expect(hash1).toMatch(/^sha256:[0-9a-f]{64}$/);
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(IdentityVaultService.computeBlindedApaarHash(null)).toBeNull();
  });

  it("should encrypt and decrypt demographic envelope accurately (AES-256-GCM roundtrip)", () => {
    const envelope =
      IdentityVaultService.encryptStudentRecord(sampleDemographics);

    expect(envelope.studentToken).toMatch(/^tok_/);
    expect(envelope.encryptedPayload.startsWith("v1:")).toBe(true);
    expect(envelope.encryptedDek.startsWith("kek:v1:")).toBe(true);
    expect(envelope.apaarHash).toMatch(/^sha256:/);

    // Decrypt directly from envelope
    const decrypted = IdentityVaultService.decryptEnvelope(
      envelope.encryptedPayload,
      envelope.encryptedDek,
    );

    expect(decrypted).toEqual(sampleDemographics);
    expect(decrypted.studentName).toBe("Aarav Sharma");
    expect(decrypted.apaarId).toBe("123456789012");
  });

  it("should reject decryption with corrupted authentication tag (tamper-evident check)", () => {
    const envelope =
      IdentityVaultService.encryptStudentRecord(sampleDemographics);
    const parts = envelope.encryptedPayload.split(":");
    // Corrupt auth tag (parts[2])
    const corruptedTag = "ff" + parts[2].slice(2);
    const corruptedPayload = `${parts[0]}:${parts[1]}:${corruptedTag}:${parts[3]}`;

    expect(() =>
      IdentityVaultService.decryptEnvelope(
        corruptedPayload,
        envelope.encryptedDek,
      ),
    ).toThrow();
  });

  it("should reject decryption with invalid purpose code", async () => {
    await expect(
      IdentityVaultService.decryptStudentRecord(
        "tok_123",
        "INVALID_UNAUTHORIZED_PURPOSE",
        "actor_1",
        "corr_1",
      ),
    ).rejects.toThrow(/INVALID_PROCESSING_PURPOSE_CODE/);
  });

  it("should decrypt and log audit event when authorized purpose code is provided", async () => {
    const { logAuditEvent } = await import("../services/audit.service.js");
    const envelope =
      IdentityVaultService.encryptStudentRecord(sampleDemographics);

    const mockPrisma = {
      identityVaultRecord: {
        findUnique: vi.fn().mockResolvedValue({
          studentToken: envelope.studentToken,
          encryptedPayload: envelope.encryptedPayload,
          encryptedDek: envelope.encryptedDek,
          keyVersion: "v1",
        }),
      },
    };

    const result = await IdentityVaultService.decryptStudentRecord(
      envelope.studentToken,
      "REGULATORY_SCRUTINY",
      "auditor_user_42",
      "corr_audit_99",
      "inst_1",
      mockPrisma as any,
    );

    expect(result.studentToken).toBe(envelope.studentToken);
    expect(result.demographics.studentName).toBe("Aarav Sharma");
    expect(logAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "VAULT_RECORD_DECRYPTED",
        actorId: "auditor_user_42",
        status: "SUCCESS",
        metadata: expect.objectContaining({
          purposeCode: "REGULATORY_SCRUTINY",
        }),
      }),
    );
  });
});
