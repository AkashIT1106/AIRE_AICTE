export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerConfig {
  failureThresholdPercentage: number; // e.g. 50
  minimumRequests: number; // e.g. 4
  windowMs: number; // e.g. 60000 (1 minute)
  cooldownMs: number; // e.g. 15000 (15 seconds)
}

interface RequestRecord {
  timestamp: number;
  success: boolean;
}

export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private requests: RequestRecord[] = [];
  private lastStateChange: number = Date.now();
  private readonly config: CircuitBreakerConfig;

  constructor(config?: Partial<CircuitBreakerConfig>) {
    this.config = {
      failureThresholdPercentage: config?.failureThresholdPercentage ?? 50,
      minimumRequests: config?.minimumRequests ?? 4,
      windowMs: config?.windowMs ?? 60000,
      cooldownMs: config?.cooldownMs ?? 15000,
    };
  }

  getState(): CircuitState {
    const now = Date.now();
    if (
      this.state === "OPEN" &&
      now - this.lastStateChange >= this.config.cooldownMs
    ) {
      this.state = "HALF_OPEN";
      this.lastStateChange = now;
    }
    return this.state;
  }

  canExecute(): boolean {
    const currentState = this.getState();
    return currentState === "CLOSED" || currentState === "HALF_OPEN";
  }

  recordSuccess(): void {
    const now = Date.now();
    this.cleanOldRequests(now);
    this.requests.push({ timestamp: now, success: true });

    if (this.state === "HALF_OPEN") {
      this.state = "CLOSED";
      this.lastStateChange = now;
      this.requests = [];
    }
  }

  recordFailure(): void {
    const now = Date.now();
    this.cleanOldRequests(now);
    this.requests.push({ timestamp: now, success: false });

    if (this.state === "HALF_OPEN") {
      this.state = "OPEN";
      this.lastStateChange = now;
      return;
    }

    if (this.requests.length >= this.config.minimumRequests) {
      const failureCount = this.requests.filter((r) => !r.success).length;
      const failureRate = (failureCount / this.requests.length) * 100;

      if (failureRate >= this.config.failureThresholdPercentage) {
        this.state = "OPEN";
        this.lastStateChange = now;
      }
    }
  }

  reset(): void {
    this.state = "CLOSED";
    this.requests = [];
    this.lastStateChange = Date.now();
  }

  private cleanOldRequests(now: number): void {
    const cutoff = now - this.config.windowMs;
    this.requests = this.requests.filter((r) => r.timestamp >= cutoff);
  }
}
