import { Worker, Job } from "bullmq";
import { redisConnectionOptions, INGESTION_QUEUE_NAME } from "./queue.js";
import { logger } from "./config/logger.js";
import { parseCsv } from "./parser.js";
import { cleanDemographics, admissionRecordSchema } from "@aire/validation";

export interface IngestionJobData {
  batchId: string;
  institutionId: string;
  fileName: string;
  fileContent?: string;
  rows?: Array<Record<string, unknown>>;
  correlationId?: string;
  actorId?: string;
}

export interface IngestionJobResult {
  batchId: string;
  totalCount: number;
  validCount: number;
  quarantineCount: number;
  status: "READY_FOR_SIGN_OFF" | "QUARANTINED";
  completedAt: string;
}

export async function processIngestionJob(
  job: Job<IngestionJobData>,
): Promise<IngestionJobResult> {
  const {
    batchId,
    institutionId,
    fileContent,
    rows: inputRows,
    correlationId,
  } = job.data;
  logger.info({
    eventType: "INGESTION_JOB_STARTED",
    jobId: job.id,
    batchId,
    institutionId,
    correlationId: correlationId || "UNKNOWN",
  });

  let records: Array<Record<string, unknown>> = [];
  if (inputRows && inputRows.length > 0) {
    records = inputRows;
  } else if (fileContent) {
    records = parseCsv(fileContent);
  }

  let validCount = 0;
  let quarantineCount = 0;

  for (let i = 0; i < records.length; i++) {
    const cleaned = cleanDemographics(records[i]);
    const validation = admissionRecordSchema.safeParse(cleaned);
    if (validation.success) {
      validCount++;
    } else {
      quarantineCount++;
    }

    if ((i + 1) % 25 === 0 || i === records.length - 1) {
      if (typeof job.updateProgress === "function") {
        await job.updateProgress({
          processed: i + 1,
          total: records.length,
          percentage: Math.round(((i + 1) / records.length) * 100),
        });
      }
    }
  }

  const finalStatus =
    quarantineCount === 0 ? "READY_FOR_SIGN_OFF" : "QUARANTINED";

  logger.info({
    eventType: "INGESTION_JOB_COMPLETED",
    jobId: job.id,
    batchId,
    totalCount: records.length,
    validCount,
    quarantineCount,
    finalStatus,
  });

  return {
    batchId,
    totalCount: records.length,
    validCount,
    quarantineCount,
    status: finalStatus,
    completedAt: new Date().toISOString(),
  };
}

export const ingestionWorker = new Worker(
  INGESTION_QUEUE_NAME,
  processIngestionJob,
  {
    connection: redisConnectionOptions,
    concurrency: 5,
  },
);

ingestionWorker.on("completed", (job: Job) => {
  logger.info({
    eventType: "INGESTION_JOB_SUCCESS",
    jobId: job.id,
  });
});

ingestionWorker.on("failed", (job: Job | undefined, err: Error) => {
  logger.error({
    eventType: "INGESTION_JOB_FAILURE",
    jobId: job?.id,
    error: err.message,
  });
});
