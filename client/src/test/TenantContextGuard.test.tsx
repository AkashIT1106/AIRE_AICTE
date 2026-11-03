import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { InstitutionDashboard } from "../pages/institution/InstitutionDashboard";
import { BatchUploadPage } from "../pages/institution/BatchUploadPage";
import { QuarantineTriagePage } from "../pages/institution/QuarantineTriagePage";
import { SubmissionsApi } from "@/lib/api";

const mockActiveInstitution = vi.hoisted(() => ({
  current: null as {
    id: string;
    name: string;
    code: string;
    status: string;
  } | null,
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "user-test", email: "user@test.gov.in", name: "Test User" },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    memberships: mockActiveInstitution.current
      ? [
          {
            institutionId: mockActiveInstitution.current.id,
            institution: mockActiveInstitution.current,
            role: "INSTITUTION_ADMIN",
          },
        ]
      : [],
    activeInstitution: mockActiveInstitution.current,
    platformRoles: ["INSTITUTION_ADMIN"],
    permissions: [],
    setActiveInstitutionId: vi.fn(),
    can: () => true,
    evaluate: () => ({ allowed: true }),
    login: vi.fn(),
    logout: vi.fn(),
    refreshAuth: vi.fn(),
  }),
}));

vi.mock("@/lib/api", () => ({
  SubmissionsApi: {
    listBatches: vi.fn().mockResolvedValue([]),
    createBatch: vi.fn().mockResolvedValue({
      id: "batch-1",
      stagedRecords: [],
      quarantineRecords: [],
    }),
    getBatch: vi.fn().mockResolvedValue({
      id: "batch-1",
      stagedRecords: [],
      quarantineRecords: [],
    }),
    remediateRow: vi.fn().mockResolvedValue({
      id: "batch-1",
      stagedRecords: [],
      quarantineRecords: [],
    }),
  },
  ApiException: class extends Error {
    code: string;
    constructor(err: any) {
      super(err.message);
      this.code = err.code;
    }
  },
}));

describe("Tenant Context Guard & Safe Null State Verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockActiveInstitution.current = null;
  });

  it("InstitutionDashboard renders alert and does NOT dispatch API calls when activeInstitution is null", async () => {
    render(
      <BrowserRouter>
        <InstitutionDashboard />
      </BrowserRouter>,
    );

    expect(
      screen.getByText("Institutional Context Required"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Please select an authorized institution from the tenant switcher/i,
      ),
    ).toBeInTheDocument();

    // Verify no API calls dispatched without tenant context
    expect(SubmissionsApi.listBatches).not.toHaveBeenCalled();
  });

  it("BatchUploadPage renders alert and blocks upload workflow when activeInstitution is null", async () => {
    render(
      <BrowserRouter>
        <BatchUploadPage />
      </BrowserRouter>,
    );

    expect(
      screen.getByText("Institutional Context Required"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /An authorized institutional context is required to upload admission batches/i,
      ),
    ).toBeInTheDocument();
    expect(SubmissionsApi.createBatch).not.toHaveBeenCalled();
  });

  it("QuarantineTriagePage renders alert and does NOT fetch batch when activeInstitution is null", async () => {
    render(
      <MemoryRouter initialEntries={["/institution/quarantine/batch-42"]}>
        <Routes>
          <Route
            path="/institution/quarantine/:batchId"
            element={<QuarantineTriagePage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Institutional Context Required"),
    ).toBeInTheDocument();
    expect(SubmissionsApi.getBatch).not.toHaveBeenCalled();
  });

  it("Dispatches queries strictly with the active institution ID when tenant context is present", async () => {
    mockActiveInstitution.current = {
      id: "test-tenant-uuid-9999",
      name: "Government Engineering College",
      code: "GEC-001",
      status: "APPROVED",
    };

    render(
      <BrowserRouter>
        <InstitutionDashboard />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(SubmissionsApi.listBatches).toHaveBeenCalledWith(
        "test-tenant-uuid-9999",
      );
    });
    expect(
      screen.getByText(/Government Engineering College/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Institutional Context Required"),
    ).not.toBeInTheDocument();
  });
});
