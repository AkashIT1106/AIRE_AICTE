import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { getPrismaClient } from "./config/database.js";

const app = createApp();

const server = app.listen(env.APP_PORT, () => {
  logger.info({
    eventType: "SERVER_STARTUP",
    port: env.APP_PORT,
    environment: env.NODE_ENV,
    outcome: "LISTENING",
  });
});

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info({ eventType: "GRACEFUL_SHUTDOWN_START", signal });
  server.close(async () => {
    try {
      const prisma = getPrismaClient();
      await prisma.$disconnect();
      logger.info({ eventType: "DATABASE_DISCONNECTED" });
      process.exit(0);
    } catch (err) {
      logger.error({
        eventType: "SHUTDOWN_ERROR",
        error: (err as Error).message,
      });
      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
