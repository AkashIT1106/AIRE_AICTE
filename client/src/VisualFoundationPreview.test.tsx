import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VisualFoundationPreview } from "./pages/VisualFoundationPreview";
import {
  AireButton,
  AireAlert,
  AireInput,
  AireBadge,
  AireStatusIndicator,
  AireCard,
  AireCardHeader,
  AireCardTitle,
  AireCardBody,
  AireBreadcrumbs,
} from "./components/aire";

describe("VisualFoundationPreview & UX4G Component Abstraction Suite", () => {
  it("renders the preview header and governance badges", () => {
    render(<VisualFoundationPreview />);
    expect(screen.getByText("AIRE Visual Foundation & Design Token Preview")).toBeDefined();
    expect(screen.getByText("design.md v1.0 Authority")).toBeDefined();
    expect(screen.getByText("UX4G 3.0.2 Confirmed")).toBeDefined();
    expect(screen.getByText("Anti-Slop Active (During)")).toBeDefined();
  });

  it("renders the institutional breadcrumbs accurately", () => {
    render(
      <AireBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Submissions", href: "/submissions" },
          { label: "Batch 01", current: true },
        ]}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeDefined();
    expect(screen.getByText("Batch 01")).toBeDefined();
    expect(screen.getByText("Batch 01").getAttribute("aria-current")).toBe("page");
  });

  it("renders buttons with accessible height, disabled state, and loading feedback", () => {
    render(
      <div>
        <AireButton variant="primary" size="md">
          Action Button
        </AireButton>
        <AireButton variant="secondary" disabled>
          Disabled Button
        </AireButton>
        <AireButton variant="primary" loading>
          Submitting
        </AireButton>
      </div>,
    );

    const btn = screen.getByText("Action Button");
    expect(btn.className).toContain("ux4g-btn-primary");
    expect(btn.className).toContain("min-h-[44px]");

    const disabledBtn = screen.getByText("Disabled Button").closest("button");
    expect(disabledBtn?.disabled).toBe(true);

    const loadingBtn = screen.getByText("Submitting").closest("button");
    expect(loadingBtn?.getAttribute("aria-busy")).toBe("true");
  });

  it("renders accessible alerts with proper role and dismiss triggers", () => {
    let dismissed = false;
    render(
      <AireAlert
        variant="warning"
        title="Quarantine Notice"
        dismissible
        onDismiss={() => {
          dismissed = true;
        }}
      >
        Record discrepancy detected.
      </AireAlert>,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeDefined();
    expect(screen.getByText("Quarantine Notice")).toBeDefined();

    const closeBtn = screen.getByLabelText("Dismiss alert");
    fireEvent.click(closeBtn);
    expect(dismissed).toBe(true);
  });

  it("renders form inputs with label, helper text, and accessible error states", () => {
    render(
      <AireInput
        label="AICTE Code"
        required
        placeholder="Enter code"
        helperText="Format: 1-XXXXXX"
        errorMessage="Invalid institutional identifier"
      />,
    );

    expect(screen.getByLabelText(/AICTE Code/i)).toBeDefined();
    expect(screen.getByRole("alert")).toBeDefined();
    expect(screen.getByText("Invalid institutional identifier")).toBeDefined();
  });

  it("renders distinct status indicators for all admission lifecycle states", () => {
    render(
      <div>
        <AireBadge variant="brand">Brand Badge</AireBadge>
        <AireStatusIndicator status="UPLOADED" />
        <AireStatusIndicator status="STAGED" />
        <AireStatusIndicator status="QUARANTINED" />
        <AireStatusIndicator status="SEALED" />
        <AireStatusIndicator status="RECONCILED" />
        <AireStatusIndicator status="APPROVED" />
      </div>,
    );

    expect(screen.getByText("Brand Badge")).toBeDefined();
    expect(screen.getByText("Uploaded")).toBeDefined();
    expect(screen.getByText("Staged")).toBeDefined();
    expect(screen.getByText("Quarantined")).toBeDefined();
    expect(screen.getByText("Statutory Sealed")).toBeDefined();
    expect(screen.getByText("Reconciled")).toBeDefined();
    expect(screen.getByText("AICTE Approved")).toBeDefined();
  });

  it("renders cards with solid, outline, and restrained glassmorphic variants", () => {
    const { container } = render(
      <div>
        <AireCard variant="solid">
          <AireCardHeader>
            <AireCardTitle>Solid Card</AireCardTitle>
          </AireCardHeader>
          <AireCardBody>Solid Body</AireCardBody>
        </AireCard>
        <AireCard variant="glass">
          <AireCardBody>Glass Body</AireCardBody>
        </AireCard>
      </div>,
    );

    expect(container.querySelector(".bg-neutral-0")).toBeDefined();
    expect(container.querySelector(".aire-glass-panel")).toBeDefined();
  });
});
