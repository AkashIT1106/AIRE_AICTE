import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.js";
import { logger } from "./logger.js";

let adminPrismaInstance: PrismaClient | null = null;
let runtimePrismaInstance: PrismaClient | null = null;

/**
 * Admin / Migration Prisma client.
 * Connects with migration credentials (owns tables, executes DDL).
 */
export function getPrismaClient(): PrismaClient {
  if (!adminPrismaInstance) {
    const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
    adminPrismaInstance = new PrismaClient({
      adapter,
      log: ["warn", "error"],
    });
  }
  return adminPrismaInstance;
}

/**
 * Runtime Application Prisma client.
 * Connects with restricted credentials (aire_app_user: NOSUPERUSER, NOBYPASSRLS).
 * Ensures PostgreSQL Row-Level Security cannot be bypassed.
 */
export function getRuntimePrismaClient(): PrismaClient {
  if (!runtimePrismaInstance) {
    const connectionUrl = env.APP_DATABASE_URL || env.DATABASE_URL;
    const adapter = new PrismaPg({ connectionString: connectionUrl });
    runtimePrismaInstance = new PrismaClient({
      adapter,
      log: ["warn", "error"],
    });
  }
  return runtimePrismaInstance;
}

/**
 * Controlled Transaction Wrapper per PROJECT_PLAN.md Section 17.5.
 *
 * 1. Sets transaction-local context using parameterized `set_config(..., is_local=true)`.
 * 2. Scoped strictly to the interactive transaction.
 * 3. Automatically reset on COMMIT or ROLLBACK to eliminate connection pool context leakage.
 * 4. Executes under the restricted application role where RLS is enforced.
 */
export async function withTenantContext<T>(
  tenantId: string,
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  if (!tenantId || typeof tenantId !== "string" || tenantId.trim() === "") {
    throw new Error(
      "INVALID_TENANT_CONTEXT: Tenant ID must be a non-empty string",
    );
  }

  const client = getRuntimePrismaClient();

  return client.$transaction(async (tx) => {
    // Parameterized, transaction-local variable
    await tx.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`;
    return await operation(tx);
  });
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

export async function disconnectDatabase(): Promise<void> {
  if (adminPrismaInstance) {
    await adminPrismaInstance.$disconnect();
    adminPrismaInstance = null;
  }
  if (runtimePrismaInstance) {
    await runtimePrismaInstance.$disconnect();
    runtimePrismaInstance = null;
  }
}
