import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { RouteErrorBoundary } from "./RouteErrorBoundary";

const mockUseRouteError = vi.fn();
const mockIsRouteErrorResponse = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useRouteError: () => mockUseRouteError(),
    isRouteErrorResponse: (err: unknown) => mockIsRouteErrorResponse(err),
  };
});

describe("RouteErrorBoundary — Security & UX Invariants", () => {
  it("renders generic sanitized message without leaking error stack or internals on unexpected Error", () => {
    mockUseRouteError.mockReturnValue(
      new Error("FATAL: database password in cleartext db_secret_123"),
    );
    mockIsRouteErrorResponse.mockReturnValue(false);

    render(
      <BrowserRouter>
        <RouteErrorBoundary />
      </BrowserRouter>,
    );

    expect(
      screen.getByText("Unexpected Application Error"),
    ).toBeInTheDocument();
    // Security check: Must NOT leak internal error text or credentials
    expect(screen.queryByText(/db_secret_123/)).not.toBeInTheDocument();
    expect(screen.queryByText(/database password/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Reload Page/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Platform Home/i }),
    ).toBeInTheDocument();
  });

  it("renders friendly message for dynamic chunk fetch failures (post-deployment update)", () => {
    mockUseRouteError.mockReturnValue(
      new Error("Failed to fetch dynamically imported module: /assets/xyz.js"),
    );
    mockIsRouteErrorResponse.mockReturnValue(false);

    render(
      <BrowserRouter>
        <RouteErrorBoundary />
      </BrowserRouter>,
    );

    expect(screen.getByText("Module Update Detected")).toBeInTheDocument();
    expect(
      screen.getByText(/A newer version of the platform has been deployed/),
    ).toBeInTheDocument();
  });

  it("handles structured RouteErrorResponse properly", () => {
    mockUseRouteError.mockReturnValue({
      status: 403,
      statusText: "Forbidden",
      data: "Custom regulatory access restriction",
    });
    mockIsRouteErrorResponse.mockReturnValue(true);

    render(
      <BrowserRouter>
        <RouteErrorBoundary />
      </BrowserRouter>,
    );

    expect(screen.getByText("403 — Forbidden")).toBeInTheDocument();
    expect(
      screen.getByText("Custom regulatory access restriction"),
    ).toBeInTheDocument();
    expect(screen.getByText("Status Code: 403")).toBeInTheDocument();
  });
});
