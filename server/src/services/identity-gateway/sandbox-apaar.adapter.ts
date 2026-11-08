import crypto from "node:crypto";
import {
  ApaarAdapter,
  AdapterMode,
  ApaarVerificationRequest,
  ApaarVerificationResult,
} from "./types.js";

export class SandboxApaarAdapter implements ApaarAdapter {
  getMode(): AdapterMode {
    return "SANDBOX";
  }

  async verify(
    request: ApaarVerificationRequest,
  ): Promise<ApaarVerificationResult> {
    const startTime = Date.now();
    const cleanId = request.apaarId.trim().replace(/\s+/g, "");

    if (!/^\d{12}$/.test(cleanId)) {
      return {
        status: "FAILED",
        message: "Invalid APAAR length or format",
        executionMode: "SANDBOX",
        latencyMs: Date.now() - startTime,
      };
    }

    // In sandbox, check if external staging endpoint is configured
    const sandboxEndpoint = process.env.APAAR_SANDBOX_ENDPOINT;
    if (sandboxEndpoint) {
      try {
        const response = await fetch(`${sandboxEndpoint}/v1/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Correlation-Id": request.correlationId,
          },
          body: JSON.stringify({
            apaarId: cleanId,
            studentName: request.studentName,
          }),
        });
        if (!response.ok) {
          throw new Error(`SANDBOX_HTTP_ERROR_${response.status}`);
        }
        const data = (await response.json()) as any;
        return {
          status: data.verified ? "VERIFIED" : "UNVERIFIED",
          verifiedAt: data.verified ? new Date().toISOString() : undefined,
          referenceNumber: data.referenceNumber,
          executionMode: "SANDBOX",
          latencyMs: Date.now() - startTime,
        };
      } catch (err: any) {
        throw err;
      }
    }

    // Staging simulation default
    const isVerified = !cleanId.startsWith("00");
    return {
      status: isVerified ? "VERIFIED" : "UNVERIFIED",
      verifiedAt: isVerified ? new Date().toISOString() : undefined,
      referenceNumber: `SANDBOX-APAAR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
      executionMode: "SANDBOX",
      latencyMs: Date.now() - startTime,
    };
  }
}
