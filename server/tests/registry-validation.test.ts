import { describe, it, expect } from "vitest";
import {
  campusInputSchema,
  programmeInputSchema,
  seatEntitlementInputSchema,
} from "@aire/validation";

describe("Phase 3 Registry Schemas Validation", () => {
  it("validates valid campus input", () => {
    const validCampus = {
      code: "NORTH-01",
      name: "North Satellite Campus",
      state: "Delhi",
      district: "North Delhi",
      pincode: "110007",
      status: "ACTIVE",
    };
    const parsed = campusInputSchema.safeParse(validCampus);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid campus code format", () => {
    const invalidCampus = {
      code: "invalid code with spaces",
      name: "Bad Campus",
    };
    const parsed = campusInputSchema.safeParse(invalidCampus);
    expect(parsed.success).toBe(false);
  });

  it("validates canonical programme input", () => {
    const validProg = {
      canonicalCode: "UG-AI-105",
      name: "B.Tech Artificial Intelligence and Data Science",
      degreeLevel: "UG",
      discipline: "Engineering & Technology",
      durationYears: 4,
    };
    const parsed = programmeInputSchema.safeParse(validProg);
    expect(parsed.success).toBe(true);
  });

  it("validates seat entitlement quota arithmetic", () => {
    const validEntitlement = {
      approvalOrderId: "11111111-1111-1111-1111-111111111111",
      programmeId: "22222222-2222-2222-2222-222222222222",
      sanctionedIntake: 60,
      openSeats: 30,
      scSeats: 9,
      stSeats: 5,
      obcSeats: 16,
      ewsSeats: 0,
      tfwSeats: 3, // supernumerary
      supernumerarySeats: 0,
    };
    const parsed = seatEntitlementInputSchema.safeParse(validEntitlement);
    expect(parsed.success).toBe(true);
  });

  it("rejects seat entitlement where category sum exceeds sanctioned intake", () => {
    const invalidEntitlement = {
      approvalOrderId: "11111111-1111-1111-1111-111111111111",
      programmeId: "22222222-2222-2222-2222-222222222222",
      sanctionedIntake: 60,
      openSeats: 40,
      scSeats: 15,
      stSeats: 10,
      obcSeats: 20, // sum = 85 > 60
      ewsSeats: 0,
    };
    const parsed = seatEntitlementInputSchema.safeParse(invalidEntitlement);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0].message).toContain(
        "cannot exceed total sanctioned intake",
      );
    }
  });

  it("validates Luhn-variant APAAR checksums correctly", async () => {
    const { isValidLuhnApaar } = await import("@aire/validation");
    // Valid 12-digit Luhn numbers
    expect(isValidLuhnApaar("982144121042")).toBe(true);
    expect(isValidLuhnApaar("9821-4412-1042")).toBe(true);
    // Invalid checks
    expect(isValidLuhnApaar("982144121040")).toBe(false);
    expect(isValidLuhnApaar("123")).toBe(false);
    expect(isValidLuhnApaar("")).toBe(false);
  });

  it("cleans and normalizes demographic fields deterministically", async () => {
    const { cleanDemographics } = await import("@aire/validation");
    const raw = {
      "Candidate Name": "  SNEHAN   SUNDARAM  ",
      "Roll No": " 2026-cse-01 ",
      "Date of Birth": "12/04/2005",
      "Reservation Category": " obc-ncl ",
      "Admission Quota": "Home State Quota",
      "APAAR ID": "9821-4412-1040",
    };
    const cleaned = cleanDemographics(raw);
    expect(cleaned.studentName).toBe("SNEHAN SUNDARAM");
    expect(cleaned.rollNumber).toBe("2026-CSE-01");
    expect(cleaned.dateOfBirth).toBe("2005-04-12");
    expect(cleaned.category).toBe("OBC-NCL");
    expect(cleaned.quota).toBe("Home State Quota");
    expect(cleaned.apaarId).toBe("9821-4412-1040");
  });

  it("validates seal batch request schema", async () => {
    const { sealBatchRequestSchema } = await import("@aire/validation");
    const valid = sealBatchRequestSchema.safeParse({ signatureConfirmation: true, notes: "All verified" });
    expect(valid.success).toBe(true);

    const invalid = sealBatchRequestSchema.safeParse({ signatureConfirmation: false });
    expect(invalid.success).toBe(false);
  });
});
