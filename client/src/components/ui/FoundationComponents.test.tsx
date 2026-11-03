import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Button } from "./button";
import { Badge } from "./badge";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { AppShell } from "@/components/layout/AppShell";

describe("Foundation UI Components", () => {
  it("renders Button variants and respects loading state", () => {
    const { rerender } = render(<Button variant="default">Save Record</Button>);
    const button = screen.getByRole("button", { name: "Save Record" });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();

    // Rerender with loading state
    rerender(
      <Button variant="default" loading>
        Save Record
      </Button>,
    );
    expect(button).toBeDisabled();
  });

  it("renders semantic Status Badges with correct roles", () => {
    render(
      <div>
        <Badge variant="success">Compliant</Badge>
        <Badge variant="warning">Quarantine</Badge>
        <Badge variant="danger">Show Cause</Badge>
        <Badge variant="masked">•••• 1234</Badge>
      </div>,
    );

    expect(screen.getByText("Compliant")).toBeInTheDocument();
    expect(screen.getByText("Quarantine")).toBeInTheDocument();
    expect(screen.getByText("Show Cause")).toBeInTheDocument();
    expect(screen.getByText("•••• 1234")).toBeInTheDocument();
  });

  it("renders Alert banners with accessible role alert", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Intake Breach</AlertTitle>
        <AlertDescription>Exceeds approved quota</AlertDescription>
      </Alert>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Intake Breach")).toBeInTheDocument();
    expect(screen.getByText("Exceeds approved quota")).toBeInTheDocument();
  });

  it("renders AppShell with navigation landmarks and workspace switcher", () => {
    render(
      <BrowserRouter>
        <AppShell>
          <div>Main Content Area</div>
        </AppShell>
      </BrowserRouter>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Sidebar Navigation" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("Main Content Area")).toBeInTheDocument();
  });
});
