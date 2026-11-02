import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import * as dbModule from "../src/config/database.js";

describe("Health & Readiness Endpoints", () => {
  const app = createApp();

  it("GET /api/v1/health returns standard ApiResponse envelope with system health data", async () => {
    vi.spyOn(dbModule, "checkDatabaseHealth").mockResolvedValueOnce({
      status: "connected",
      latencyMs: 5,
    });

    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.headers["x-correlation-id"]).toBeDefined();
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("error", null);
    expect(response.body.data.status).toBe("healthy");
    expect(response.body.data.services.database.status).toBe("connected");
  });

  it("GET /api/v1/health returns 503 degraded status when database is disconnected", async () => {
    vi.spyOn(dbModule, "checkDatabaseHealth").mockResolvedValueOnce({
      status: "disconnected",
    });

    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(503);
    expect(response.body.data.status).toBe("degraded");
    expect(response.body.data.services.database.status).toBe("disconnected");
  });

  it("GET /api/v1/ready returns READY when database probe succeeds", async () => {
    vi.spyOn(dbModule, "checkDatabaseHealth").mockResolvedValueOnce({
      status: "connected",
    });

    const response = await request(app).get("/api/v1/ready");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "READY" });
  });
});
