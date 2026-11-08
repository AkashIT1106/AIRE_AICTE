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
});
