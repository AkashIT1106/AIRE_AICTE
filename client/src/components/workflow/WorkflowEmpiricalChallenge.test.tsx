import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  BatchUploadPanel,
  FileProcessingProgress,
  QuarantineTriageTable,
  DuplicateRecordComparisonPanel,
  DuplicateRecordComparison,
  StudentRecordSummary,
  AuditEventEntry,
  AuditLogViewer,
  RecordVerificationSummary,
  QuotaCategoryIndicator,
  SubmissionStatusTimeline,
  UploadValidationSummary,
  ValidationIssueSummary,
  MOCK_QUARANTINE_RECORDS,
  MOCK_DUPLICATE_COMPARISON,
  MOCK_STUDENT_RECORD,
  MOCK_AUDIT_EVENTS,
  MOCK_RECORD_VERIFICATION,
} from "./index";

describe("Layer C Workflow Empirical Stress Harness", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // Challenge 1: Batch Upload Triggers & Sample Loading
  // =========================================================================
  describe("Challenge 1: Batch Upload Triggers & Sample Record Loading", () => {
    it("handles initial state with no file and disables submit until data is present", () => {
      const handleUpload = vi.fn();
      render(<BatchUploadPanel onUpload={handleUpload} />);

      const submitBtn = screen.getByRole("button", {
        name: /Ingest & Validate Batch/i,
      });
      expect(submitBtn).toBeDisabled();

      // Submit attempt while disabled should not trigger onUpload
      fireEvent.click(submitBtn);
      expect(handleUpload).not.toHaveBeenCalled();
    });

    it("loads sample records, displays preview counter, and submits valid payload", () => {
      const handleUpload = vi.fn();
      render(<BatchUploadPanel onUpload={handleUpload} />);

      const loadSampleBtn = screen.getByRole("button", {
        name: /Load Sample/i,
      });
      fireEvent.click(loadSampleBtn);

      // Verify sample records detected
      expect(
        screen.getByText(/5 Candidate Records Detected/i),
      ).toBeInTheDocument();

      const submitBtn = screen.getByRole("button", {
        name: /Ingest & Validate Batch/i,
      });
      expect(submitBtn).toBeEnabled();

      fireEvent.click(submitBtn);

      expect(handleUpload).toHaveBeenCalledTimes(1);
      expect(handleUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          academicYear: "2026-27",
          programme: "B.Tech Computer Science and Engineering",
          fileName: "sample_btech_admissions_triage.csv",
          records: expect.arrayContaining([
            expect.objectContaining({
              studentName: "Aarav Sharma",
              rollNumber: "2026-CSE-101",
            }),
          ]),
        }),
      );
    });

    it("clears pre-parsed records when Clear button is clicked", () => {
      const handleUpload = vi.fn();
      render(<BatchUploadPanel onUpload={handleUpload} />);

      // Load sample
      fireEvent.click(screen.getByRole("button", { name: /Load Sample/i }));
      expect(
        screen.getByText(/5 Candidate Records Detected/i),
      ).toBeInTheDocument();

      // Click Clear
      const clearBtn = screen.getByLabelText("Clear parsed records");
      fireEvent.click(clearBtn);

      // Candidate preview should be removed
      expect(
        screen.queryByText(/Candidate Records Detected/i),
      ).not.toBeInTheDocument();

      // Submit button should be disabled again
      const submitBtn = screen.getByRole("button", {
        name: /Ingest & Validate Batch/i,
      });
      expect(submitBtn).toBeDisabled();
    });

    it("parses valid CSV text from dropped/selected file and enables submission", async () => {
      const handleUpload = vi.fn();
      render(<BatchUploadPanel onUpload={handleUpload} />);

      const csvContent =
        "studentName,rollNumber,dateOfBirth,category,quota,apaarId\n" +
        "Rohan Gupta,2026-CSE-106,2005-04-12,GEN,All India Quota,9821-4412-1049\n" +
        "Priya Iyer,2026-CSE-107,2005-08-25,OBC-NCL,Home State Quota,9821-4412-1050";

      const file = new File([csvContent], "new_candidates.csv", {
        type: "text/csv",
      });

      // Find file input and simulate upload
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(
          screen.getByText(/2 Candidate Records Detected/i),
        ).toBeInTheDocument();
      });

      const submitBtn = screen.getByRole("button", {
        name: /Ingest & Validate Batch/i,
      });
      fireEvent.click(submitBtn);

      expect(handleUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: "new_candidates.csv",
          records: expect.arrayContaining([
            expect.objectContaining({
              studentName: "Rohan Gupta",
              rollNumber: "2026-CSE-106",
            }),
            expect.objectContaining({
              studentName: "Priya Iyer",
              rollNumber: "2026-CSE-107",
            }),
          ]),
        }),
      );
    });

    it("handles corrupt/header-only CSV file with inline error alert", async () => {
      render(<BatchUploadPanel />);

      const headerOnlyCsv = "studentName,rollNumber,dateOfBirth";
      const file = new File([headerOnlyCsv], "empty_batch.csv", {
        type: "text/csv",
      });

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(
          screen.getByText(/contains no candidate record rows/i),
        ).toBeInTheDocument();
      });

      expect(
        screen.queryByText(/Candidate Records Detected/i),
      ).not.toBeInTheDocument();
    });

    it("enforces isUploading={true} loading state with anti-double-submission", () => {
      const handleUpload = vi.fn();
      render(
        <BatchUploadPanel
          isUploading={true}
          onUpload={handleUpload}
          academicYear="2026-27"
        />,
      );

      const submitBtn = screen.getByRole("button", {
        name: /Ingest & Validate Batch/i,
      });
      expect(submitBtn).toBeDisabled();
      expect(submitBtn).toHaveAttribute("aria-busy", "true");
    });
  });

  // =========================================================================
  // Challenge 2: Stage Progression in FileProcessingProgress
  // =========================================================================
  describe("Challenge 2: Stage Progression in FileProcessingProgress", () => {
    it("renders idle and in-progress pipeline states accurately", () => {
      const { rerender } = render(
        <FileProcessingProgress
          status="processing"
          progressPercent={40}
          rowsProcessed={24}
          totalRows={60}
          stages={[
            {
              id: "s1",
              label: "Parsing",
              description: "Format check",
              status: "completed",
            },
            {
              id: "s2",
              label: "Validation",
              description: "Schema check",
              status: "running",
              progress: 40,
            },
            {
              id: "s3",
              label: "Quarantine",
              description: "Filter defects",
              status: "pending",
            },
          ]}
        />,
      );

      expect(screen.getByText("PROCESSING")).toBeInTheDocument();
      expect(screen.getByText("24 of 60 records analyzed")).toBeInTheDocument();
      expect(screen.getAllByText("40%").length).toBeGreaterThanOrEqual(1);

      // Rerender to completed
      rerender(
        <FileProcessingProgress
          status="completed"
          progressPercent={100}
          rowsProcessed={60}
          totalRows={60}
        />,
      );

      expect(screen.getByText("COMPLETED")).toBeInTheDocument();
      expect(screen.getByText("60 of 60 records analyzed")).toBeInTheDocument();
      expect(
        screen.getByText("Ingestion Pipeline Completed"),
      ).toBeInTheDocument();
    });

    it("renders failure halted state with error message banner and retry button", () => {
      const handleRetry = vi.fn();
      render(
        <FileProcessingProgress
          status="error"
          progressPercent={50}
          errorMessage="Statutory database connection timed out during AICTE schema verification"
          onRetry={handleRetry}
          stages={[
            {
              id: "s1",
              label: "Parsing",
              description: "Format check",
              status: "completed",
            },
            {
              id: "s2",
              label: "Validation",
              description: "Schema check",
              status: "failed",
            },
          ]}
        />,
      );

      expect(screen.getByText("ERROR")).toBeInTheDocument();
      expect(screen.getByText("Ingestion Pipeline Halted")).toBeInTheDocument();
      expect(
        screen.getByText(
          /Statutory database connection timed out during AICTE schema verification/i,
        ),
      ).toBeInTheDocument();

      const retryBtn = screen.getByRole("button", {
        name: /Retry Validation/i,
      });
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it("displays Cancel trigger while processing and fires callback", () => {
      const handleCancel = vi.fn();
      render(
        <FileProcessingProgress
          status="processing"
          progressPercent={25}
          onCancel={handleCancel}
        />,
      );

      const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
      fireEvent.click(cancelBtn);
      expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it("displays View Results trigger only on completion", () => {
      const handleViewResults = vi.fn();
      const { rerender } = render(
        <FileProcessingProgress
          status="processing"
          onViewResults={handleViewResults}
        />,
      );

      expect(
        screen.queryByRole("button", { name: /View Results & Triage/i }),
      ).not.toBeInTheDocument();

      rerender(
        <FileProcessingProgress
          status="completed"
          onViewResults={handleViewResults}
        />,
      );

      const resultsBtn = screen.getByRole("button", {
        name: /View Results & Triage/i,
      });
      fireEvent.click(resultsBtn);
      expect(handleViewResults).toHaveBeenCalledTimes(1);
    });
  });

  // =========================================================================
  // Challenge 3: Quarantine Remediation Submission in QuarantineTriageTable
  // =========================================================================
  describe("Challenge 3: Quarantine Remediation Submission in QuarantineTriageTable", () => {
    it("opens modal with pre-populated values and handles successful remediation", async () => {
      const handleRemediateRow = vi.fn().mockResolvedValue(undefined);
      render(
        <QuarantineTriageTable
          records={MOCK_QUARANTINE_RECORDS}
          onRemediateRow={handleRemediateRow}
        />,
      );

      // Target row #14
      const remediateBtn = screen.getByLabelText("Remediate row #14");
      fireEvent.click(remediateBtn);

      expect(
        screen.getByText(/Remediate Quarantined Record #14/i),
      ).toBeInTheDocument();

      // Check pre-populated student name
      const nameInput = screen.getByLabelText(
        /Candidate Full Name/i,
      ) as HTMLInputElement;
      expect(nameInput.value).toBe("Divya Balasubramanian");

      const saveBtn = screen.getByRole("button", {
        name: /Save & Promote to Staged/i,
      });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(handleRemediateRow).toHaveBeenCalledWith(
          "qr-001",
          expect.objectContaining({
            studentName: "Divya Balasubramanian",
            rollNumber: "2026-CSE-204",
            dateOfBirth: "2005-12-05",
            category: "OBC-NCL",
          }),
        );
      });
    });

    it("retains modal open and displays error when remediation promise rejects", async () => {
      const handleRemediateRow = vi
        .fn()
        .mockRejectedValue(
          new Error("Statutory APAAR seed concordance check failed"),
        );

      render(
        <QuarantineTriageTable
          records={MOCK_QUARANTINE_RECORDS}
          onRemediateRow={handleRemediateRow}
        />,
      );

      fireEvent.click(screen.getByLabelText("Remediate row #14"));

      const saveBtn = screen.getByRole("button", {
        name: /Save & Promote to Staged/i,
      });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(
          screen.getByText(/Statutory APAAR seed concordance check failed/i),
        ).toBeInTheDocument();
      });

      // Dialog should still be open
      expect(
        screen.getByText(/Remediate Quarantined Record #14/i),
      ).toBeInTheDocument();
    });

    it("triggers discard row callback with rowId", () => {
      const handleDiscardRow = vi.fn();
      render(
        <QuarantineTriageTable
          records={MOCK_QUARANTINE_RECORDS}
          onDiscardRow={handleDiscardRow}
        />,
      );

      const discardBtn = screen.getByLabelText("Discard row #14");
      fireEvent.click(discardBtn);

      expect(handleDiscardRow).toHaveBeenCalledWith("qr-001");
    });

    it("filters records by field violation selector", () => {
      render(<QuarantineTriageTable records={MOCK_QUARANTINE_RECORDS} />);

      const searchInput = screen.getByLabelText(/Search quarantined records/i);
      fireEvent.change(searchInput, { target: { value: "Mukherjee" } });

      expect(screen.getByText(/Sneha Mukherjee/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/Divya Balasubramanian/i),
      ).not.toBeInTheDocument();
    });

    it("shows empty state when search matches zero records", () => {
      render(<QuarantineTriageTable records={MOCK_QUARANTINE_RECORDS} />);

      const searchInput = screen.getByLabelText(/Search quarantined records/i);
      fireEvent.change(searchInput, {
        target: { value: "NonExistentStudentName" },
      });

      expect(
        screen.getByText(/No Quarantined Records Found/i),
      ).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Challenge 4: Duplicate Record Resolution in DuplicateRecordComparisonPanel
  // =========================================================================
  describe("Challenge 4: Duplicate Record Resolution Actions", () => {
    it("renders side-by-side comparison table highlighting amber conflict rows", () => {
      render(
        <DuplicateRecordComparisonPanel
          conflictData={MOCK_DUPLICATE_COMPARISON}
        />,
      );

      expect(
        screen.getByText(/CONFLICT: DUAL_ENROLLMENT/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /active admission claims in two competing AICTE institutions/i,
        ),
      ).toBeInTheDocument();

      // Conflicting institutions shown side-by-side
      expect(
        screen.getByText(/Delhi Institute of Technology \(INST-101\)/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /NCR Institute of Engineering & Technology \(INST-204\)/i,
        ),
      ).toBeInTheDocument();
    });

    it("executes keep existing claim resolution and reflects status badge", () => {
      const handleResolve = vi.fn();
      render(
        <DuplicateRecordComparisonPanel
          conflictData={MOCK_DUPLICATE_COMPARISON}
          onResolve={handleResolve}
        />,
      );

      const keepBtn = screen.getByRole("button", {
        name: /Keep Existing Claim/i,
      });
      fireEvent.click(keepBtn);

      expect(handleResolve).toHaveBeenCalledWith("keep");
      expect(screen.getByText("STATUS: KEEP")).toBeInTheDocument();
    });

    it("executes overwrite with incoming claim resolution and reflects status badge", () => {
      const handleResolve = vi.fn();
      render(
        <DuplicateRecordComparisonPanel
          conflictData={MOCK_DUPLICATE_COMPARISON}
          onResolve={handleResolve}
        />,
      );

      const overwriteBtn = screen.getByRole("button", {
        name: /Overwrite with Incoming/i,
      });
      fireEvent.click(overwriteBtn);

      expect(handleResolve).toHaveBeenCalledWith("overwrite");
      expect(screen.getByText("STATUS: OVERWRITE")).toBeInTheDocument();
    });

    it("executes escalate to AICTE resolution and reflects status badge", () => {
      const handleResolve = vi.fn();
      render(
        <DuplicateRecordComparisonPanel
          conflictData={MOCK_DUPLICATE_COMPARISON}
          onResolve={handleResolve}
        />,
      );

      const escalateBtn = screen.getByRole("button", {
        name: /Escalate to AICTE/i,
      });
      fireEvent.click(escalateBtn);

      expect(handleResolve).toHaveBeenCalledWith("escalate");
      expect(screen.getByText("STATUS: ESCALATE")).toBeInTheDocument();
    });

    it("supports individual props fallback and alias export", () => {
      expect(DuplicateRecordComparison).toBe(DuplicateRecordComparisonPanel);

      render(
        <DuplicateRecordComparison
          conflictType="DUPLICATE_APAAR"
          existingRecord={{
            studentName: "Aarav Sharma",
            apaarId: "9821-4412-1042",
            rollNumber: "2026-CSE-101",
            institutionName: "DIT",
            institutionCode: "INST-101",
            programme: "B.Tech CSE",
            quota: "General",
            category: "GEN",
            dateOfAdmission: "2026-08-01",
          }}
          incomingRecord={{
            studentName: "Aarav Sharma",
            apaarId: "9821-4412-1042",
            rollNumber: "2026-IT-044",
            institutionName: "NIT",
            institutionCode: "INST-301",
            programme: "B.Tech IT",
            quota: "State Quota",
            category: "GEN",
            dateOfAdmission: "2026-08-05",
          }}
          conflictingFields={["institutionName", "rollNumber"]}
        />,
      );

      expect(
        screen.getByText(/CONFLICT: DUPLICATE_APAAR/i),
      ).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Challenge 5: Masked APAAR Unmasking in StudentRecordSummary
  // =========================================================================
  describe("Challenge 5: Masked APAAR Unmasking in StudentRecordSummary", () => {
    it("displays masked APAAR by default (••••-••••-1042) for privacy protection", () => {
      render(<StudentRecordSummary student={MOCK_STUDENT_RECORD} />);

      expect(screen.getByText("••••-••••-1042")).toBeInTheDocument();
      expect(screen.queryByText("9821-4412-1042")).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Unmask APAAR identifier/i }),
      ).toBeInTheDocument();
    });

    it("toggles unmasking to reveal raw APAAR identifier and calls onUnmask", () => {
      const handleUnmask = vi.fn();
      render(
        <StudentRecordSummary
          student={MOCK_STUDENT_RECORD}
          onUnmask={handleUnmask}
        />,
      );

      const unmaskBtn = screen.getByRole("button", {
        name: /Unmask APAAR identifier/i,
      });
      fireEvent.click(unmaskBtn);

      // Now revealed
      expect(screen.getByText("9821-4412-1042")).toBeInTheDocument();
      expect(screen.queryByText("••••-••••-1042")).not.toBeInTheDocument();
      expect(handleUnmask).toHaveBeenCalledTimes(1);

      // Toggle back to mask
      const maskBtn = screen.getByRole("button", {
        name: /Mask APAAR identifier/i,
      });
      fireEvent.click(maskBtn);

      expect(screen.getByText("••••-••••-1042")).toBeInTheDocument();
      expect(screen.queryByText("9821-4412-1042")).not.toBeInTheDocument();
      expect(handleUnmask).toHaveBeenCalledTimes(2);
    });

    it("disables unmask toggle when allowUnmask={false} enforcing DPDP compliance", () => {
      render(
        <StudentRecordSummary
          student={MOCK_STUDENT_RECORD}
          allowUnmask={false}
        />,
      );

      expect(screen.getByText("••••-••••-1042")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /Unmask/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /Mask/i }),
      ).not.toBeInTheDocument();
    });

    it("renders respective status banners for VERIFIED, QUARANTINED, and PENDING", () => {
      const { rerender } = render(
        <StudentRecordSummary
          student={{ ...MOCK_STUDENT_RECORD, status: "VERIFIED" }}
        />,
      );
      expect(
        screen.getByText(/Statutory Concordance Established/i),
      ).toBeInTheDocument();

      rerender(
        <StudentRecordSummary
          student={{ ...MOCK_STUDENT_RECORD, status: "QUARANTINED" }}
        />,
      );
      expect(
        screen.getByText(/Quarantine Triage Required/i),
      ).toBeInTheDocument();

      rerender(
        <StudentRecordSummary
          student={{ ...MOCK_STUDENT_RECORD, status: "PENDING" }}
        />,
      );
      expect(screen.getByText(/Verification In Progress/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Challenge 6: Audit Event JSON Diff Expansion
  // =========================================================================
  describe("Challenge 6: Audit Event JSON Diff Expansion in AuditEventEntry and AuditLogViewer", () => {
    it("toggles expandable JSON mutation diff in AuditEventEntry", () => {
      render(<AuditEventEntry event={MOCK_AUDIT_EVENTS[0]} />);

      const diffToggleBtn = screen.getByRole("button", {
        name: /Inspect Diff/i,
      });
      expect(diffToggleBtn).toHaveAttribute("aria-expanded", "false");
      expect(
        screen.queryByText(/Immutable State Mutation Diff/i),
      ).not.toBeInTheDocument();

      // Expand diff
      fireEvent.click(diffToggleBtn);
      expect(diffToggleBtn).toHaveAttribute("aria-expanded", "true");
      expect(
        screen.getByText(/Immutable State Mutation Diff/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Before:/i)).toBeInTheDocument();
      expect(screen.getByText(/After:/i)).toBeInTheDocument();

      // Verify mutation content
      expect(screen.getByText(/"totalBatches": 0/)).toBeInTheDocument();
      expect(screen.getByText(/"totalEnrolled": 60/)).toBeInTheDocument();

      // Collapse diff
      const hideToggleBtn = screen.getByRole("button", { name: /Hide Diff/i });
      fireEvent.click(hideToggleBtn);
      expect(
        screen.queryByText(/Immutable State Mutation Diff/i),
      ).not.toBeInTheDocument();
    });

    it("copies correlation ID in AuditEventEntry with visual feedback", async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      render(<AuditEventEntry event={MOCK_AUDIT_EVENTS[0]} />);

      const copyBtn = screen.getByRole("button", {
        name: new RegExp(
          `Copy correlation ID ${MOCK_AUDIT_EVENTS[0].correlationId}`,
          "i",
        ),
      });
      fireEvent.click(copyBtn);

      expect(writeTextMock).toHaveBeenCalledWith(
        MOCK_AUDIT_EVENTS[0].correlationId,
      );
    });

    it("opens inspect diff dialog from AuditLogViewer table row", () => {
      const handleInspectDiff = vi.fn();
      render(
        <AuditLogViewer
          logs={MOCK_AUDIT_EVENTS}
          onInspectDiff={handleInspectDiff}
        />,
      );

      const diffBtns = screen.getAllByRole("button", { name: /Diff/i });
      fireEvent.click(diffBtns[0]);

      expect(handleInspectDiff).toHaveBeenCalledWith(MOCK_AUDIT_EVENTS[0]);
      expect(
        screen.getByRole("heading", {
          name: new RegExp(
            `Audit Mutation Diff.*${MOCK_AUDIT_EVENTS[0].id}`,
            "i",
          ),
        }),
      ).toBeInTheDocument();
      expect(screen.getByText(/SHA-256 Checksum Digest/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Before vs After Mutation State/i),
      ).toBeInTheDocument();
    });

    it("filters audit logs by query, action, role, and resets properly", () => {
      const handleFilterChange = vi.fn();
      render(
        <AuditLogViewer
          logs={MOCK_AUDIT_EVENTS}
          onFilterChange={handleFilterChange}
        />,
      );

      // Search by email or correlation id
      const searchInput = screen.getByPlaceholderText(
        /corr_01HNY or dit.ac.in/i,
      );
      fireEvent.change(searchInput, { target: { value: "outsider" } });

      // Only unauthorized attempt should be visible
      expect(
        screen.getByText(/Unauthorized Cross-Tenant Attempt/i),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Ingest Admission Batch/i),
      ).not.toBeInTheDocument();

      // Reset
      const resetBtn = screen.getByRole("button", { name: /Reset Filters/i });
      fireEvent.click(resetBtn);

      expect(screen.getByText(/Ingest Admission Batch/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Challenge 7: Verification Credential Rendering in RecordVerificationSummary
  // =========================================================================
  describe("Challenge 7: Verification Credential Rendering in RecordVerificationSummary", () => {
    it("renders official AEP certificate with SVG QR code and cryptographic proof", () => {
      render(
        <RecordVerificationSummary
          verificationData={MOCK_RECORD_VERIFICATION}
        />,
      );

      expect(
        screen.getByText(/OFFICIAL ADMISSION ENTITLEMENT PROOF \(AEP\)/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Technical Education Concordance Certificate/i),
      ).toBeInTheDocument();
      expect(screen.getByText("CONCORDED & VALIDATED")).toBeInTheDocument();
      expect(screen.getByText("Aarav Sharma")).toBeInTheDocument();
      expect(
        screen.getByText(/Delhi Institute of Technology \(INST-101\)/i),
      ).toBeInTheDocument();
      expect(screen.getByText("AICTE/AEP/2026/DL-109281")).toBeInTheDocument();

      // Check SVG QR Code accessibility label
      const qrCode = screen.getByLabelText(
        /Verification QR Code for order AICTE\/AEP\/2026\/DL-109281/i,
      );
      expect(qrCode).toBeInTheDocument();

      // Check cryptographic hashes
      expect(
        screen.getByText("0x98f24a10cbe782168ea4017290bcda114e9f71c"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "0x4a7d65b2f8a910e14c3298a0d71ef4bc9c2e11894d01b87a24c5e391b072fa61",
        ),
      ).toBeInTheDocument();
    });

    it("triggers print and download proof triggers with custom handlers", () => {
      const handlePrint = vi.fn();
      const handleDownload = vi.fn();

      render(
        <RecordVerificationSummary
          verificationData={MOCK_RECORD_VERIFICATION}
          onPrint={handlePrint}
          onDownload={handleDownload}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /Print/i }));
      expect(handlePrint).toHaveBeenCalledTimes(1);

      fireEvent.click(
        screen.getByRole("button", { name: /Download Proof PDF/i }),
      );
      expect(handleDownload).toHaveBeenCalledTimes(1);
    });

    it("renders INVALID and PENDING statuses accurately with appropriate badge semantics", () => {
      const { rerender } = render(
        <RecordVerificationSummary
          verificationData={{
            ...MOCK_RECORD_VERIFICATION,
            status: "INVALID",
          }}
        />,
      );

      expect(screen.getByText("INVALID")).toBeInTheDocument();

      rerender(
        <RecordVerificationSummary
          verificationData={{
            ...MOCK_RECORD_VERIFICATION,
            status: "PENDING",
          }}
        />,
      );

      expect(screen.getByText("PENDING")).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Additional Workflows: Capacity, Timeline, & Validation Issue Summaries
  // =========================================================================
  describe("Additional Workflow Components Verification", () => {
    it("QuotaCategoryIndicator detects over-admission breaches", () => {
      render(
        <QuotaCategoryIndicator
          quota="Supernumerary NRI Quota"
          allocated={25}
          sanctionedCapacity={20}
        />,
      );

      expect(screen.getByText(/OVER-ADMISSION BREACH/i)).toBeInTheDocument();
      expect(screen.getByText("25")).toBeInTheDocument();
    });

    it("SubmissionStatusTimeline indicates active step with aria-current", () => {
      render(<SubmissionStatusTimeline />);

      const currentStep = document.querySelector('li[aria-current="step"]');
      expect(currentStep).toBeInTheDocument();
      expect(currentStep?.textContent).toContain("Quarantine Triage Required");
    });

    it("ValidationIssueSummary filters between All, Errors, and Warnings", () => {
      render(<ValidationIssueSummary />);

      // Default All
      expect(screen.getByText(/INVALID_DATE_FORMAT/i)).toBeInTheDocument();

      // Filter by Warnings
      const warningsBtn = screen.getByRole("button", { name: /^Warnings/i });
      fireEvent.click(warningsBtn);

      expect(
        screen.queryByText(/INVALID_DATE_FORMAT/i),
      ).not.toBeInTheDocument();
      expect(screen.getByText(/UNVERIFIED_IDENTIFIER/i)).toBeInTheDocument();
    });

    it("UploadValidationSummary calculates compliance percentage correctly", () => {
      render(
        <UploadValidationSummary
          summary={{
            batchId: "TEST-01",
            totalCount: 100,
            validCount: 92,
            quarantineCount: 8,
            rejectedCount: 0,
            complianceRate: 92,
            validatedAt: "2026-11-03",
          }}
        />,
      );

      expect(screen.getByText("92%")).toBeInTheDocument();
      expect(screen.getByText("TRIAGE REQUIRED (<95%)")).toBeInTheDocument();
    });
  });
});
