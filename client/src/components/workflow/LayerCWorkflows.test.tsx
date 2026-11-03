import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  BatchUploadPanel,
  FileProcessingProgress,
  UploadValidationSummary,
  ValidationIssueSummary,
  QuarantineIssueRow,
  QuarantineTriageTable,
  StudentRecordSummary,
  QuotaCategoryIndicator,
  DuplicateRecordComparisonPanel,
  DuplicateRecordComparison,
  SubmissionStatusTimeline,
  InstitutionStatusPanel,
  AuditEventEntry,
  AuditLogViewer,
  AuditLogFilter,
  RecordVerificationSummary,
  DEMO_SAMPLE_RECORDS,
  MOCK_PROCESSING_STAGES,
  MOCK_VALIDATION_SUMMARY,
  MOCK_VALIDATION_ISSUES,
  MOCK_QUARANTINE_RECORDS,
  MOCK_STUDENT_RECORD,
  MOCK_QUOTA_ALLOCATIONS,
  MOCK_DUPLICATE_COMPARISON,
  MOCK_SUBMISSION_TIMELINE,
  MOCK_INSTITUTION_STATUS,
  MOCK_AUDIT_EVENTS,
  MOCK_RECORD_VERIFICATION,
} from "./index";

describe("Layer C Workflow Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. BatchUploadPanel
  describe("BatchUploadPanel", () => {
    it("renders with academic year, programme, and dropzone", () => {
      render(<BatchUploadPanel institutionCode="INST-101" />);
      expect(screen.getByTestId("batch-upload-panel")).toBeInTheDocument();
      expect(screen.getByText(/AISHE: INST-101/i)).toBeInTheDocument();
      expect(screen.getByText(/Admission Batch Upload/i)).toBeInTheDocument();
      expect(screen.getByText(/Click to upload/i)).toBeInTheDocument();
    });

    it("handles load sample trigger and submits parsed records", () => {
      const handleUpload = vi.fn();
      render(<BatchUploadPanel onUpload={handleUpload} />);

      const loadSampleBtn = screen.getByRole("button", {
        name: /Load Sample/i,
      });
      fireEvent.click(loadSampleBtn);

      // Should display pre-parsed candidates
      expect(
        screen.getByText(/5 Candidate Records Detected/i),
      ).toBeInTheDocument();

      const submitBtn = screen.getByRole("button", {
        name: /Ingest & Validate Batch/i,
      });
      fireEvent.click(submitBtn);

      expect(handleUpload).toHaveBeenCalledTimes(1);
      expect(handleUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          academicYear: "2026-27",
          programme: "B.Tech Computer Science and Engineering",
          records: expect.any(Array),
        }),
      );
    });

    it("displays error banner when error prop is provided", () => {
      render(
        <BatchUploadPanel error="Statutory column 'apaarId' is missing" />,
      );
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByText(/Statutory column 'apaarId' is missing/i),
      ).toBeInTheDocument();
    });

    it("provides valid statutory DEMO_SAMPLE_RECORDS fixture", () => {
      expect(DEMO_SAMPLE_RECORDS).toHaveLength(5);
      expect(DEMO_SAMPLE_RECORDS[0].studentName).toBe("Aarav Sharma");
    });
  });

  // 2. FileProcessingProgress
  describe("FileProcessingProgress", () => {
    it("renders all pipeline stages and live percentage", () => {
      render(
        <FileProcessingProgress
          stages={MOCK_PROCESSING_STAGES}
          progressPercent={65}
          status="processing"
          rowsProcessed={39}
          totalRows={60}
        />,
      );

      expect(
        screen.getByTestId("file-processing-progress"),
      ).toBeInTheDocument();
      expect(screen.getAllByText(/65%/).length).toBeGreaterThanOrEqual(1);
      expect(
        screen.getByText(/39 of 60 records analyzed/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/File Parsing & Header Check/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Quarantine Sorting/i)).toBeInTheDocument();
    });

    it("executes cancel and retry callbacks", () => {
      const handleCancel = vi.fn();
      render(
        <FileProcessingProgress status="processing" onCancel={handleCancel} />,
      );

      const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
      fireEvent.click(cancelBtn);
      expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it("executes view results callback when completed", () => {
      const handleViewResults = vi.fn();
      render(
        <FileProcessingProgress
          status="completed"
          progressPercent={100}
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

  // 3. UploadValidationSummary
  describe("UploadValidationSummary", () => {
    it("renders batch breakdown and calculates compliance rate", () => {
      render(<UploadValidationSummary summary={MOCK_VALIDATION_SUMMARY} />);

      expect(
        screen.getByTestId("upload-validation-summary"),
      ).toBeInTheDocument();
      expect(screen.getByText("60")).toBeInTheDocument(); // Total
      expect(screen.getByText("55")).toBeInTheDocument(); // Valid
      expect(screen.getByText("5")).toBeInTheDocument(); // Quarantined
      expect(screen.getByText(/91.7%/)).toBeInTheDocument(); // Compliance Rate
    });

    it("triggers quarantine filter and staged records navigation", () => {
      const handleFilterQuarantine = vi.fn();
      const handleViewStaged = vi.fn();

      render(
        <UploadValidationSummary
          summary={MOCK_VALIDATION_SUMMARY}
          onFilterQuarantine={handleFilterQuarantine}
          onViewStaged={handleViewStaged}
        />,
      );

      const triageBtn = screen.getByRole("button", {
        name: /Triage 5 Quarantined/i,
      });
      fireEvent.click(triageBtn);
      expect(handleFilterQuarantine).toHaveBeenCalledTimes(1);

      const stagedBtn = screen.getByRole("button", {
        name: /View Staged Records/i,
      });
      fireEvent.click(stagedBtn);
      expect(handleViewStaged).toHaveBeenCalledTimes(1);
    });
  });

  // 4. ValidationIssueSummary
  describe("ValidationIssueSummary", () => {
    it("renders grouped issue cards with APH rule citations", () => {
      render(<ValidationIssueSummary issues={MOCK_VALIDATION_ISSUES} />);
      expect(
        screen.getByTestId("validation-issue-summary"),
      ).toBeInTheDocument();
      expect(screen.getByText(/INVALID_DATE_FORMAT/i)).toBeInTheDocument();
      expect(
        screen.getByText(/UNRECOGNIZED_RESERVATION_CATEGORY/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/APH 2026-27 Section 4.2/i)).toBeInTheDocument();
    });

    it("filters issues by severity tab and triggers issue selection", () => {
      const handleSelect = vi.fn();
      render(
        <ValidationIssueSummary
          issues={MOCK_VALIDATION_ISSUES}
          onSelectIssue={handleSelect}
        />,
      );

      const warningsTab = screen.getByRole("button", { name: /^Warnings/i });
      fireEvent.click(warningsTab);

      // Advisory issue should be visible
      expect(screen.getByText(/UNVERIFIED_IDENTIFIER/i)).toBeInTheDocument();

      // Click on issue card to trigger callback
      const issueCard = screen
        .getByText(/UNVERIFIED_IDENTIFIER/i)
        .closest("div[role='button']");
      if (issueCard) {
        fireEvent.click(issueCard);
        expect(handleSelect).toHaveBeenCalledWith(
          "apaarId",
          "UNVERIFIED_IDENTIFIER",
        );
      }
    });

    it("renders empty state when issues array is empty", () => {
      render(<ValidationIssueSummary issues={[]} />);
      expect(
        screen.getByText(/No Validation Issues Found/i),
      ).toBeInTheDocument();
    });
  });

  // 5. QuarantineIssueRow
  describe("QuarantineIssueRow", () => {
    const mockRecord = MOCK_QUARANTINE_RECORDS[0];

    it("renders defective candidate information and error badges", () => {
      render(<QuarantineIssueRow record={mockRecord} />);
      expect(
        screen.getByTestId(`quarantine-issue-row-${mockRecord.rowId}`),
      ).toBeInTheDocument();
      expect(screen.getByText(/Divya Balasubramanian/i)).toBeInTheDocument();
      expect(screen.getByText(/#14/)).toBeInTheDocument();
      expect(screen.getByText(/Field 'category'/i)).toBeInTheDocument();
    });

    it("toggles inspection of raw JSON payload", () => {
      render(<QuarantineIssueRow record={mockRecord} />);
      const inspectBtn = screen.getByRole("button", {
        name: /Toggle raw data/i,
      });
      fireEvent.click(inspectBtn);

      expect(screen.getByText(/Raw Payload Object/i)).toBeInTheDocument();
      expect(screen.getAllByText(/OBC-NCL-TYPO/).length).toBeGreaterThanOrEqual(
        1,
      );
    });

    it("triggers onRemediate and onDiscard callbacks", () => {
      const handleRemediate = vi.fn();
      const handleDiscard = vi.fn();

      render(
        <QuarantineIssueRow
          record={mockRecord}
          onRemediate={handleRemediate}
          onDiscard={handleDiscard}
        />,
      );

      const remediateBtn = screen.getByRole("button", {
        name: /Remediate row #14/i,
      });
      fireEvent.click(remediateBtn);
      expect(handleRemediate).toHaveBeenCalledWith(mockRecord);

      const discardBtn = screen.getByRole("button", {
        name: /Discard row #14/i,
      });
      fireEvent.click(discardBtn);
      expect(handleDiscard).toHaveBeenCalledWith(mockRecord);
    });
  });

  // 6. QuarantineTriageTable
  describe("QuarantineTriageTable", () => {
    it("renders high-density table of quarantined records", () => {
      render(<QuarantineTriageTable records={MOCK_QUARANTINE_RECORDS} />);
      expect(screen.getByTestId("quarantine-triage-table")).toBeInTheDocument();
      expect(screen.getByText(/Divya Balasubramanian/i)).toBeInTheDocument();
      expect(screen.getByText(/Vikram Malhotra/i)).toBeInTheDocument();
      expect(screen.getByText(/Sneha Mukherjee/i)).toBeInTheDocument();
    });

    it("filters records by search input", () => {
      render(<QuarantineTriageTable records={MOCK_QUARANTINE_RECORDS} />);
      const searchInput = screen.getByLabelText(/Search quarantined records/i);
      fireEvent.change(searchInput, { target: { value: "Vikram" } });

      expect(screen.getByText(/Vikram Malhotra/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/Divya Balasubramanian/i),
      ).not.toBeInTheDocument();
    });

    it("opens remediation modal and submits corrected row", async () => {
      const handleRemediateRow = vi.fn();
      render(
        <QuarantineTriageTable
          records={MOCK_QUARANTINE_RECORDS}
          onRemediateRow={handleRemediateRow}
        />,
      );

      const remediateBtns = screen.getAllByRole("button", {
        name: /Remediate/i,
      });
      fireEvent.click(remediateBtns[0]); // open modal for row #14

      expect(
        screen.getByText(/Remediate Quarantined Record #14/i),
      ).toBeInTheDocument();

      const saveBtn = screen.getByRole("button", {
        name: /Save & Promote to Staged/i,
      });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(handleRemediateRow).toHaveBeenCalledTimes(1);
      });
    });
  });

  // 7. StudentRecordSummary
  describe("StudentRecordSummary", () => {
    it("renders student credential card with masked APAAR by default", () => {
      render(<StudentRecordSummary student={MOCK_STUDENT_RECORD} />);
      expect(screen.getByTestId("student-record-summary")).toBeInTheDocument();
      expect(screen.getByText(/Aarav Sharma/i)).toBeInTheDocument();
      expect(screen.getByText("••••-••••-1042")).toBeInTheDocument();
      expect(
        screen.getByText(/Delhi Institute of Technology/i),
      ).toBeInTheDocument();
    });

    it("toggles APAAR unmasking when clicking unmask", () => {
      const handleUnmask = vi.fn();
      render(
        <StudentRecordSummary
          student={MOCK_STUDENT_RECORD}
          onUnmask={handleUnmask}
        />,
      );

      const unmaskBtn = screen.getByRole("button", { name: /Unmask APAAR/i });
      fireEvent.click(unmaskBtn);

      expect(screen.getByText("9821-4412-1042")).toBeInTheDocument();
      expect(handleUnmask).toHaveBeenCalledTimes(1);
    });

    it("triggers print and download callbacks", () => {
      const handlePrint = vi.fn();
      const handleDownload = vi.fn();

      render(
        <StudentRecordSummary
          student={MOCK_STUDENT_RECORD}
          onPrint={handlePrint}
          onDownload={handleDownload}
        />,
      );

      const printBtn = screen.getByRole("button", { name: /Print/i });
      fireEvent.click(printBtn);
      expect(handlePrint).toHaveBeenCalledTimes(1);

      const downloadBtn = screen.getByRole("button", {
        name: /Download Proof/i,
      });
      fireEvent.click(downloadBtn);
      expect(handleDownload).toHaveBeenCalledTimes(1);
    });
  });

  // 8. QuotaCategoryIndicator
  describe("QuotaCategoryIndicator", () => {
    it("renders overall intake capacity overview and category progress bars", () => {
      render(<QuotaCategoryIndicator overview={MOCK_QUOTA_ALLOCATIONS} />);
      expect(
        screen.getByTestId("quota-category-indicator"),
      ).toBeInTheDocument();
      expect(screen.getByText(/348 \/ 360/)).toBeInTheDocument();
      expect(screen.getByText(/Open General \(AI\)/i)).toBeInTheDocument();
      expect(screen.getByText(/OBC-NCL Quota/i)).toBeInTheDocument();
      expect(screen.getByText(/SUPERNUMERARY \(\+5%\)/i)).toBeInTheDocument();
    });

    it("renders single quota mode with breach indicator", () => {
      render(
        <QuotaCategoryIndicator
          quota="Management Quota"
          allocated={12}
          sanctionedCapacity={10}
        />,
      );

      expect(
        screen.getByTestId("quota-indicator-Management Quota"),
      ).toBeInTheDocument();
      expect(screen.getByText(/OVER-ADMISSION BREACH/i)).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
    });
  });

  // 9. DuplicateRecordComparisonPanel
  describe("DuplicateRecordComparisonPanel", () => {
    it("renders side-by-side comparative table for conflicting admission claims", () => {
      render(
        <DuplicateRecordComparisonPanel
          conflictData={MOCK_DUPLICATE_COMPARISON}
        />,
      );
      expect(
        screen.getByTestId("duplicate-record-comparison"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/CONFLICT: DUAL_ENROLLMENT/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Delhi Institute of Technology/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/NCR Institute of Engineering & Technology/i),
      ).toBeInTheDocument();
    });

    it("also exports under named alias DuplicateRecordComparison", () => {
      expect(DuplicateRecordComparison).toBe(DuplicateRecordComparisonPanel);
    });

    it("triggers keep, overwrite, and escalate actions", () => {
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

      const escalateBtn = screen.getByRole("button", {
        name: /Escalate to AICTE/i,
      });
      fireEvent.click(escalateBtn);
      expect(handleResolve).toHaveBeenCalledWith("escalate");
    });
  });

  // 10. SubmissionStatusTimeline
  describe("SubmissionStatusTimeline", () => {
    it("renders cohort submission lifecycle with chronological milestones", () => {
      render(
        <SubmissionStatusTimeline
          currentStatus={MOCK_SUBMISSION_TIMELINE.currentStatus}
          milestones={MOCK_SUBMISSION_TIMELINE.milestones}
        />,
      );

      expect(
        screen.getByTestId("submission-status-timeline"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Batch Spreadsheet Uploaded/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Automated Schema & Rule Engine/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Quarantine Triage Required/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Dr. K. S. Sharma/i)).toBeInTheDocument();
    });
  });

  // 11. InstitutionStatusPanel
  describe("InstitutionStatusPanel", () => {
    it("renders institution compliance dashboard with intake metrics", () => {
      render(<InstitutionStatusPanel institution={MOCK_INSTITUTION_STATUS} />);
      expect(
        screen.getByTestId("institution-status-panel"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Delhi Institute of Technology/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/AISHE: U-0123/i)).toBeInTheDocument();
      expect(screen.getByText(/360/)).toBeInTheDocument(); // approved intake
      expect(screen.getByText(/348/)).toBeInTheDocument(); // enrolled
      expect(
        screen.getByText(/Mandatory APAAR Seed Rate Review/i),
      ).toBeInTheDocument();
    });

    it("triggers onViewBatches callback", () => {
      const handleViewBatches = vi.fn();
      render(
        <InstitutionStatusPanel
          institution={MOCK_INSTITUTION_STATUS}
          onViewBatches={handleViewBatches}
        />,
      );

      const viewBtn = screen.getByRole("button", { name: /View Batches/i });
      fireEvent.click(viewBtn);
      expect(handleViewBatches).toHaveBeenCalledTimes(1);
    });
  });

  // 12. AuditEventEntry
  describe("AuditEventEntry", () => {
    const mockEvent = MOCK_AUDIT_EVENTS[0];

    it("renders immutable audit event card with correlation ID", () => {
      render(<AuditEventEntry event={mockEvent} />);
      expect(
        screen.getByTestId(`audit-event-${mockEvent.id}`),
      ).toBeInTheDocument();
      expect(screen.getByText(/Ingest Admission Batch/i)).toBeInTheDocument();
      expect(screen.getByText(/admin@dit.ac.in/i)).toBeInTheDocument();
      expect(screen.getByText(mockEvent.correlationId)).toBeInTheDocument();
    });

    it("expands to inspect immutable diff", () => {
      render(<AuditEventEntry event={mockEvent} />);
      const inspectBtn = screen.getByRole("button", { name: /Inspect Diff/i });
      fireEvent.click(inspectBtn);

      expect(
        screen.getByText(/Immutable State Mutation Diff/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Before:/i)).toBeInTheDocument();
      expect(screen.getByText(/After:/i)).toBeInTheDocument();
    });

    it("triggers onViewProof callback when Merkle proof exists", () => {
      const handleViewProof = vi.fn();
      render(
        <AuditEventEntry event={mockEvent} onViewProof={handleViewProof} />,
      );

      const proofBtn = screen.getByRole("button", { name: /Merkle Proof/i });
      fireEvent.click(proofBtn);
      expect(handleViewProof).toHaveBeenCalledWith(mockEvent.id);
    });
  });

  // 13. AuditLogViewer & AuditLogFilter
  describe("AuditLogViewer and AuditLogFilter", () => {
    it("renders filter controls and filters audit table rows", () => {
      render(<AuditLogViewer logs={MOCK_AUDIT_EVENTS} />);
      expect(screen.getByTestId("audit-log-viewer")).toBeInTheDocument();
      expect(screen.getByTestId("audit-log-filter")).toBeInTheDocument();
      expect(screen.getByText(/Ingest Admission Batch/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Remediate Quarantined Record/i),
      ).toBeInTheDocument();

      // Search for specific action or tenant
      const searchInput = screen.getByPlaceholderText(
        /corr_01HNY or dit.ac.in/i,
      );
      fireEvent.change(searchInput, { target: { value: "outsider" } });

      expect(
        screen.getByText(/Unauthorized Cross-Tenant Attempt/i),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Ingest Admission Batch/i),
      ).not.toBeInTheDocument();
    });

    it("opens inspect diff dialog from table row", () => {
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
    });

    it("triggers onExport callback", () => {
      const handleExport = vi.fn();
      render(
        <AuditLogViewer logs={MOCK_AUDIT_EVENTS} onExport={handleExport} />,
      );

      const exportBtn = screen.getByRole("button", {
        name: /Export Audit Log/i,
      });
      fireEvent.click(exportBtn);
      expect(handleExport).toHaveBeenCalledTimes(1);
    });

    it("renders AuditLogFilter directly and handles filter change and reset", () => {
      const handleFilterChange = vi.fn();
      const handleReset = vi.fn();

      render(
        <AuditLogFilter
          filters={{ searchQuery: "init" }}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />,
      );

      expect(screen.getByTestId("audit-log-filter")).toBeInTheDocument();
      const resetBtn = screen.getByRole("button", { name: /Reset Filters/i });
      fireEvent.click(resetBtn);
      expect(handleReset).toHaveBeenCalledTimes(1);
    });
  });

  // 14. RecordVerificationSummary
  describe("RecordVerificationSummary", () => {
    it("renders verifiable AEP certificate card with QR code and signature digest", () => {
      render(
        <RecordVerificationSummary
          verificationData={MOCK_RECORD_VERIFICATION}
        />,
      );
      expect(
        screen.getByTestId("record-verification-summary"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Technical Education Concordance Certificate/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/CONCORDED & VALIDATED/i)).toBeInTheDocument();
      expect(screen.getByText(/Aarav Sharma/i)).toBeInTheDocument();
      expect(screen.getByText(/••••-••••-1042/i)).toBeInTheDocument();
      expect(
        screen.getByText(/0x98f24a10cbe782168ea4017290bcda114e9f71c/i),
      ).toBeInTheDocument();
    });

    it("triggers print and download proof actions", () => {
      const handlePrint = vi.fn();
      const handleDownload = vi.fn();

      render(
        <RecordVerificationSummary
          verificationData={MOCK_RECORD_VERIFICATION}
          onPrint={handlePrint}
          onDownload={handleDownload}
        />,
      );

      const printBtn = screen.getByRole("button", { name: /Print/i });
      fireEvent.click(printBtn);
      expect(handlePrint).toHaveBeenCalledTimes(1);

      const downloadBtn = screen.getByRole("button", {
        name: /Download Proof PDF/i,
      });
      fireEvent.click(downloadBtn);
      expect(handleDownload).toHaveBeenCalledTimes(1);
    });
  });
});
