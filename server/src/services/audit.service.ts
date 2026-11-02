import { getPrismaClient } from "../config/database.js";
import { logger } from "../config/logger.js";
import { Prisma } from "@prisma/client";

export interface CreateAuditRecordParams {
  severity?: "info" | "warn" | "error";
  correlationId: string;
  actorId?: string | null;
  tenantId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  status: "SUCCESS" | "FAILURE" | "DENIED";
  metadata?: Record<string, unknown> | null;
}

/**
 * Sanitizes metadata to ensure credentials, tokens, and secrets are never audited.
 */
function sanitizeAuditMetadata(
  metadata?: Record<string, unknown> | null,
): Prisma.InputJsonValue | undefined {
  if (!metadata) return undefined;

  const sanitized = { ...metadata };
  const sensitiveKeys = [
    "password",
    "token",
    "secret",
    "accessToken",
    "refreshToken",
    "idToken",
    "authorization",
    "cookie",
  ];

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = "[REDACTED]";
    }
  }

  return sanitized as Prisma.InputJsonValue;
}

/**
 * Persists structured security and domain audit events.
 * Specification: PROJECT_PLAN.md Section 19 and Section 39.1
 */
export async function logAuditEvent(
  params: CreateAuditRecordParams,
): Promise<void> {
  try {
    const prisma = getPrismaClient();
    const sanitizedMetadata = sanitizeAuditMetadata(params.metadata);

    await prisma.auditEvent.create({
      data: {
        severity: params.severity || "info",
        service: "aire-server",
        correlationId: params.correlationId,
        actorId: params.actorId || null,
        tenantId: params.tenantId || null,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId || null,
        status: params.status,
        metadata: sanitizedMetadata,
      },
    });

    logger.info({
      eventType: "AUDIT_EVENT_RECORDED",
      action: params.action,
      correlationId: params.correlationId,
      actorId: params.actorId,
      tenantId: params.tenantId,
      status: params.status,
    });
  } catch (error) {
    logger.error({
      eventType: "AUDIT_EVENT_WRITE_FAILED",
      action: params.action,
      error: (error as Error).message,
    });
  }
}
