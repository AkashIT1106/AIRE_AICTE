import { describe, it, expect, beforeEach } from "vitest";
import {
  IdentityGatewayService,
  CircuitBreaker,
} from "../services/identity-gateway/index.js";

describe("IdentityGatewayService (M07 Adapter Gateway)", () => {
  beforeEach(() => {
    process.env.APAAR_ADAPTER_MODE = "MOCK";
    IdentityGatewayService.resetCircuitBreaker();
  });

  it("should verify valid 12-digit identifier deterministically in MOCK mode", async () => {
    const res = await IdentityGatewayService.verifyApaar({
      apaarId: "123456789012",
      studentName: "Priya Patel",
      correlationId: "corr_test_01",
    });

    expect(res.status).toBe("VERIFIED");
    expect(res.executionMode).toBe("MOCK");
    expect(res.referenceNumber).toMatch(/^REF-APAAR-/);
    expect(res.verifiedAt).toBeDefined();
  });

  it("should return FAILED for non-12-digit identifier without hitting downstream", async () => {
    const res = await IdentityGatewayService.verifyApaar({
      apaarId: "12345", // too short
      correlationId: "corr_test_02",
    });

    expect(res.status).toBe("FAILED");
    expect(res.message).toContain("12 numeric digits");
  });

  it("should return UNVERIFIED for identifiers starting with 0 in MOCK mode", async () => {
    const res = await IdentityGatewayService.verifyApaar({
      apaarId: "012345678901",
      correlationId: "corr_test_03",
    });

    expect(res.status).toBe("UNVERIFIED");
    expect(res.matchConfidence).toBe(0.0);
  });

  it("should execute exponential backoff retry and return TIMEOUT on simulated timeout (ending in 888)", async () => {
    const start = Date.now();
    const res = await IdentityGatewayService.verifyApaar(
      {
        apaarId: "123456789888", // simulated timeout
        correlationId: "corr_test_timeout",
      },
      3,
      10, // 10ms initial backoff for speedy testing
    );

    const elapsed = Date.now() - start;
    expect(res.status).toBe("TIMEOUT");
    expect(res.message).toContain(
      "Downstream provider failure after 3 attempts",
    );
    expect(elapsed).toBeGreaterThanOrEqual(20); // 10ms + 20ms = 30ms backoff
  });

  it("should trip circuit breaker when failure threshold exceeds 50%", async () => {
    // Fire multiple failing queries (ending in 999)
    for (let i = 0; i < 4; i++) {
      await IdentityGatewayService.verifyApaar(
        {
          apaarId: "123456789999",
          correlationId: `corr_fail_${i}`,
        },
        1, // single attempt per query
        5,
      );
    }

    expect(IdentityGatewayService.getCircuitBreakerState()).toBe("OPEN");

    // Subsequent call should fast-fail with SERVICE_DEGRADED without retrying
    const fastFailRes = await IdentityGatewayService.verifyApaar({
      apaarId: "123456789012", // even with a valid identifier
      correlationId: "corr_blocked",
    });

    expect(fastFailRes.status).toBe("FAILED");
    expect(fastFailRes.message).toContain("SERVICE_DEGRADED");
  });

  it("should test standalone CircuitBreaker state transitions", () => {
    const cb = new CircuitBreaker({
      failureThresholdPercentage: 50,
      minimumRequests: 2,
      windowMs: 5000,
      cooldownMs: 50,
    });

    expect(cb.getState()).toBe("CLOSED");
    expect(cb.canExecute()).toBe(true);

    cb.recordFailure();
    cb.recordFailure();

    expect(cb.getState()).toBe("OPEN");
    expect(cb.canExecute()).toBe(false);
  });
});
