import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LandingPage } from "./LandingPage";
import { AuthProvider } from "@/context/AuthContext";

describe("LandingPage Component — Public Institutional Portal at /", () => {
  beforeEach(() => {
    // Reset font size & class list on documentElement
    document.documentElement.style.fontSize = "16px";
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    document.documentElement.style.fontSize = "16px";
    document.documentElement.classList.remove("dark");
  });

  const renderLandingPage = () => {
    return render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <LandingPage />
        </MemoryRouter>
      </AuthProvider>,
    );
  };

  it("renders the UX4G statutory government header and official markers", () => {
    renderLandingPage();

    expect(screen.getAllByText(/भारत सरकार/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Government of India/i).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText(/AICTE/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: /Skip to main content/i }),
    ).toBeInTheDocument();
  });

  it("adjusts font scaling when accessibility font size controls are clicked", () => {
    renderLandingPage();

    const normalBtn = screen.getByTitle("Normal text size");
    const largeBtn = screen.getByTitle("Large text size");
    const largestBtn = screen.getByTitle("Largest text size");

    expect(normalBtn).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(largeBtn);
    expect(document.documentElement.style.fontSize).toBe("17.5px");
    expect(largeBtn).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(largestBtn);
    expect(document.documentElement.style.fontSize).toBe("19px");
    expect(largestBtn).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(normalBtn);
    expect(document.documentElement.style.fontSize).toBe("16px");
    expect(normalBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles dark mode class on document root when theme button is clicked", () => {
    renderLandingPage();

    const themeBtn = screen.getByTitle("Switch to Dark Mode");
    fireEvent.click(themeBtn);

    expect(document.documentElement.classList.contains("dark")).toBe(true);

    const lightBtn = screen.getByTitle("Switch to Light Mode");
    fireEvent.click(lightBtn);

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("renders the hero section with confidence headline and dual actions", () => {
    renderLandingPage();

    expect(
      screen.getByRole("heading", {
        name: /Institutional Student Records\. Verified with Confidence\./i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/An AICTE Digital Initiative/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /How AIRE Works/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /Sign in to AIRE/i }).length,
    ).toBeGreaterThan(0);
  });

  it("renders mock preview card with floating metrics and checklist status", () => {
    renderLandingPage();

    expect(screen.getByText(/Submission Overview/i)).toBeInTheDocument();
    expect(screen.getByText("24,860")).toBeInTheDocument();
    expect(screen.getByText("Records Validated")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByText("Issues to Review")).toBeInTheDocument();
    expect(screen.getByText(/100% Verified/i)).toBeInTheDocument();
  });

  it("renders all 4 persona-based pathway cards", () => {
    renderLandingPage();

    expect(
      screen.getByRole("heading", { name: /For Institutions/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /For AICTE Reviewers/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /For Students/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /For Auditors/i }),
    ).toBeInTheDocument();
  });

  it("renders the 6-step verification journey", () => {
    renderLandingPage();

    expect(
      screen.getByRole("heading", {
        name: /A clear and structured verification process/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /1\. Prepare Records/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /2\. Upload a Batch/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /3\. Validate Data/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /4\. Review Issues/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /5\. Submit Records/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /6\. Track Status/i }),
    ).toBeInTheDocument();
  });

  it("renders 'Why use AIRE?' 5 pillars and statutory footer", () => {
    renderLandingPage();

    expect(
      screen.getByRole("heading", { name: /Why use AIRE\?/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Accurate & Compliant/i)).toBeInTheDocument();
    expect(screen.getByText(/Detects Data Issues/i)).toBeInTheDocument();
    expect(screen.getByText(/Streamlined Workflow/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Transparency & Traceability/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Role-based Access/i)).toBeInTheDocument();

    // Pre-footer banner
    expect(
      screen.getByRole("heading", { name: /Get started with AIRE/i }),
    ).toBeInTheDocument();

    // Footer links & copyright
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Accessibility Statement/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms of Use/i)).toBeInTheDocument();
  });
});
