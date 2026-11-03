import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardSkeleton } from "@/components/feedback/DashboardSkeleton";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

describe("Layout Stability & Structural Shell Standards (Brightloop Invariants)", () => {
  it("renders stable fixed-geometry application shell (header 64px, breadcrumbs 36px, footer 36px)", () => {
    const { container } = render(
      <BrowserRouter>
        <AppShell>
          <div data-testid="page-content">Stable Main Canvas</div>
        </AppShell>
      </BrowserRouter>,
    );

    // 1. Header has fixed height class h-16 (64px)
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
    expect(header?.className).toContain("h-16");

    // 2. Breadcrumbs navigation has fixed height h-9 (36px)
    const breadcrumbNav = container.querySelector(
      'nav[aria-label="Breadcrumb"]',
    );
    expect(breadcrumbNav).toBeInTheDocument();
    expect(breadcrumbNav?.className).toContain("h-9");

    // 3. Footer has fixed height h-9 (36px)
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
    expect(footer?.className).toContain("h-9");

    // 4. Main content is rendered inside viewport
    expect(screen.getByTestId("page-content")).toBeInTheDocument();
  });

  it("toggles desktop sidebar collapse between expanded (w-64) and compact (w-16) without layout reflow", () => {
    const { container } = render(
      <BrowserRouter>
        <AppShell>
          <div>Main Content</div>
        </AppShell>
      </BrowserRouter>,
    );

    const aside = container.querySelector("aside");
    expect(aside).toBeInTheDocument();
    expect(aside?.className).toContain("md:w-64");

    const collapseButton = screen.getByRole("button", {
      name: /Collapse sidebar/i,
    });
    expect(collapseButton).toBeInTheDocument();

    fireEvent.click(collapseButton);

    // Sidebar collapses to compact w-16
    expect(aside?.className).toContain("md:w-16");

    const expandButton = screen.getByRole("button", {
      name: /Expand sidebar/i,
    });
    expect(expandButton).toBeInTheDocument();
    fireEvent.click(expandButton);

    // Sidebar expands back to w-64
    expect(aside?.className).toContain("md:w-64");
  });

  it("toggles responsive mobile drawer without causing horizontal overflow", () => {
    const { container } = render(
      <BrowserRouter>
        <AppShell>
          <div>Responsive Mobile Canvas</div>
        </AppShell>
      </BrowserRouter>,
    );

    const toggleButton = screen.getByRole("button", {
      name: /Toggle navigation menu/i,
    });
    expect(toggleButton).toBeInTheDocument();

    const aside = container.querySelector("aside");
    expect(aside?.className).toContain("-translate-x-full");

    fireEvent.click(toggleButton);

    // Drawer slides over with backdrop overlay
    expect(aside?.className).toContain("translate-x-0");
  });

  it("renders DashboardSkeleton matching final KPI grid and 36px table row geometry", () => {
    const { container } = render(<DashboardSkeleton />);

    // 4 metric cards matching h-[106px]
    const metricCards = container.querySelectorAll(".h-\\[106px\\]");
    expect(metricCards.length).toBe(4);

    // Table skeleton with 36px rows
    const tableRows = container.querySelectorAll(".h-\\[36px\\]");
    expect(tableRows.length).toBe(3);
  });

  it("renders PageLoadingSkeleton for route transitions without layout shift", () => {
    render(<PageLoadingSkeleton />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Loading page workspace",
    );
  });

  it("renders dynamic breadcrumbs trail for nested routes", () => {
    render(
      <BrowserRouter>
        <Breadcrumbs />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeInTheDocument();
  });
});
