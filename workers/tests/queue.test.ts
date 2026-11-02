import { describe, it, expect } from "vitest";
import { redisConnectionOptions, OUTBOX_QUEUE_NAME } from "../src/queue.js";

describe("Workers Queue Configuration", () => {
  it("correctly configures BullMQ Redis connection options", () => {
    expect(redisConnectionOptions).toBeDefined();
    expect(redisConnectionOptions.host).toBeDefined();
    expect(redisConnectionOptions.port).toBeDefined();
    expect(redisConnectionOptions.maxRetriesPerRequest).toBeNull();
  });

  it("defines correct canonical queue name", () => {
    expect(OUTBOX_QUEUE_NAME).toBe("aire-outbox-events");
  });
});
