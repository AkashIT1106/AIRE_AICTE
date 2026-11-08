import crypto from "node:crypto";
import { getPrismaClient } from "../config/database.js";
import { logAuditEvent } from "./audit.service.js";
import { logger } from "../config/logger.js";

export interface StudentDemographicPayload {
  studentName: string;
  dateOfBirth: string;
  gender?: string | null;
  rollNumber: string;
  apaarId?: string | null;
  category: string;
  quota: string;
  rawPayload?: Record<string, unknown> | null;
}

export interface EncryptedVaultEnvelope {
  studentToken: string;
  encryptedPayload: string;
  encryptedDek: string;
  apaarHash: string | null;
  keyVersion: string;
}

export interface DecryptedStudentIdentity {
  studentToken: string;
  demographics: StudentDemographicPayload;
  keyVersion: string;
}

export const VALID_PURPOSE_CODES = [
  "GRIEVANCE_REDRESSAL",
  "COURT_AUDIT",
  "REGULATORY_SCRUTINY",
  "STUDENT_SELF_ACCESS",
  "ADMISSION_VERIFICATION",
] as const;

export type ProcessingPurposeCode = (typeof VALID_PURPOSE_CODES)[number];

export class IdentityVaultService {
  private static readonly DEFAULT_KEY_VERSION = "v1";
  private static readonly ALGORITHM = "aes-256-gcm";
  private static readonly IV_LENGTH = 12; // 96 bits for GCM
  private static readonly TAG_LENGTH = 16; // 128 bits auth tag

  /**
   * Resolves or derives the 256-bit Master Key Encryption Key (KEK).
   */
  private static getMasterKek(): Buffer {
    const rawKey = process.env.IDENTITY_VAULT_MASTER_KEY;
    if (rawKey && rawKey.length >= 32) {
      return crypto.createHash("sha256").update(rawKey).digest();
    }
    // Deterministic fallback for test/dev environment
    return crypto
      .createHash("sha256")
      .update("aire-default-identity-vault-master-key-seed-2026")
      .digest();
  }

  /**
   * Generates a pseudonymous student reference token.
   */
  static generateStudentToken(): string {
    return `tok_${crypto.randomBytes(16).toString("hex")}`;
  }

  /**
   * Computes a blinded search hash for an APAAR ID to allow duplicate detection without exposing raw PII.
   */
  static computeBlindedApaarHash(apaarId?: string | null): string | null {
    if (!apaarId || !apaarId.trim()) return null;
    const normalized = apaarId.trim().replace(/\s+/g, "");
    return `sha256:${crypto.createHash("sha256").update(normalized).digest("hex")}`;
  }

  /**
   * Encrypts student demographic data with a new DEK, then wraps the DEK under the master KEK.
   */
  static encryptStudentRecord(
    demographics: StudentDemographicPayload,
    customStudentToken?: string,
  ): EncryptedVaultEnvelope {
    const studentToken = customStudentToken || this.generateStudentToken();
    const dek = crypto.randomBytes(32);
    const kek = this.getMasterKek();

    // 1. Encrypt demographic payload with DEK
    const payloadIv = crypto.randomBytes(this.IV_LENGTH);
    const payloadCipher = crypto.createCipheriv(
      this.ALGORITHM,
      dek,
      payloadIv,
      { authTagLength: this.TAG_LENGTH },
    );
    const payloadJson = JSON.stringify(demographics);
    const encryptedPayloadBytes = Buffer.concat([
      payloadCipher.update(payloadJson, "utf8"),
      payloadCipher.final(),
    ]);
    const payloadTag = payloadCipher.getAuthTag();

    const encryptedPayload = `v1:${payloadIv.toString("hex")}:${payloadTag.toString("hex")}:${encryptedPayloadBytes.toString("hex")}`;

    // 2. Wrap DEK under Master KEK
    const dekIv = crypto.randomBytes(this.IV_LENGTH);
    const dekCipher = crypto.createCipheriv(this.ALGORITHM, kek, dekIv, {
      authTagLength: this.TAG_LENGTH,
    });
    const encryptedDekBytes = Buffer.concat([
      dekCipher.update(dek),
      dekCipher.final(),
    ]);
    const dekTag = dekCipher.getAuthTag();

    const encryptedDek = `kek:v1:${dekIv.toString("hex")}:${dekTag.toString("hex")}:${encryptedDekBytes.toString("hex")}`;

    const apaarHash = this.computeBlindedApaarHash(demographics.apaarId);

    return {
      studentToken,
      encryptedPayload,
      encryptedDek,
      apaarHash,
      keyVersion: this.DEFAULT_KEY_VERSION,
    };
  }

  /**
   * Unwraps the DEK and decrypts the encrypted payload directly from envelope strings.
   */
  static decryptEnvelope(
    encryptedPayload: string,
    encryptedDek: string,
  ): StudentDemographicPayload {
    const kek = this.getMasterKek();

    // 1. Unwrap DEK (format: kek:v1:iv:tag:ciphertext)
    const dekParts = encryptedDek.split(":");
    if (
      dekParts.length !== 5 ||
      dekParts[0] !== "kek" ||
      dekParts[1] !== "v1"
    ) {
      throw new Error("CORRUPTED_ENCRYPTED_DEK");
    }
    const dekIv = Buffer.from(dekParts[2], "hex");
    const dekTag = Buffer.from(dekParts[3], "hex");
    const encryptedDekBytes = Buffer.from(dekParts[4], "hex");

    const dekDecipher = crypto.createDecipheriv(this.ALGORITHM, kek, dekIv, {
      authTagLength: this.TAG_LENGTH,
    });
    dekDecipher.setAuthTag(dekTag);
    const dek = Buffer.concat([
      dekDecipher.update(encryptedDekBytes),
      dekDecipher.final(),
    ]);

    // 2. Decrypt payload with DEK (format: v1:iv:tag:ciphertext)
    const payloadParts = encryptedPayload.split(":");
    if (payloadParts.length !== 4 || payloadParts[0] !== "v1") {
      throw new Error("CORRUPTED_ENCRYPTED_PAYLOAD");
    }
    const payloadIv = Buffer.from(payloadParts[1], "hex");
    const payloadTag = Buffer.from(payloadParts[2], "hex");
    const encryptedPayloadBytes = Buffer.from(payloadParts[3], "hex");

    const payloadDecipher = crypto.createDecipheriv(
      this.ALGORITHM,
      dek,
      payloadIv,
      { authTagLength: this.TAG_LENGTH },
    );
    payloadDecipher.setAuthTag(payloadTag);
    const decryptedPayloadBytes = Buffer.concat([
      payloadDecipher.update(encryptedPayloadBytes),
      payloadDecipher.final(),
    ]);

    return JSON.parse(
      decryptedPayloadBytes.toString("utf8"),
    ) as StudentDemographicPayload;
  }

  /**
   * Stores encrypted student identity in the Identity Vault.
   */
  static async storeInVault(
    demographics: StudentDemographicPayload,
    prismaClient?: any,
    customStudentToken?: string,
  ): Promise<EncryptedVaultEnvelope> {
    const envelope = this.encryptStudentRecord(
      demographics,
      customStudentToken,
    );
    const prisma = prismaClient || getPrismaClient();

    await prisma.identityVaultRecord.create({
      data: {
        studentToken: envelope.studentToken,
        encryptedPayload: envelope.encryptedPayload,
        encryptedDek: envelope.encryptedDek,
        apaarHash: envelope.apaarHash,
        keyVersion: envelope.keyVersion,
      },
    });

    return envelope;
  }

  /**
   * Decrypts student record with statutory purpose code attribution and immutable audit logging.
   */
  static async decryptStudentRecord(
    studentToken: string,
    purposeCode: string,
    actorId: string,
    correlationId: string,
    tenantId?: string | null,
    prismaClient?: any,
  ): Promise<DecryptedStudentIdentity> {
    if (!VALID_PURPOSE_CODES.includes(purposeCode as ProcessingPurposeCode)) {
      throw new Error(`INVALID_PROCESSING_PURPOSE_CODE: ${purposeCode}`);
    }

    const prisma = prismaClient || getPrismaClient();
    const vaultRecord = await prisma.identityVaultRecord.findUnique({
      where: { studentToken },
    });

    if (!vaultRecord) {
      throw new Error("VAULT_RECORD_NOT_FOUND");
    }

    const demographics = this.decryptEnvelope(
      vaultRecord.encryptedPayload,
      vaultRecord.encryptedDek,
    );

    // Purpose-bound access audit trail
    await logAuditEvent({
      severity: "info",
      correlationId,
      actorId,
      tenantId: tenantId || null,
      action: "VAULT_RECORD_DECRYPTED",
      resourceType: "IDENTITY_VAULT_RECORD",
      resourceId: studentToken,
      status: "SUCCESS",
      metadata: {
        purposeCode,
        keyVersion: vaultRecord.keyVersion,
      },
    });

    logger.info(
      { studentToken, purposeCode, correlationId, actorId },
      "Identity Vault record accessed under purpose binding",
    );

    return {
      studentToken,
      demographics,
      keyVersion: vaultRecord.keyVersion,
    };
  }
}
