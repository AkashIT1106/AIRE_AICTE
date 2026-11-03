import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";
import { InstitutionDashboard } from "./InstitutionDashboard";
import { BatchUploadPage } from "./BatchUploadPage";
import { QuarantineTriagePage } from "./QuarantineTriagePage";
import { SubmissionsApi } from "@/lib/api";
import { SubmissionBatch } from "@aire/api-contracts";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "user-1", email: "admin@dit.ac.in", name: "Admin" },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    memberships: [
      {
        institutionId: "6c847216-26de-4d10-9ea8-c5e0edd160f0",
        institution: {
          id: "6c847216-26de-4d10-9ea8-c5e0edd160f0",
          name: "Delhi Institute of Technology",
          code: "INST-101",
        },
        role: "INSTITUTION_ADMIN",
      },
    ],
    activeInstitution: {
      id: "6c847216-26de-4d10-9ea8-c5e0edd160f0",
      name: "Delhi Institute of Technology",
      code: "INST-101",
      status: "APPROVED",
    },
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

vi.mock("@/lib/api", () => {
  const mockBatch: SubmissionBatch = {
    id: "batch-101",
    institutionId: "6c847216-26de-4d10-9ea8-c5e0edd160f0",
    academicYear: "2026-27",
    programme: "B.Tech Computer Science and Engineering",
    fileName: "admissions_batch.csv",
    status: "QUARANTINED",
    totalCount: 3,
    validCount: 2,
    quarantineCount: 1,
    stagedRecords: [
      {
        rowId: "staged-1",
        rowNumber: 1,
        data: {
          studentName: "Aarav Sharma",
          rollNumber: "2026-CSE-001",
          dateOfBirth: "2005-04-12",
          category: "GEN",
          quota: "General / All India",
          apaarId: "9821-4412-1042",
        },
        status: "ACCEPTED",
        validatedAt: "2026-11-02T10:00:00Z",
      },
    ],
    quarantineRecords: [
      {
        rowId: "quarantine-1",
        rowNumber: 2,
        rawData: {
          studentName: "Ananya Iyer",
          rollNumber: "2026-CSE-002",
          dateOfBirth: "2005-11-19",
          category: "OBC-NCL-TYPO",
          quota: "Home State Quota",
        },
        errors: [
          {
            field: "category",
            message: "Invalid category. Allowed: GEN, OBC-NCL, SC, ST, EWS",
            received: "OBC-NCL-TYPO",
          },
        ],
        status: "QUARANTINED",
      },
    ],
    createdAt: "2026-11-02T10:00:00Z",
    updatedAt: "2026-11-02T10:00:00Z",
  };

  return {
    DEMO_INSTITUTION_ID: "6c847216-26de-4d10-9ea8-c5e0edd160f0",
    SubmissionsApi: {
      listBatches: vi.fn().mockResolvedValue([mockBatch]),
      createBatch: vi.fn().mockResolvedValue(mockBatch),
      getBatch: vi.fn().mockResolvedValue(mockBatch),
      remediateRow: vi.fn().mockResolvedValue({
        ...mockBatch,
        quarantineCount: 0,
        validCount: 3,
        status: "READY_FOR_SIGN_OFF",
        quarantineRecords: [],
        stagedRecords: [
          ...mockBatch.stagedRecords,
          {
            rowId: "quarantine-1",
            rowNumber: 2,
            data: {
              studentName: "Ananya Iyer",
              rollNumber: "2026-CSE-002",
              dateOfBirth: "2005-11-19",
              category: "OBC-NCL",
              quota: "Home State Quota",
            },
            status: "ACCEPTED",
            validatedAt: "2026-11-02T10:05:00Z",
          },
        ],
      }),
    },
    ApiException: class extends Error {
      code: string;
      constructor(err: any) {
        super(err.message);
        this.code = err.code;
      }
    },
  };
});

describe("Journey J-02: Admission Batch Ingestion & Quarantine Triage (Client)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("S-10: Renders Institution Dashboard with batches and metrics", async () => {
    render(
      <BrowserRouter>
        <InstitutionDashboard />
      </BrowserRouter>,
    );

    expect(
      screen.getByText(/Delhi Institute of Technology/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Admission Reporting & Batch Submissions"),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("B.Tech Computer Science and Engineering"),
      ).toBeInTheDocument();
      expect(screen.getByText("admissions_batch.csv")).toBeInTheDocument();
      expect(screen.getByText("Quarantine (Action Req)")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /Upload New Batch/i }),
    ).toBeInTheDocument();
  });

  it("S-11: Renders Batch Upload Page with preview and triggers ingestion", async () => {
    render(
      <BrowserRouter>
        <BatchUploadPage />
      </BrowserRouter>,
    );

    expect(
      screen.getByText("Upload Admission Batch (S-11)"),
    ).toBeInTheDocument();
    expect(screen.getByText("1. Programme & Intake Cycle")).toBeInTheDocument();
    expect(
      screen.getByText("2. Admission Spreadsheet Upload"),
    ).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", {
      name: /Start Ingestion & Schema Validation/i,
    });
    expect(submitBtn).toBeInTheDocument();

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(SubmissionsApi.createBatch).toHaveBeenCalled();
    });
  });

  it("S-12: Renders Quarantine Triage Workbench and remediates quarantined row", async () => {
    render(
      <MemoryRouter initialEntries={["/institution/submissions/batch-101"]}>
        <Routes>
          <Route
            path="/institution/submissions/:batchId"
            element={<QuarantineTriagePage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Quarantine Triage Required (1 Records Isolated)"),
      ).toBeInTheDocument();
      expect(screen.getByText("Ananya Iyer")).toBeInTheDocument();
      expect(screen.getByText("OBC-NCL-TYPO")).toBeInTheDocument();
    });

    // Click Remediate button to open modal
    const remediateBtn = screen.getByRole("button", { name: /Remediate/i });
    fireEvent.click(remediateBtn);

    // Modal opens
    await waitFor(() => {
      expect(
        screen.getByText("Remediate Quarantined Record"),
      ).toBeInTheDocument();
    });

    // Click Save & Re-validate
    const saveBtn = screen.getByRole("button", { name: /Save & Re-validate/i });
    fireEvent.click(saveBtn);

    // Verify API called and UI updates to success state
    await waitFor(() => {
      expect(SubmissionsApi.remediateRow).toHaveBeenCalledWith(
        "6c847216-26de-4d10-9ea8-c5e0edd160f0",
        "batch-101",
        "quarantine-1",
        expect.objectContaining({
          category: "OBC-NCL",
        }),
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText("All Records Cleanly Validated & Staged"),
      ).toBeInTheDocument();
      expect(screen.getByText("Ready for Sign-Off")).toBeInTheDocument();
    });
  });
});
