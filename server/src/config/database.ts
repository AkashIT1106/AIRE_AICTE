import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.js";
import { logger } from "./logger.js";

let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
    prismaInstance = new PrismaClient({
      adapter,
      log: ["warn", "error"],
    });
  }
  return prismaInstance;
}

export async function checkDatabaseHealth(): Promise<{
  status: "connected" | "disconnected";
  latencyMs?: number;
}> {
  const start = Date.now();
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - start;
    return { status: "connected", latencyMs };
  } catch (error) {
    logger.error({
      eventType: "DATABASE_HEALTH_CHECK_FAILED",
      error: (error as Error).message,
    });
    return { status: "disconnected" };
  }
}
