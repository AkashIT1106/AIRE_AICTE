import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App, { createAppRouter } from "./App";

describe("Client Root Application — Production Architecture & Standalone Authentication", () => {
  it("renders standalone login gateway with brand identity and secure form for unauthenticated users", async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Sign in to your account/i }),
      ).toBeInTheDocument();
    });

    // Brand and platform title
    expect(screen.getAllByText("AIRE").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Admission Reconciliation & Evidence Platform/i)
        .length,
    ).toBeGreaterThan(0);

    // Form inputs
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign in/i }),
    ).toBeInTheDocument();
  });

  it("does not render application shell sidebar or navigation on the login route", async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Sign in to your account/i }),
      ).toBeInTheDocument();
    });

    // AppShell sidebar and collapse button must NOT be rendered on /login
    expect(
      screen.queryByRole("navigation", { name: "Workspace navigation" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Collapse sidebar/i }),
    ).not.toBeInTheDocument();
  });

  it("renders neutral institutional branding without unsupported claims or dev credentials", async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Sign in to your account/i }),
      ).toBeInTheDocument();
    });

    // Must NOT contain unsupported claims or dev shortcuts
    expect(
      screen.queryByText(/DPDP Act 2023 Classified/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Development Test Credentials/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /DIT Operator/i }),
    ).not.toBeInTheDocument();
  });

  it("supports createAppRouter with initial entries and protects unauthorized workspaces", async () => {
    // When attempting to access protected institution workspace unauthenticated,
    // data router intercepts and redirects to /login rather than mounting protected chunk.
    const router = createAppRouter({
      initialEntries: ["/institution/dashboard"],
    });

    render(<App router={router} />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Sign in to your account/i }),
      ).toBeInTheDocument();
    });

    // Protected workspace content must never be visible
    expect(
      screen.queryByText(/Institutional Overview/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Batch Upload/i)).not.toBeInTheDocument();
  });

  it("handles unknown fallback routes cleanly with NotFoundPage fallback", async () => {
    const router = createAppRouter({
      initialEntries: ["/non-existent-route-404"],
    });

    render(<App router={router} />);

    await waitFor(() => {
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /Return to Platform Home/i }),
    ).toBeInTheDocument();
  });
});
