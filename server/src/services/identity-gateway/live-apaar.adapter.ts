import {
  ApaarAdapter,
  AdapterMode,
  ApaarVerificationRequest,
  ApaarVerificationResult,
} from "./types.js";

export class LiveApaarAdapter implements ApaarAdapter {
  getMode(): AdapterMode {
    return "LIVE";
  }

  async verify(
    request: ApaarVerificationRequest,
  ): Promise<ApaarVerificationResult> {
    const startTime = Date.now();
    const endpoint = process.env.APAAR_LIVE_ENDPOINT;
    const apiKey = process.env.APAAR_API_KEY;

    if (!endpoint || !apiKey) {
      throw new Error("LIVE_APAAR_ENDPOINT_NOT_CONFIGURED");
    }

    const cleanId = request.apaarId.trim().replace(/\s+/g, "");
    if (!/^\d{12}$/.test(cleanId)) {
      return {
        status: "FAILED",
        message: "Invalid APAAR format for LIVE gateway",
        executionMode: "LIVE",
        latencyMs: Date.now() - startTime,
      };
    }

    const response = await fetch(`${endpoint}/api/v1/registry/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Correlation-Id": request.correlationId,
      },
      body: JSON.stringify({
        apaarId: cleanId,
        studentName: request.studentName,
        dateOfBirth: request.dateOfBirth,
        gender: request.gender,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          status: "UNVERIFIED",
          message: "Identifier not present in national registry",
          executionMode: "LIVE",
          latencyMs: Date.now() - startTime,
        };
      }
      throw new Error(`EDULOCKER_HTTP_${response.status}`);
    }

    const data = (await response.json()) as any;
    return {
      status: data.verified ? "VERIFIED" : "UNVERIFIED",
      verifiedAt: data.verified ? new Date().toISOString() : undefined,
      referenceNumber: data.transactionId || data.referenceNumber,
      matchConfidence: data.confidence ?? 1.0,
      executionMode: "LIVE",
      latencyMs: Date.now() - startTime,
    };
  }
}
