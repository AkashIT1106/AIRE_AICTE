import { ConnectionOptions } from "bullmq";
import { env } from "./config/env.js";

export const redisConnectionOptions: ConnectionOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
};

export const OUTBOX_QUEUE_NAME = "aire-outbox-events";
export const INGESTION_QUEUE_NAME = "aire-submission-ingestion";
