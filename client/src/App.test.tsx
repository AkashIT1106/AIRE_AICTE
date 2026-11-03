import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("AIRE Institutional Landing Page Suite", () => {
  it("renders the institutional utility header with accessibility controls", () => {
    render(<App />);
    expect(screen.getByText("Government of India")).toBeDefined();
    expect(
      screen.getByText("Technical Education Regulatory Platform"),
    ).toBeDefined();
    expect(screen.getByText("Skip to main content")).toBeDefined();
    expect(screen.getByLabelText("Font size controls")).toBeDefined();
    expect(screen.getByText("High Contrast")).toBeDefined();
  });

  it("renders the primary navigation and brand wordmark", () => {
    render(<App />);
    expect(screen.getAllByText("AIRE").length).toBeGreaterThan(0);
    const primaryNav = screen.getByRole("navigation", {
      name: "Primary Navigation",
    });
    expect(within(primaryNav).getByText("About AIRE")).toBeDefined();
    expect(within(primaryNav).getByText("Services")).toBeDefined();
    expect(within(primaryNav).getByText("How It Works")).toBeDefined();
  });

  it("renders the editorial hero section with headline, CTAs, and trust indicators", () => {
    render(<App />);
    expect(screen.getByText(/Admission Records\./i)).toBeDefined();
    expect(
      screen.getByText(/Verified with Deterministic Precision\./i),
    ).toBeDefined();
    expect(
      screen.getByText("All India Council for Technical Education"),
    ).toBeDefined();
    expect(
      screen.getAllByText("Institution Portal Login").length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Explore Reconciliation Process")).toBeDefined();
    expect(screen.getByText("Deterministic Rules")).toBeDefined();
    expect(screen.getByText("Tenant Isolation")).toBeDefined();
  });

  it("renders the institutional service directory with dossier tabs", () => {
    render(<App />);
    expect(screen.getByText("Institutional Service Directory")).toBeDefined();
    expect(
      screen.getAllByText("Batch Roster Ingestion & Schema Staging").length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Module 01")).toBeDefined();
  });

  it("renders the sequential workflow steps", () => {
    render(<App />);
    expect(screen.getByText("How AIRE Works")).toBeDefined();
    expect(
      screen.getByText("Batch Ingestion & Header Verification"),
    ).toBeDefined();
    expect(screen.getByText("Deterministic Rule Evaluation")).toBeDefined();
    expect(screen.getByText("Discrepancy Quarantine & Triage")).toBeDefined();
    expect(
      screen.getByText("Immutable Seal & Regulatory Package"),
    ).toBeDefined();
  });

  it("renders responsible record management pillars and security architecture", () => {
    render(<App />);
    expect(screen.getByText("Responsible Record Management")).toBeDefined();
    expect(
      screen.getByText("Database Multi-Tenant Isolation (Forced RLS)"),
    ).toBeDefined();
    expect(
      screen.getByText("Purpose-Bound Identity Vault & PII Minimization"),
    ).toBeDefined();
    expect(
      screen.getByText("Tamper-Evident Append-Only Audit Trail"),
    ).toBeDefined();
    expect(
      screen.getByText("Human Authority Over Regulatory Decisions"),
    ).toBeDefined();
  });

  it("renders and toggles FAQ accordion items", () => {
    render(<App />);
    const faqButton = screen.getByText(
      "What is the AIRE platform and what role does it serve for institutions?",
    );
    expect(faqButton).toBeDefined();

    // Verify first item is open by default
    expect(
      screen.getByText(
        /AIRE \(Admission Reconciliation & Evidence Platform\) is an authoritative digital service/i,
      ),
    ).toBeDefined();

    // Click second FAQ item to toggle
    const secondFaqButton = screen.getByText(
      "Who is authorized to access the Institution Portal?",
    );
    fireEvent.click(secondFaqButton);
    expect(
      screen.getByText(
        /Access is strictly restricted to designated institutional authorities/i,
      ),
    ).toBeDefined();
  });

  it("renders the institutional statutory footer and pre-footer CTA", () => {
    render(<App />);
    expect(
      screen.getByText(
        "Ready to Reconcile Your Institution's Admission Rosters?",
      ),
    ).toBeDefined();
    expect(screen.getByText("Accessibility & Standards")).toBeDefined();
    expect(screen.getByText("WCAG 2.2 AA / GIGW 3.0")).toBeDefined();
    expect(screen.getByText("Privacy Statement")).toBeDefined();
    expect(screen.getByText("Terms of Use")).toBeDefined();
  });
});
