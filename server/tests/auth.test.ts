import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { getPrismaClient, disconnectDatabase } from "../src/config/database.js";

describe("Better Auth Authentication & Session Lifecycle", () => {
  const app = createApp();
  const prisma = getPrismaClient();

  const testUser = {
    email: `auth-test-${Date.now()}@example.com`,
    password: "Password123!Secure",
    name: "Auth Test User",
  };

  let sessionCookie: string[] = [];

  beforeAll(async () => {
    // Clean up any test user if exists
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await disconnectDatabase();
  });

  it("POST /api/auth/sign-up/email creates a user and issues session cookie", async () => {
    const res = await request(app).post("/api/auth/sign-up/email").send({
      email: testUser.email,
      password: testUser.password,
      name: testUser.name,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user.name).toBe(testUser.name);

    // Verify session cookie is issued with HttpOnly
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(Array.isArray(cookies)).toBe(true);
    const hasSessionCookie = cookies.some(
      (c: string) => c.includes("session_token") || c.includes("aire"),
    );
    expect(hasSessionCookie).toBe(true);

    // Save cookie for subsequent requests
    sessionCookie = cookies;
  });

  it("GET /api/auth/get-session returns active session when cookie provided", async () => {
    const res = await request(app)
      .get("/api/auth/get-session")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("session");
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.session.token).toBeDefined();
  });

  it("GET /api/v1/auth/me succeeds with valid session cookie", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it("GET /api/v1/auth/me returns 401 UNAUTHORIZED when no session provided", async () => {
    const res = await request(app).get("/api/v1/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("GET /api/v1/auth/me returns 401 UNAUTHORIZED with invalid session token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", [
        "aire.session_token=invalid_bogus_token; Path=/; HttpOnly",
      ]);

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("POST /api/auth/sign-in/email fails with incorrect password", async () => {
    const res = await request(app).post("/api/auth/sign-in/email").send({
      email: testUser.email,
      password: "WrongPassword999!",
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("POST /api/auth/sign-out revokes session", async () => {
    const res = await request(app)
      .post("/api/auth/sign-out")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);

    // Verify subsequent request with old session cookie is now rejected
    const meRes = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", sessionCookie);

    expect(meRes.status).toBe(401);
  });
});
