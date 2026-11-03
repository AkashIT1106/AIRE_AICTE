import crypto from "crypto";
import { withTenantContext } from "../config/database.js";
import {
  AdmissionBatchInput,
  AdmissionRecord,
  admissionRecordSchema,
} from "@aire/validation";
import {
  SubmissionBatch,
  StagedRecord,
  QuarantineRecord,
  QuarantineFieldError,
  SubmissionBatchStatus,
} from "@aire/api-contracts";
import { logAuditEvent } from "./audit.service.js";

export class SubmissionService {
  /**
   * Processes an incoming admission batch, separating valid records into staged storage
   * and defective records into quarantine triage per Journey J-02.
   */
  static async createBatch(
    institutionId: string,
    input: AdmissionBatchInput,
    correlationId: string,
    actorId?: string,
  ): Promise<SubmissionBatch> {
    const batchId = crypto.randomUUID();
    const stagedRecords: StagedRecord[] = [];
    const quarantineRecords: QuarantineRecord[] = [];

    input.records.forEach((rawRow, index) => {
      const rowId = crypto.randomUUID();
      const rowNumber = index + 1;

      // Extract and normalize common column aliases
      const candidate: Record<string, unknown> = {
        studentName:
          rawRow.studentName ?? rawRow["Student Name"] ?? rawRow.name,
        rollNumber:
          rawRow.rollNumber ??
          rawRow["Roll Number"] ??
          rawRow.rollNo ??
          rawRow["Application ID"],
        dateOfBirth:
          rawRow.dateOfBirth ?? rawRow["Date of Birth"] ?? rawRow.dob,
        category:
          rawRow.category ??
          rawRow["Category"] ??
          rawRow["Reservation Category"],
        quota: rawRow.quota ?? rawRow["Quota"] ?? rawRow["Admission Quota"],
        apaarId: rawRow.apaarId ?? rawRow["APAAR ID"] ?? rawRow["APAAR"],
      };

      const result = admissionRecordSchema.safeParse(candidate);

      if (result.success) {
        stagedRecords.push({
          rowId,
          rowNumber,
          data: result.data,
          status: "ACCEPTED",
          validatedAt: new Date().toISOString(),
        });
      } else {
        const errors: QuarantineFieldError[] = result.error.issues.map(
          (issue) => ({
            field: issue.path.join(".") || "record",
            message: issue.message,
            received: candidate[issue.path[0] as string],
          }),
        );

        quarantineRecords.push({
          rowId,
          rowNumber,
          rawData: candidate,
          errors,
          status: "QUARANTINED",
        });
      }
    });

    const status: SubmissionBatchStatus =
      quarantineRecords.length === 0 ? "READY_FOR_SIGN_OFF" : "QUARANTINED";

    const batchData: SubmissionBatch = {
      id: batchId,
      institutionId,
      academicYear: input.academicYear,
      programme: input.programme,
      fileName: input.fileName,
      status,
      totalCount: input.records.length,
      validCount: stagedRecords.length,
      quarantineCount: quarantineRecords.length,
      stagedRecords,
      quarantineRecords,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await withTenantContext(institutionId, async (tx) => {
      return tx.institutionRecord.create({
        data: {
          id: batchId,
          institutionId,
          title: `SUBMISSION_BATCH:${batchId}`,
          payload: batchData as any,
        },
      });
    });

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
        totalCount: batchData.totalCount,
        validCount: batchData.validCount,
        quarantineCount: batchData.quarantineCount,
        status: batchData.status,
      },
    });

    return batchData;
  }

  /**
   * Retrieves all submission batches for a specific tenant institution.
   */
  static async listBatches(institutionId: string): Promise<SubmissionBatch[]> {
    return withTenantContext(institutionId, async (tx) => {
      const records = await tx.institutionRecord.findMany({
        where: {
          institutionId,
          title: { startsWith: "SUBMISSION_BATCH:" },
        },
        orderBy: { createdAt: "desc" },
      });

      return records
        .map((r) => r.payload as unknown as SubmissionBatch)
        .filter(Boolean);
    });
  }

  /**
   * Retrieves a single submission batch by ID.
   */
  static async getBatchById(
    institutionId: string,
    batchId: string,
  ): Promise<SubmissionBatch | null> {
    return withTenantContext(institutionId, async (tx) => {
      const record = await tx.institutionRecord.findFirst({
        where: {
          id: batchId,
          institutionId,
          title: `SUBMISSION_BATCH:${batchId}`,
        },
      });

      if (!record || !record.payload) {
        return null;
      }

      return record.payload as unknown as SubmissionBatch;
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
  ): Promise<SubmissionBatch> {
    return withTenantContext(institutionId, async (tx) => {
      const record = await tx.institutionRecord.findFirst({
        where: {
          id: batchId,
          institutionId,
          title: `SUBMISSION_BATCH:${batchId}`,
        },
      });

      if (!record || !record.payload) {
        throw new Error("BATCH_NOT_FOUND");
      }

      const batch = record.payload as unknown as SubmissionBatch;
      const quarantineIndex = batch.quarantineRecords.findIndex(
        (q) => q.rowId === rowId,
      );

      if (quarantineIndex === -1) {
        throw new Error("QUARANTINE_ROW_NOT_FOUND");
      }

      const targetRow = batch.quarantineRecords[quarantineIndex];
      const mergedCandidate = {
        ...targetRow.rawData,
        ...corrections,
      };

      const parseResult = admissionRecordSchema.safeParse(mergedCandidate);

      if (!parseResult.success) {
        const errors: QuarantineFieldError[] = parseResult.error.issues.map(
          (issue) => ({
            field: issue.path.join(".") || "record",
            message: issue.message,
            received: (mergedCandidate as any)[issue.path[0] as string],
          }),
        );

        // Update row with latest validation errors
        targetRow.rawData = mergedCandidate;
        targetRow.errors = errors;

        await tx.institutionRecord.update({
          where: { id: batchId },
          data: {
            payload: batch as any,
            updatedAt: new Date(),
          },
        });

        const error = new Error("VALIDATION_FAILED");
        (error as any).details = errors;
        throw error;
      }

      // Record successfully remediated: promote to staged records
      batch.quarantineRecords.splice(quarantineIndex, 1);
      batch.stagedRecords.push({
        rowId: targetRow.rowId,
        rowNumber: targetRow.rowNumber,
        data: parseResult.data,
        status: "ACCEPTED",
        validatedAt: new Date().toISOString(),
      });

      batch.quarantineCount = batch.quarantineRecords.length;
      batch.validCount = batch.stagedRecords.length;
      batch.updatedAt = new Date().toISOString();

      if (batch.quarantineCount === 0) {
        batch.status = "READY_FOR_SIGN_OFF";
      }

      await tx.institutionRecord.update({
        where: { id: batchId },
        data: {
          payload: batch as any,
          updatedAt: new Date(),
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
          remainingQuarantine: batch.quarantineCount,
          newStatus: batch.status,
        },
      });

      return batch;
    });
  }
}
