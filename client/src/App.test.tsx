import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("Client Root Application", () => {
  it("renders regulatory header and platform title", () => {
    render(<App />);
    expect(screen.getByText("AIRE")).toBeInTheDocument();
    expect(
      screen.getByText("AICTE Admission Reconciliation & Evidence Platform"),
    ).toBeInTheDocument();
  });

  it("displays foundation status components", () => {
    render(<App />);
    expect(screen.getByText("Foundation Status")).toBeInTheDocument();
    expect(screen.getByText("API Monolith")).toBeInTheDocument();
    expect(screen.getByText("Data Architecture")).toBeInTheDocument();
    expect(screen.getByText("Security & Isolation")).toBeInTheDocument();
  });
});
