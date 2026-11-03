import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { WorkspaceGuard } from "@/components/auth/WorkspaceGuard";
import { AccessDeniedPage } from "@/pages/error/AccessDeniedPage";
import { NotFoundPage } from "@/pages/error/NotFoundPage";
import { WorkspaceType } from "@aire/authorization";

describe("Client-Side RBAC & ABAC Workspace Authorization & Error Boundaries", () => {
  it("redirects unauthenticated users attempting to access protected institution workspace to /login", () => {
    render(
      <MemoryRouter initialEntries={["/institution/dashboard"]}>
        <Routes>
          <Route path="/login" element={<div>Official Login Screen</div>} />
          <Route
            path="/institution"
            element={
              <WorkspaceGuard requiredWorkspace={WorkspaceType.INSTITUTION} />
            }
          >
            <Route path="dashboard" element={<div>Protected Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Official Login Screen")).toBeInTheDocument();
    expect(screen.queryByText("Protected Dashboard")).not.toBeInTheDocument();
  });

  it("renders institutional AccessDeniedPage with 403 code and correlation details", () => {
    render(
      <MemoryRouter>
        <AccessDeniedPage
          code="ACCESS_DENIED_SCOPE_MISMATCH"
          message="User cannot access another institution's admission records."
          correlationId="corr-test-403"
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Access Restricted (HTTP 403)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("ACCESS_DENIED_SCOPE_MISMATCH"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "User cannot access another institution's admission records.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("corr-test-403")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Go Back/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Workspace/i }),
    ).toBeInTheDocument();
  });

  it("renders institutional NotFoundPage with 404 code", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Page Not Found (HTTP 404)")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The requested institutional URL does not exist or has been moved.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Return to Platform Home/i }),
    ).toBeInTheDocument();
  });
});
