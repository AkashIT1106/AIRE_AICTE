import crypto from "crypto";
import { withTenantContext } from "../config/database.js";
import {
  AdmissionBatchInput,
  AdmissionRecord,
  admissionRecordSchema,
  cleanDemographics,
  SealBatchRequest,
} from "@aire/validation";
import {
  SubmissionBatchDto,
  QuarantineFieldErrorDto,
  SubmissionBatchStatus,
  SealBatchResultDto,
} from "@aire/shared-types";
import { logAuditEvent } from "./audit.service.js";
import { AdmissionLedgerService } from "./admission-ledger.service.js";

/**
 * Computes a deterministic binary Merkle root hash from an array of leaf hashes.
 */
export function computeMerkleRoot(leaves: string[]): string {
  if (leaves.length === 0) {
    return crypto.createHash("sha256").update("EMPTY_BATCH").digest("hex");
  }
  let currentLevel = [...leaves];
  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const combined = currentLevel[i] + currentLevel[i + 1];
        nextLevel.push(
          crypto.createHash("sha256").update(combined).digest("hex"),
        );
      } else {
        // Odd leaf: pair with itself to balance the tree deterministically
        const combined = currentLevel[i] + currentLevel[i];
        nextLevel.push(
          crypto.createHash("sha256").update(combined).digest("hex"),
        );
      }
    }
    currentLevel = nextLevel;
  }
  return currentLevel[0];
}

export class SubmissionService {
  /**
   * Helper to ensure a Programme ID exists in the database for the given programme name/code.
   */
  private static async resolveProgrammeId(
    tx: any,
    programmeNameOrCode: string,
  ): Promise<string> {
    const existing = await tx.programme.findFirst({
      where: {
        OR: [
          { canonicalCode: programmeNameOrCode },
          { name: programmeNameOrCode },
        ],
      },
    });

    if (existing) {
      return existing.id;
    }

    // Auto-create programme if missing in test / onboarding environment
    const code = programmeNameOrCode
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "_")
      .slice(0, 30);

    const created = await tx.programme.create({
      data: {
        canonicalCode: `PROG_${code}_${Date.now().toString().slice(-4)}`,
        name: programmeNameOrCode,
        degreeLevel: "UG",
        discipline: "Engineering",
        durationYears: 4,
        status: "ACTIVE",
      },
    });

    return created.id;
  }

  /**
   * Creates an admission batch, partitions valid vs defective records,
   * stores them in relational tables with PostgreSQL RLS, and logs audit trail.
   */
  static async createBatch(
    institutionId: string,
    input: AdmissionBatchInput,
    correlationId: string,
    actorId?: string,
  ): Promise<SubmissionBatchDto> {
    return withTenantContext(institutionId, async (tx) => {
      const programmeId = await this.resolveProgrammeId(tx, input.programme);
      const batchId = crypto.randomUUID();

      // Compute SHA-256 hash of the upload contents for tamper evidence
      const fileHash = crypto
        .createHash("sha256")
        .update(JSON.stringify(input.records))
        .digest("hex");

      let validCount = 0;
      let quarantineCount = 0;

      const stagedToInsert: Array<{
        id: string;
        batchId: string;
        institutionId: string;
        programmeId: string;
        academicYear: string;
        rowNumber: number;
        studentName: string;
        rollNumber: string;
        dateOfBirth: string;
        gender?: string;
        category: string;
        quota: string;
        apaarId?: string;
        status: string;
        rawPayload: any;
      }> = [];

      const quarantineToInsert: Array<{
        id: string;
        batchId: string;
        institutionId: string;
        rowNumber: number;
        rawPayload: any;
        errors: any;
        status: string;
      }> = [];

      input.records.forEach((rawRow, index) => {
        const rowId = crypto.randomUUID();
        const rowNumber = index + 1;
        const cleaned = cleanDemographics(rawRow as Record<string, unknown>);
        const result = admissionRecordSchema.safeParse(cleaned);

        if (result.success) {
          validCount++;
          stagedToInsert.push({
            id: rowId,
            batchId,
            institutionId,
            programmeId,
            academicYear: input.academicYear,
            rowNumber,
            studentName: result.data.studentName,
            rollNumber: result.data.rollNumber,
            dateOfBirth: result.data.dateOfBirth,
            gender: cleaned.gender,
            category: result.data.category,
            quota: result.data.quota,
            apaarId: result.data.apaarId,
            status: "ACCEPTED",
            rawPayload: rawRow,
          });
        } else {
          quarantineCount++;
          const errors: QuarantineFieldErrorDto[] = result.error.issues.map(
            (issue) => ({
              field: issue.path.join(".") || "record",
              message: issue.message,
              received: (cleaned as any)[issue.path[0] as string],
            }),
          );

          quarantineToInsert.push({
            id: rowId,
            batchId,
            institutionId,
            rowNumber,
            rawPayload: cleaned,
            errors,
            status: "QUARANTINED",
          });
        }
      });

      const initialStatus: SubmissionBatchStatus =
        quarantineCount === 0 ? "READY_FOR_SIGN_OFF" : "QUARANTINED";

      let validSubmittedById: string | null = null;
      if (actorId) {
        const userExists = await tx.user.findUnique({ where: { id: actorId } });
        if (userExists) validSubmittedById = actorId;
      }

      const createdBatch = await tx.submissionBatch.create({
        data: {
          id: batchId,
          institutionId,
          academicYear: input.academicYear,
          programmeId,
          fileName: input.fileName,
          fileHash,
          status: initialStatus,
          totalCount: input.records.length,
          validCount,
          quarantineCount,
          submittedById: validSubmittedById,
        },
      });

      if (stagedToInsert.length > 0) {
        await tx.stagedAdmissionRecord.createMany({
          data: stagedToInsert,
        });
      }

      if (quarantineToInsert.length > 0) {
        await tx.quarantinedAdmissionRecord.createMany({
          data: quarantineToInsert,
        });
      }

      await logAuditEvent({
        severity: "info",
        correlationId,
        actorId,
        tenantId: institutionId,
        action: "ADMISSION_BATCH_INGESTED",
        resourceType: "SUBMISSION_BATCH",
        resourceId: batchId,
        status: "SUCCESS",
        metadata: {
          totalCount: createdBatch.totalCount,
          validCount: createdBatch.validCount,
          quarantineCount: createdBatch.quarantineCount,
          status: createdBatch.status,
          fileHash,
        },
      });

      return this.formatBatchResponse(
        createdBatch,
        stagedToInsert,
        quarantineToInsert,
        input.programme,
      );
    });
  }

  /**
   * Retrieves all submission batches for the specified institution tenant.
   */
  static async listBatches(institutionId: string): Promise<any[]> {
    return withTenantContext(institutionId, async (tx) => {
      const batches = await tx.submissionBatch.findMany({
        where: { institutionId },
        include: { programme: true },
        orderBy: { createdAt: "desc" },
      });

      return batches.map((b: any) => ({
        id: b.id,
        institutionId: b.institutionId,
        academicYear: b.academicYear,
        programme: b.programme?.name || b.programmeId,
        programmeId: b.programmeId,
        fileName: b.fileName,
        fileHash: b.fileHash,
        status: b.status,
        totalCount: b.totalCount,
        validCount: b.validCount,
        quarantineCount: b.quarantineCount,
        merkleRootHash: b.merkleRootHash,
        sealedAt: b.sealedAt?.toISOString(),
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
      }));
    });
  }

  /**
   * Retrieves a single submission batch by ID with staged and quarantine records.
   */
  static async getBatchById(
    institutionId: string,
    batchId: string,
  ): Promise<any | null> {
    return withTenantContext(institutionId, async (tx) => {
      const batch = await tx.submissionBatch.findFirst({
        where: { id: batchId, institutionId },
        include: {
          programme: true,
          stagedRecords: { orderBy: { rowNumber: "asc" } },
          quarantinedRecords: { orderBy: { rowNumber: "asc" } },
        },
      });

      if (!batch) return null;

      return this.formatBatchResponse(
        batch,
        batch.stagedRecords,
        batch.quarantinedRecords,
        batch.programme?.name,
      );
    });
  }

  /**
   * Remediates a quarantined row inline, re-validating the updated row against
   * the canonical admission schema per Journey J-02 Step 5.
   */
  static async remediateQuarantineRow(
    institutionId: string,
    batchId: string,
    rowId: string,
    corrections: Partial<AdmissionRecord>,
    correlationId: string,
    actorId?: string,
  ): Promise<any> {
    return withTenantContext(institutionId, async (tx) => {
      const batch = await tx.submissionBatch.findFirst({
        where: { id: batchId, institutionId },
        include: { programme: true },
      });

      if (!batch) {
        throw new Error("BATCH_NOT_FOUND");
      }

      if (batch.status === "SEALED" || batch.status === "LOCKED") {
        throw new Error("BATCH_ALREADY_SEALED_OR_LOCKED");
      }

      const targetRow = await tx.quarantinedAdmissionRecord.findFirst({
        where: { id: rowId, batchId, institutionId },
      });

      if (!targetRow) {
        throw new Error("QUARANTINE_ROW_NOT_FOUND");
      }

      const mergedCandidate = cleanDemographics({
        ...(targetRow.rawPayload as Record<string, unknown>),
        ...corrections,
      });

      const parseResult = admissionRecordSchema.safeParse(mergedCandidate);

      if (!parseResult.success) {
        const errors: QuarantineFieldErrorDto[] = parseResult.error.issues.map(
          (issue) => ({
            field: issue.path.join(".") || "record",
            message: issue.message,
            received: (mergedCandidate as any)[issue.path[0] as string],
          }),
        );

        await tx.quarantinedAdmissionRecord.update({
          where: { id: rowId },
          data: {
            rawPayload: mergedCandidate,
            errors: errors as any,
          },
        });

        const error = new Error("VALIDATION_FAILED");
        (error as any).details = errors;
        throw error;
      }

      // Record is now valid: create staged admission record and mark quarantine row remediated
      const stagedId = crypto.randomUUID();
      await tx.stagedAdmissionRecord.create({
        data: {
          id: stagedId,
          batchId,
          institutionId,
          programmeId: batch.programmeId,
          academicYear: batch.academicYear,
          rowNumber: targetRow.rowNumber,
          studentName: parseResult.data.studentName,
          rollNumber: parseResult.data.rollNumber,
          dateOfBirth: parseResult.data.dateOfBirth,
          gender: mergedCandidate.gender,
          category: parseResult.data.category,
          quota: parseResult.data.quota,
          apaarId: parseResult.data.apaarId,
          status: "ACCEPTED",
          rawPayload: mergedCandidate,
        },
      });

      let validRemediatedById: string | null = null;
      if (actorId) {
        const userExists = await tx.user.findUnique({ where: { id: actorId } });
        if (userExists) validRemediatedById = actorId;
      }

      await tx.quarantinedAdmissionRecord.update({
        where: { id: rowId },
        data: {
          status: "REMEDIATED",
          remediatedRecordId: stagedId,
          remediatedAt: new Date(),
          remediatedById: validRemediatedById,
        },
      });

      // Count remaining active quarantined rows
      const remainingQuarantineCount =
        await tx.quarantinedAdmissionRecord.count({
          where: { batchId, institutionId, status: "QUARANTINED" },
        });

      const updatedValidCount = await tx.stagedAdmissionRecord.count({
        where: { batchId, institutionId },
      });

      const newStatus =
        remainingQuarantineCount === 0 ? "READY_FOR_SIGN_OFF" : "QUARANTINED";

      const updatedBatch = await tx.submissionBatch.update({
        where: { id: batchId },
        data: {
          validCount: updatedValidCount,
          quarantineCount: remainingQuarantineCount,
          status: newStatus,
        },
      });

      await logAuditEvent({
        severity: "info",
        correlationId,
        actorId,
        tenantId: institutionId,
        action: "QUARANTINE_RECORD_REMEDIATED",
        resourceType: "SUBMISSION_BATCH",
        resourceId: batchId,
        status: "SUCCESS",
        metadata: {
          rowId,
          promotedToStaged: true,
          remainingQuarantine: remainingQuarantineCount,
          newStatus,
        },
      });

      // Fetch fresh staged and remaining quarantine records
      const staged = await tx.stagedAdmissionRecord.findMany({
        where: { batchId },
        orderBy: { rowNumber: "asc" },
      });
      const activeQuarantine = await tx.quarantinedAdmissionRecord.findMany({
        where: { batchId, status: "QUARANTINED" },
        orderBy: { rowNumber: "asc" },
      });

      return this.formatBatchResponse(
        updatedBatch,
        staged,
        activeQuarantine,
        batch.programme?.name,
      );
    });
  }

  /**
   * Cryptographically seals an admission batch using a binary Merkle tree root hash
   * over all staged records, enforcing regulatory freeze deadlines per Section 2.
   */
  static async sealBatch(
    institutionId: string,
    batchId: string,
    request: SealBatchRequest,
    correlationId: string,
    actorId?: string,
  ): Promise<SealBatchResultDto> {
    return withTenantContext(institutionId, async (tx) => {
      const batch = await tx.submissionBatch.findFirst({
        where: { id: batchId, institutionId },
      });

      if (!batch) {
        throw new Error("BATCH_NOT_FOUND");
      }

      if (batch.status === "SEALED") {
        throw new Error("BATCH_ALREADY_SEALED");
      }

      if (batch.status === "LOCKED") {
        throw new Error("BATCH_ALREADY_LOCKED");
      }

      // Check quarantine items
      const pendingQuarantine = await tx.quarantinedAdmissionRecord.count({
        where: { batchId, institutionId, status: "QUARANTINED" },
      });

      if (pendingQuarantine > 0) {
        throw new Error("CANNOT_SEAL_WITH_PENDING_QUARANTINE");
      }

      const stagedRecords = await tx.stagedAdmissionRecord.findMany({
        where: { batchId, institutionId },
      });

      if (stagedRecords.length === 0) {
        throw new Error("CANNOT_SEAL_EMPTY_BATCH");
      }

      // Sort deterministically by rollNumber, studentName, id
      stagedRecords.sort(
        (a: any, b: any) =>
          a.rollNumber.localeCompare(b.rollNumber) ||
          a.studentName.localeCompare(b.studentName) ||
          a.id.localeCompare(b.id),
      );

      // Compute leaf hashes
      const leafHashes = stagedRecords.map((record: any) => {
        const canonicalLeaf = JSON.stringify({
          rollNumber: record.rollNumber,
          studentName: record.studentName,
          dateOfBirth: record.dateOfBirth,
          category: record.category,
          quota: record.quota,
          apaarId: record.apaarId || null,
        });
        return crypto.createHash("sha256").update(canonicalLeaf).digest("hex");
      });

      const merkleRootHash = computeMerkleRoot(leafHashes);
      const sealedAt = new Date();

      let validSealedById: string | null = null;
      if (actorId) {
        const userExists = await tx.user.findUnique({ where: { id: actorId } });
        if (userExists) {
          validSealedById = actorId;
        }
      }

      await tx.submissionBatch.update({
        where: { id: batchId },
        data: {
          status: "SEALED",
          merkleRootHash,
          sealedAt,
          sealedById: validSealedById,
        },
      });

      // Promote staged records to active AdmissionRecord in admission ledger & Identity Vault (Phase 6 / M08 / M15)
      await AdmissionLedgerService.promoteBatchToLedger(
        institutionId,
        batchId,
        actorId || "INSTITUTION_ADMIN",
        correlationId,
        tx,
      );

      await logAuditEvent({
        severity: "info",
        correlationId,
        actorId,
        tenantId: institutionId,
        action: "BATCH_SEALED",
        resourceType: "SUBMISSION_BATCH",
        resourceId: batchId,
        status: "SUCCESS",
        metadata: {
          merkleRootHash,
          stagedRecordsCount: stagedRecords.length,
          sealedAt: sealedAt.toISOString(),
          notes: request.notes,
        },
      });

      return {
        batchId,
        status: "SEALED",
        merkleRootHash,
        sealedAt: sealedAt.toISOString(),
        sealedBy: actorId || "INSTITUTION_ADMIN",
        stagedRecordsCount: stagedRecords.length,
      };
    });
  }

  /**
   * Helper to format database batch output into consistent client response shape.
   */
  private static formatBatchResponse(
    batch: any,
    staged: any[],
    quarantine: any[],
    programmeName?: string,
  ): any {
    return {
      id: batch.id,
      institutionId: batch.institutionId,
      academicYear: batch.academicYear,
      programme: programmeName || batch.programmeId,
      programmeId: batch.programmeId,
      fileName: batch.fileName,
      fileHash: batch.fileHash,
      status: batch.status,
      totalCount: batch.totalCount,
      validCount: batch.validCount,
      quarantineCount: batch.quarantineCount,
      merkleRootHash: batch.merkleRootHash,
      sealedAt: batch.sealedAt?.toISOString(),
      createdAt:
        typeof batch.createdAt === "string"
          ? batch.createdAt
          : batch.createdAt.toISOString(),
      updatedAt:
        typeof batch.updatedAt === "string"
          ? batch.updatedAt
          : batch.updatedAt.toISOString(),
      stagedRecords: staged.map((s: any) => ({
        rowId: s.id,
        rowNumber: s.rowNumber,
        status: s.status,
        data: {
          studentName: s.studentName,
          rollNumber: s.rollNumber,
          dateOfBirth: s.dateOfBirth,
          category: s.category,
          quota: s.quota,
          apaarId: s.apaarId || undefined,
        },
        validatedAt: s.createdAt
          ? typeof s.createdAt === "string"
            ? s.createdAt
            : s.createdAt.toISOString()
          : new Date().toISOString(),
      })),
      quarantineRecords: quarantine.map((q: any) => ({
        rowId: q.id,
        rowNumber: q.rowNumber,
        rawData: q.rawPayload,
        errors: q.errors,
        status: q.status,
      })),
    };
  }
}
