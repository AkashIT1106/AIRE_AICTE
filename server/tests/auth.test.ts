import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { getPrismaClient, disconnectDatabase } from "../src/config/database.js";

describe("Authentication & Session Lifecycle (Better Auth & API v1)", () => {
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

  // ---------------------------------------------------------------------------
  // Backward compatibility with raw Better Auth handler
  // ---------------------------------------------------------------------------
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

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(Array.isArray(cookies)).toBe(true);
    const hasSessionCookie = cookies.some(
      (c: string) => c.includes("session_token") || c.includes("aire"),
    );
    expect(hasSessionCookie).toBe(true);

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

  // ---------------------------------------------------------------------------
  // Standardized /api/v1/auth/* endpoints
  // ---------------------------------------------------------------------------
  it("GET /api/v1/auth/session returns active session in ApiResponse envelope", async () => {
    const res = await request(app)
      .get("/api/v1/auth/session")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.error).toBeNull();
  });

  it("GET /api/v1/auth/session returns 401 when no session provided", async () => {
    const res = await request(app).get("/api/v1/auth/session");

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("GET /api/v1/auth/me succeeds with valid session cookie", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.error).toBeNull();
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

  it("POST /api/v1/auth/session/touch resets session idle timer (S-03)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/session/touch")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("touched", true);
    expect(res.body.data).toHaveProperty("updatedAt");
    expect(res.body.error).toBeNull();
  });

  it("POST /api/v1/auth/step-up verifies password for privileged transactions (S-02)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/step-up")
      .set("Cookie", sessionCookie)
      .send({ password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("stepUpVerified", true);
    expect(res.body.data).toHaveProperty("verifiedAt");
    expect(res.body.error).toBeNull();
  });

  it("POST /api/v1/auth/step-up rejects invalid password with 401", async () => {
    const res = await request(app)
      .post("/api/v1/auth/step-up")
      .set("Cookie", sessionCookie)
      .send({ password: "WrongPassword999!" });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("POST /api/v1/auth/sign-in authenticates and issues new session cookie", async () => {
    const res = await request(app).post("/api/v1/auth/sign-in").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.error).toBeNull();

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies.some((c: string) => c.includes("aire"))).toBe(true);

    // Update sessionCookie with latest valid cookie
    sessionCookie = cookies;
  });

  it("POST /api/v1/auth/sign-in fails with 401 on incorrect password", async () => {
    const res = await request(app).post("/api/v1/auth/sign-in").send({
      email: testUser.email,
      password: "IncorrectPassword!",
    });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("POST /api/v1/auth/sign-in fails with 400 on invalid format", async () => {
    const res = await request(app).post("/api/v1/auth/sign-in").send({
      email: "not-an-email",
      password: "short",
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /api/v1/auth/sessions/revoke-all terminates all sessions across devices (AIRE-REQ-124)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/sessions/revoke-all")
      .set("Cookie", sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("revoked", true);
    expect(res.body.data.count).toBeGreaterThanOrEqual(1);

    // Old cookie should now be rejected
    const meRes = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", sessionCookie);

    expect(meRes.status).toBe(401);
  });

  it("POST /api/v1/auth/sign-out cleanly invalidates session", async () => {
    // First sign in again to get a fresh session
    const loginRes = await request(app).post("/api/v1/auth/sign-in").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(loginRes.status).toBe(200);
    const freshCookie = loginRes.headers["set-cookie"];

    const outRes = await request(app)
      .post("/api/v1/auth/sign-out")
      .set("Cookie", freshCookie);

    expect(outRes.status).toBe(200);
    expect(outRes.body.data).toHaveProperty("signedOut", true);

    // Verify session is now terminated
    const meRes = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", freshCookie);

    expect(meRes.status).toBe(401);
  });
});
