import crypto from "node:crypto";
import {
  ApaarAdapter,
  AdapterMode,
  ApaarVerificationRequest,
  ApaarVerificationResult,
} from "./types.js";

export class MockApaarAdapter implements ApaarAdapter {
  getMode(): AdapterMode {
    return "MOCK";
  }

  async verify(
    request: ApaarVerificationRequest,
  ): Promise<ApaarVerificationResult> {
    const startTime = Date.now();
    const cleanId = request.apaarId.trim().replace(/\s+/g, "");

    // 1. Format validation: must be exactly 12 digits
    if (!/^\d{12}$/.test(cleanId)) {
      return {
        status: "FAILED",
        message: "APAAR identifier must be exactly 12 numeric digits",
        executionMode: "MOCK",
        latencyMs: Date.now() - startTime,
      };
    }

    // 2. Deterministic simulation triggers
    // Ending in 888 -> simulate timeout
    if (cleanId.endsWith("888")) {
      const error: any = new Error(
        "ETIMEDOUT: Connection to EduLocker registry timed out",
      );
      error.code = "ETIMEDOUT";
      throw error;
    }

    // Ending in 999 -> simulate external service 500 error
    if (cleanId.endsWith("999")) {
      const error: any = new Error(
        "ECONNRESET: EduLocker central gateway service error",
      );
      error.code = "ECONNRESET";
      throw error;
    }

    // Identifiers starting with '0' or all zeroes -> unverified (does not exist in registry)
    if (cleanId.startsWith("0")) {
      return {
        status: "UNVERIFIED",
        message: "APAAR identifier not found in central registry",
        matchConfidence: 0.0,
        executionMode: "MOCK",
        latencyMs: Date.now() - startTime,
      };
    }

    // 3. Successful verification
    const mockReference = `REF-APAAR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    return {
      status: "VERIFIED",
      verifiedAt: new Date().toISOString(),
      referenceNumber: mockReference,
      matchConfidence: 1.0,
      executionMode: "MOCK",
      latencyMs: Date.now() - startTime,
    };
  }
}
