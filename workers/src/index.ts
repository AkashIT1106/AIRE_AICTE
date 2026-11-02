import { Worker, Job } from "bullmq";
import { redisConnectionOptions, OUTBOX_QUEUE_NAME } from "./queue.js";
import { logger } from "./config/logger.js";

logger.info({
  eventType: "WORKER_STARTUP",
  queueName: OUTBOX_QUEUE_NAME,
  status: "INITIALIZING",
});

// Idempotent worker handler for transactional outbox jobs per Section 11.4
export const outboxWorker = new Worker(
  OUTBOX_QUEUE_NAME,
  async (job: Job) => {
    logger.info({
      eventType: "OUTBOX_JOB_PROCESSING",
      jobId: job.id,
      jobName: job.name,
      correlationId: job.data?.correlationId || "UNKNOWN",
    });

    return { processed: true, completedAt: new Date().toISOString() };
  },
  {
    connection: redisConnectionOptions,
    concurrency: 5,
  },
);

outboxWorker.on("completed", (job: Job) => {
  logger.info({
    eventType: "OUTBOX_JOB_COMPLETED",
    jobId: job.id,
  });
});

outboxWorker.on("failed", (job: Job | undefined, err: Error) => {
  logger.error({
    eventType: "OUTBOX_JOB_FAILED",
    jobId: job?.id,
    error: err.message,
  });
});

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info({ eventType: "WORKER_SHUTDOWN", signal });
  await outboxWorker.close();
  process.exit(0);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
