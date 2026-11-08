import crypto from "node:crypto";
import { getPrismaClient, withTenantContext } from "../config/database.js";
import { logAuditEvent } from "./audit.service.js";
import { IdentityVaultService } from "./identity-vault.service.js";
import { IdentityGatewayService } from "./identity-gateway/index.js";

export const GENESIS_PREVIOUS_HASH = "0".repeat(64);

export interface BranchChangeRequest {
  newProgrammeId: string;
  reason: string;
  approvalReference: string;
}

export interface CancellationRequest {
  cancellationReason: string;
  evidenceDocumentHash: string;
}

export interface MigrationRequest {
  destinationInstitution: string;
  migrationOrderNumber: string;
  noObjectionCertHash: string;
}

export interface LedgerIntegrityVerificationResult {
  valid: boolean;
  eventCount: number;
  brokenSequenceAt?: number;
  message?: string;
}

export interface ListAdmissionsFilter {
  programmeId?: string;
  academicYear?: string;
  status?: string;
  apaarStatus?: string;
  page?: number;
  pageSize?: number;
}

export class AdmissionLedgerService {
  /**
   * Deterministically computes the cryptographic SHA-256 hash for a ledger event.
   */
  static computeEventHash(
    previousHash: string,
    sequenceNumber: number,
    eventType: string,
    payload: Record<string, unknown>,
    timestamp: string,
    actorId?: string | null,
  ): string {
    const canonicalPayload = JSON.stringify(
      payload,
      Object.keys(payload).sort(),
    );
    const content = `${previousHash}:${sequenceNumber}:${eventType}:${canonicalPayload}:${timestamp}:${actorId || ""}`;
    return crypto.createHash("sha256").update(content).digest("hex");
  }

  /**
   * Promotes validated staged student records into active AdmissionRecord entries
   * inside the admission ledger and encrypts PII into the Identity Vault.
   */
  static async promoteBatchToLedger(
    institutionId: string,
    batchId: string,
    actorId: string,
    correlationId: string,
    externalTx?: any,
  ): Promise<{ promotedCount: number }> {
    const executeInTx = async (tx: any) => {
      const stagedRecords = await tx.stagedAdmissionRecord.findMany({
        where: { batchId, institutionId, status: "ACCEPTED" },
      });

      if (stagedRecords.length === 0) {
        return { promotedCount: 0 };
      }

      // Sort deterministically for reproducible sequence creation
      stagedRecords.sort(
        (a: any, b: any) =>
          a.rollNumber.localeCompare(b.rollNumber) ||
          a.studentName.localeCompare(b.studentName) ||
          a.id.localeCompare(b.id),
      );

      let count = 0;
      for (const staged of stagedRecords) {
        // 1. Store in Identity Vault with AES-256-GCM envelope encryption
        const demographicPayload = {
          studentName: staged.studentName,
          dateOfBirth: staged.dateOfBirth,
          gender: staged.gender,
          rollNumber: staged.rollNumber,
          apaarId: staged.apaarId,
          category: staged.category,
          quota: staged.quota,
          rawPayload: staged.rawPayload as Record<string, unknown> | null,
        };

        const envelope = await IdentityVaultService.storeInVault(
          demographicPayload,
          tx,
        );

        // 2. Insert operational AdmissionRecord
        const admissionRecord = await tx.admissionRecord.create({
          data: {
            tenantId: institutionId,
            batchId,
            programmeId: staged.programmeId,
            academicYear: staged.academicYear,
            studentToken: envelope.studentToken,
            category: staged.category,
            quota: staged.quota,
            status: "ACTIVE",
            apaarStatus: "UNVERIFIED",
          },
        });

        // 3. Compute Genesis Ledger Event (Sequence 1)
        const isLateral =
          staged.quota?.toLowerCase().includes("lateral") ||
          staged.category?.toLowerCase().includes("lateral");
        const eventType = isLateral ? "LATERAL_ENTRY" : "ADMITTED";
        const now = new Date();
        const timestampStr = now.toISOString();

        const initialPayload = {
          batchId,
          programmeId: staged.programmeId,
          academicYear: staged.academicYear,
          category: staged.category,
          quota: staged.quota,
          initialStatus: "ACTIVE",
        };

        const eventHash = this.computeEventHash(
          GENESIS_PREVIOUS_HASH,
          1,
          eventType,
          initialPayload,
          timestampStr,
          actorId,
        );

        await tx.ledgerEvent.create({
          data: {
            admissionRecordId: admissionRecord.id,
            institutionId,
            eventType,
            sequenceNumber: 1,
            previousHash: GENESIS_PREVIOUS_HASH,
            hash: eventHash,
            payload: initialPayload,
            actorId,
            timestamp: now,
          },
        });

        count++;
      }

      await logAuditEvent({
        severity: "info",
        correlationId,
        actorId,
        tenantId: institutionId,
        action: "BATCH_PROMOTED_TO_ADMISSION_LEDGER",
        resourceType: "SUBMISSION_BATCH",
        resourceId: batchId,
        status: "SUCCESS",
        metadata: {
          promotedCount: count,
        },
      });

      return { promotedCount: count };
    };

    if (externalTx) {
      return executeInTx(externalTx);
    }
    return withTenantContext(institutionId, executeInTx);
  }

  /**
   * Appends an authorized BRANCH_CHANGE event to a student's admission ledger.
   */
  static async recordBranchChange(
    institutionId: string,
    admissionRecordId: string,
    request: BranchChangeRequest,
    actorId: string,
    correlationId: string,
  ): Promise<any> {
    return withTenantContext(institutionId, async (tx) => {
      const record = await tx.admissionRecord.findFirst({
        where: { id: admissionRecordId, tenantId: institutionId },
      });

      if (!record) {
        throw new Error("ADMISSION_RECORD_NOT_FOUND");
      }
      if (record.status !== "ACTIVE") {
        throw new Error(
          `CANNOT_TRANSFER_INACTIVE_RECORD: Status is ${record.status}`,
        );
      }

      // Verify destination programme exists
      const targetProg = await tx.programme.findUnique({
        where: { id: request.newProgrammeId },
      });
      if (!targetProg) {
        throw new Error("DESTINATION_PROGRAMME_NOT_FOUND");
      }

      // Find latest ledger event to build hash chain
      const lastEvent = await tx.ledgerEvent.findFirst({
        where: { admissionRecordId },
        orderBy: { sequenceNumber: "desc" },
      });

      const nextSeq = lastEvent ? lastEvent.sequenceNumber + 1 : 1;
      const prevHash = lastEvent ? lastEvent.hash : GENESIS_PREVIOUS_HASH;
      const now = new Date();
      const timestampStr = now.toISOString();

      const eventPayload = {
        previousProgrammeId: record.programmeId,
        newProgrammeId: request.newProgrammeId,
        reason: request.reason,
        approvalReference: request.approvalReference,
      };

      const eventHash = this.computeEventHash(
        prevHash,
        nextSeq,
        "BRANCH_CHANGE",
        eventPayload,
        timestampStr,
        actorId,
      );

      const newEvent = await tx.ledgerEvent.create({
        data: {
          admissionRecordId,
          institutionId,
          eventType: "BRANCH_CHANGE",
          sequenceNumber: nextSeq,
          previousHash: prevHash,
          hash: eventHash,
          payload: eventPayload,
          actorId,
          timestamp: now,
        },
      });

      const updatedRecord = await tx.admissionRecord.update({
        where: { id: admissionRecordId },
        data: { programmeId: request.newProgrammeId },
      });

      await logAuditEvent({
        severity: "info",
        correlationId,
        actorId,
        tenantId: institutionId,
        action: "STUDENT_BRANCH_CHANGED",
        resourceType: "ADMISSION_RECORD",
        resourceId: admissionRecordId,
        status: "SUCCESS",
        metadata: {
          fromProgramme: record.programmeId,
          toProgramme: request.newProgrammeId,
          sequenceNumber: nextSeq,
        },
      });

      return { record: updatedRecord, ledgerEvent: newEvent };
    });
  }

  /**
   * Appends an authorized CANCELLATION event and releases seat quota entitlement.
   */
  static async recordCancellation(
    institutionId: string,
    admissionRecordId: string,
    request: CancellationRequest,
    actorId: string,
    correlationId: string,
  ): Promise<any> {
    return withTenantContext(institutionId, async (tx) => {
      const record = await tx.admissionRecord.findFirst({
        where: { id: admissionRecordId, tenantId: institutionId },
      });

      if (!record) {
        throw new Error("ADMISSION_RECORD_NOT_FOUND");
      }
      if (record.status !== "ACTIVE") {
        throw new Error(
          `CANNOT_CANCEL_INACTIVE_RECORD: Status is ${record.status}`,
        );
      }

      const lastEvent = await tx.ledgerEvent.findFirst({
        where: { admissionRecordId },
        orderBy: { sequenceNumber: "desc" },
      });

      const nextSeq = lastEvent ? lastEvent.sequenceNumber + 1 : 1;
      const prevHash = lastEvent ? lastEvent.hash : GENESIS_PREVIOUS_HASH;
      const now = new Date();
      const timestampStr = now.toISOString();

      const eventPayload = {
        cancellationReason: request.cancellationReason,
        evidenceDocumentHash: request.evidenceDocumentHash,
        releasedCategory: record.category,
        releasedQuota: record.quota,
      };

      const eventHash = this.computeEventHash(
        prevHash,
        nextSeq,
        "CANCELLATION",
        eventPayload,
        timestampStr,
        actorId,
      );

      const newEvent = await tx.ledgerEvent.create({
        data: {
          admissionRecordId,
          institutionId,
          eventType: "CANCELLATION",
          sequenceNumber: nextSeq,
          previousHash: prevHash,
          hash: eventHash,
          payload: eventPayload,
          actorId,
          timestamp: now,
        },
      });

      const updatedRecord = await tx.admissionRecord.update({
        where: { id: admissionRecordId },
        data: { status: "CANCELLED" },
      });

      await logAuditEvent({
        severity: "info",
        correlationId,
        actorId,
        tenantId: institutionId,
        action: "ADMISSION_CANCELLED",
        resourceType: "ADMISSION_RECORD",
        resourceId: admissionRecordId,
        status: "SUCCESS",
        metadata: {
          releasedCategory: record.category,
          releasedQuota: record.quota,
          sequenceNumber: nextSeq,
        },
      });

      return { record: updatedRecord, ledgerEvent: newEvent };
    });
  }

  /**
   * Appends an authorized MIGRATION event to the student's admission ledger.
   */
  static async recordMigration(
    institutionId: string,
    admissionRecordId: string,
    request: MigrationRequest,
    actorId: string,
    correlationId: string,
  ): Promise<any> {
    return withTenantContext(institutionId, async (tx) => {
      const record = await tx.admissionRecord.findFirst({
        where: { id: admissionRecordId, tenantId: institutionId },
      });

      if (!record) {
        throw new Error("ADMISSION_RECORD_NOT_FOUND");
      }
      if (record.status !== "ACTIVE") {
        throw new Error(
          `CANNOT_MIGRATE_INACTIVE_RECORD: Status is ${record.status}`,
        );
      }

      const lastEvent = await tx.ledgerEvent.findFirst({
        where: { admissionRecordId },
        orderBy: { sequenceNumber: "desc" },
      });

      const nextSeq = lastEvent ? lastEvent.sequenceNumber + 1 : 1;
      const prevHash = lastEvent ? lastEvent.hash : GENESIS_PREVIOUS_HASH;
      const now = new Date();
      const timestampStr = now.toISOString();

      const eventPayload = {
        destinationInstitution: request.destinationInstitution,
        migrationOrderNumber: request.migrationOrderNumber,
        noObjectionCertHash: request.noObjectionCertHash,
      };

      const eventHash = this.computeEventHash(
        prevHash,
        nextSeq,
        "MIGRATION",
        eventPayload,
        timestampStr,
        actorId,
      );

      const newEvent = await tx.ledgerEvent.create({
        data: {
          admissionRecordId,
          institutionId,
          eventType: "MIGRATION",
          sequenceNumber: nextSeq,
          previousHash: prevHash,
          hash: eventHash,
          payload: eventPayload,
          actorId,
          timestamp: now,
        },
      });

      const updatedRecord = await tx.admissionRecord.update({
        where: { id: admissionRecordId },
        data: { status: "MIGRATED" },
      });

      await logAuditEvent({
        severity: "info",
        correlationId,
        actorId,
        tenantId: institutionId,
        action: "STUDENT_MIGRATED",
        resourceType: "ADMISSION_RECORD",
        resourceId: admissionRecordId,
        status: "SUCCESS",
        metadata: {
          destination: request.destinationInstitution,
          sequenceNumber: nextSeq,
        },
      });

      return { record: updatedRecord, ledgerEvent: newEvent };
    });
  }

  /**
   * Verifies cryptographic hash continuity across all ledger events for an admission record.
   */
  static async verifyLedgerIntegrity(
    admissionRecordId: string,
    prismaClient?: any,
  ): Promise<LedgerIntegrityVerificationResult> {
    const prisma = prismaClient || getPrismaClient();
    const events = await prisma.ledgerEvent.findMany({
      where: { admissionRecordId },
      orderBy: { sequenceNumber: "asc" },
    });

    if (events.length === 0) {
      return { valid: true, eventCount: 0 };
    }

    let expectedPrevHash = GENESIS_PREVIOUS_HASH;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const expectedSeq = i + 1;

      if (event.sequenceNumber !== expectedSeq) {
        return {
          valid: false,
          eventCount: events.length,
          brokenSequenceAt: event.sequenceNumber,
          message: `Sequence gap detected: expected ${expectedSeq}, found ${event.sequenceNumber}`,
        };
      }

      if (event.previousHash !== expectedPrevHash) {
        return {
          valid: false,
          eventCount: events.length,
          brokenSequenceAt: event.sequenceNumber,
          message: `Previous hash mismatch at sequence ${event.sequenceNumber}`,
        };
      }

      const calculatedHash = this.computeEventHash(
        event.previousHash,
        event.sequenceNumber,
        event.eventType,
        event.payload as Record<string, unknown>,
        event.timestamp.toISOString(),
        event.actorId,
      );

      if (calculatedHash !== event.hash) {
        return {
          valid: false,
          eventCount: events.length,
          brokenSequenceAt: event.sequenceNumber,
          message: `Event hash corrupted at sequence ${event.sequenceNumber}`,
        };
      }

      expectedPrevHash = event.hash;
    }

    return { valid: true, eventCount: events.length };
  }

  /**
   * Triggers external identity verification for an admission record via IdentityGateway.
   */
  static async verifyAdmissionIdentity(
    institutionId: string,
    admissionRecordId: string,
    actorId: string,
    correlationId: string,
  ): Promise<any> {
    return withTenantContext(institutionId, async (tx) => {
      const record = await tx.admissionRecord.findFirst({
        where: { id: admissionRecordId, tenantId: institutionId },
      });

      if (!record) {
        throw new Error("ADMISSION_RECORD_NOT_FOUND");
      }

      // Decrypt demographic payload from vault under ADMISSION_VERIFICATION purpose
      const identity = await IdentityVaultService.decryptStudentRecord(
        record.studentToken,
        "ADMISSION_VERIFICATION",
        actorId,
        correlationId,
        institutionId,
        tx,
      );

      if (!identity.demographics.apaarId) {
        return {
          record,
          verificationResult: {
            status: "UNVERIFIED",
            message: "No APAAR ID provided on student record",
          },
        };
      }

      const verificationResult = await IdentityGatewayService.verifyApaar({
        apaarId: identity.demographics.apaarId,
        studentName: identity.demographics.studentName,
        dateOfBirth: identity.demographics.dateOfBirth,
        gender: identity.demographics.gender || undefined,
        correlationId,
      });

      const updatedRecord = await tx.admissionRecord.update({
        where: { id: admissionRecordId },
        data: {
          apaarStatus: verificationResult.status,
          apaarVerifiedAt:
            verificationResult.status === "VERIFIED" ? new Date() : null,
        },
      });

      await logAuditEvent({
        severity: "info",
        correlationId,
        actorId,
        tenantId: institutionId,
        action: "STUDENT_IDENTITY_VERIFIED",
        resourceType: "ADMISSION_RECORD",
        resourceId: admissionRecordId,
        status:
          verificationResult.status === "VERIFIED" ? "SUCCESS" : "FAILURE",
        metadata: {
          apaarStatus: verificationResult.status,
          mode: verificationResult.executionMode,
        },
      });

      return { record: updatedRecord, verificationResult };
    });
  }

  /**
   * Lists admission records for a tenant with optional filtering.
   */
  static async listAdmissions(
    institutionId: string,
    filters: ListAdmissionsFilter,
  ): Promise<{ data: any[]; total: number; page: number; pageSize: number }> {
    return withTenantContext(institutionId, async (tx) => {
      const page = Math.max(1, filters.page || 1);
      const pageSize = Math.min(100, Math.max(1, filters.pageSize || 20));
      const skip = (page - 1) * pageSize;

      const where: any = { tenantId: institutionId };
      if (filters.programmeId) where.programmeId = filters.programmeId;
      if (filters.academicYear) where.academicYear = filters.academicYear;
      if (filters.status) where.status = filters.status;
      if (filters.apaarStatus) where.apaarStatus = filters.apaarStatus;

      const [data, total] = await Promise.all([
        tx.admissionRecord.findMany({
          where,
          include: {
            programme: { select: { name: true, canonicalCode: true } },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: pageSize,
        }),
        tx.admissionRecord.count({ where }),
      ]);

      return { data, total, page, pageSize };
    });
  }

  /**
   * Retrieves a single admission record with its chronological ledger events.
   */
  static async getAdmissionDetails(
    institutionId: string,
    admissionRecordId: string,
  ): Promise<any> {
    return withTenantContext(institutionId, async (tx) => {
      const record = await tx.admissionRecord.findFirst({
        where: { id: admissionRecordId, tenantId: institutionId },
        include: {
          programme: true,
          batch: { select: { id: true, fileName: true, sealedAt: true } },
          ledgerEvents: { orderBy: { sequenceNumber: "asc" } },
        },
      });

      if (!record) {
        throw new Error("ADMISSION_RECORD_NOT_FOUND");
      }

      return record;
    });
  }
}
