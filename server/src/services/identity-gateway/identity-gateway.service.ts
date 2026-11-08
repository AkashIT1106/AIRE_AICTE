import {
  AdapterMode,
  ApaarAdapter,
  ApaarVerificationRequest,
  ApaarVerificationResult,
} from "./types.js";
import { MockApaarAdapter } from "./mock-apaar.adapter.js";
import { SandboxApaarAdapter } from "./sandbox-apaar.adapter.js";
import { LiveApaarAdapter } from "./live-apaar.adapter.js";
import { CircuitBreaker } from "./circuit-breaker.js";
import { logger } from "../../config/logger.js";

export class IdentityGatewayService {
  private static mockAdapter = new MockApaarAdapter();
  private static sandboxAdapter = new SandboxApaarAdapter();
  private static liveAdapter = new LiveApaarAdapter();
  private static circuitBreaker = new CircuitBreaker({
    failureThresholdPercentage: 50,
    minimumRequests: 4,
    windowMs: 60000,
    cooldownMs: 15000,
  });

  /**
   * Resets the circuit breaker (primarily for test scenarios).
   */
  static resetCircuitBreaker(): void {
    this.circuitBreaker.reset();
  }

  /**
   * Inspects current circuit breaker state.
   */
  static getCircuitBreakerState(): string {
    return this.circuitBreaker.getState();
  }

  /**
   * Resolves the active provider adapter based on environment configuration.
   */
  static resolveAdapter(): ApaarAdapter {
    const mode = (
      process.env.APAAR_ADAPTER_MODE || "MOCK"
    ).toUpperCase() as AdapterMode;
    switch (mode) {
      case "LIVE":
        return this.liveAdapter;
      case "SANDBOX":
        return this.sandboxAdapter;
      case "MOCK":
      default:
        return this.mockAdapter;
    }
  }

  /**
   * Executes identity verification with circuit breaker protection and exponential backoff retry.
   */
  static async verifyApaar(
    request: ApaarVerificationRequest,
    maxRetries: number = 3,
    initialBackoffMs: number = 100, // fast initial backoff for tests/production
  ): Promise<ApaarVerificationResult> {
    const adapter = this.resolveAdapter();
    const correlationId = request.correlationId;

    // 1. Check Circuit Breaker
    if (!this.circuitBreaker.canExecute()) {
      logger.warn(
        { correlationId, state: this.circuitBreaker.getState() },
        "Identity Gateway circuit breaker tripped (SERVICE_DEGRADED)",
      );
      return {
        status: "FAILED",
        message:
          "SERVICE_DEGRADED: Central identity gateway circuit breaker is open",
        executionMode: adapter.getMode(),
        latencyMs: 0,
      };
    }

    // 2. Exponential backoff retry loop
    let lastError: any = null;
    let delayMs = initialBackoffMs;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await adapter.verify(request);
        this.circuitBreaker.recordSuccess();

        logger.info(
          {
            correlationId,
            apaarId: request.apaarId.slice(-4).padStart(12, "*"), // masked for privacy
            status: result.status,
            latencyMs: result.latencyMs,
            mode: result.executionMode,
            attempt,
          },
          "Identity verification query completed successfully",
        );

        return result;
      } catch (err: any) {
        lastError = err;
        const isTimeout =
          err.code === "ETIMEDOUT" ||
          err.message?.includes("timed out") ||
          err.message?.includes("TIMEOUT");

        logger.warn(
          {
            correlationId,
            attempt,
            maxRetries,
            error: err.message,
            isTimeout,
          },
          "Identity Gateway query failed on attempt",
        );

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          delayMs *= 2; // Exponential backoff: 1x, 2x, 4x...
        }
      }
    }

    // All retry attempts exhausted
    this.circuitBreaker.recordFailure();

    const isTimeout =
      lastError?.code === "ETIMEDOUT" ||
      lastError?.message?.includes("timed out") ||
      lastError?.message?.includes("TIMEOUT");

    return {
      status: isTimeout ? "TIMEOUT" : "FAILED",
      message: `Downstream provider failure after ${maxRetries} attempts: ${lastError?.message}`,
      executionMode: adapter.getMode(),
      latencyMs: 0,
    };
  }
}
