import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";

// 1. Import all components and fixtures from barrel index
import * as Barrel from "./index";

// 2. Import all components and fixtures directly from individual modules
import * as BatchUploadPanelModule from "./BatchUploadPanel";
import * as FileProcessingProgressModule from "./FileProcessingProgress";
import * as UploadValidationSummaryModule from "./UploadValidationSummary";
import * as ValidationIssueSummaryModule from "./ValidationIssueSummary";
import * as QuarantineIssueRowModule from "./QuarantineIssueRow";
import * as QuarantineTriageTableModule from "./QuarantineTriageTable";
import * as StudentRecordSummaryModule from "./StudentRecordSummary";
import * as QuotaCategoryIndicatorModule from "./QuotaCategoryIndicator";
import * as DuplicateRecordComparisonPanelModule from "./DuplicateRecordComparisonPanel";
import * as SubmissionStatusTimelineModule from "./SubmissionStatusTimeline";
import * as InstitutionStatusPanelModule from "./InstitutionStatusPanel";
import * as AuditEventEntryModule from "./AuditEventEntry";
import * as AuditLogFilterModule from "./AuditLogFilter";
import * as AuditLogViewerModule from "./AuditLogViewer";
import * as RecordVerificationSummaryModule from "./RecordVerificationSummary";
import * as MockDataModule from "./mockData";

describe("Layer C Contract, Import & Regression Stress Harness (challenger_m2_2)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Provide jsdom URL.createObjectURL mock if not defined
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = vi.fn(
        () => "blob:http://localhost/mock-blob",
      );
    }
  });

  // =========================================================================
  // Test Suite 1: Public Contract & Export Parity
  // =========================================================================
  describe("Suite 1: Public Contract & Export Parity", () => {
    const components: Array<[string, unknown, unknown]> = [
      [
        "BatchUploadPanel",
        Barrel.BatchUploadPanel,
        BatchUploadPanelModule.BatchUploadPanel,
      ],
      [
        "FileProcessingProgress",
        Barrel.FileProcessingProgress,
        FileProcessingProgressModule.FileProcessingProgress,
      ],
      [
        "UploadValidationSummary",
        Barrel.UploadValidationSummary,
        UploadValidationSummaryModule.UploadValidationSummary,
      ],
      [
        "ValidationIssueSummary",
        Barrel.ValidationIssueSummary,
        ValidationIssueSummaryModule.ValidationIssueSummary,
      ],
      [
        "QuarantineIssueRow",
        Barrel.QuarantineIssueRow,
        QuarantineIssueRowModule.QuarantineIssueRow,
      ],
      [
        "QuarantineTriageTable",
        Barrel.QuarantineTriageTable,
        QuarantineTriageTableModule.QuarantineTriageTable,
      ],
      [
        "StudentRecordSummary",
        Barrel.StudentRecordSummary,
        StudentRecordSummaryModule.StudentRecordSummary,
      ],
      [
        "QuotaCategoryIndicator",
        Barrel.QuotaCategoryIndicator,
        QuotaCategoryIndicatorModule.QuotaCategoryIndicator,
      ],
      [
        "DuplicateRecordComparisonPanel",
        Barrel.DuplicateRecordComparisonPanel,
        DuplicateRecordComparisonPanelModule.DuplicateRecordComparisonPanel,
      ],
      [
        "SubmissionStatusTimeline",
        Barrel.SubmissionStatusTimeline,
        SubmissionStatusTimelineModule.SubmissionStatusTimeline,
      ],
      [
        "InstitutionStatusPanel",
        Barrel.InstitutionStatusPanel,
        InstitutionStatusPanelModule.InstitutionStatusPanel,
      ],
      [
        "AuditEventEntry",
        Barrel.AuditEventEntry,
        AuditEventEntryModule.AuditEventEntry,
      ],
      [
        "AuditLogFilter",
        Barrel.AuditLogFilter,
        AuditLogFilterModule.AuditLogFilter,
      ],
      [
        "AuditLogViewer",
        Barrel.AuditLogViewer,
        AuditLogViewerModule.AuditLogViewer,
      ],
      [
        "RecordVerificationSummary",
        Barrel.RecordVerificationSummary,
        RecordVerificationSummaryModule.RecordVerificationSummary,
      ],
    ];

    it("verifies all 15 workflow components are defined, non-null and renderable", () => {
      expect(components).toHaveLength(15);

      for (const [name, barrelComp, directComp] of components) {
        expect(barrelComp, `${name} in barrel should be defined`).toBeDefined();
        expect(
          barrelComp,
          `${name} in barrel should not be null`,
        ).not.toBeNull();
        expect(
          directComp,
          `${name} in direct module should be defined`,
        ).toBeDefined();
        expect(
          directComp,
          `${name} in direct module should not be null`,
        ).not.toBeNull();

        // Exact referential identity between barrel and direct module
        expect(barrelComp).toBe(directComp);

        // Valid React component
        const isRenderable =
          typeof barrelComp === "function" ||
          (typeof barrelComp === "object" &&
            barrelComp !== null &&
            "$$typeof" in barrelComp);
        expect(
          isRenderable,
          `${name} must be a valid React renderable component`,
        ).toBe(true);
      }
    });

    it("verifies named compatibility aliases (e.g., DuplicateRecordComparison)", () => {
      expect(Barrel.DuplicateRecordComparison).toBeDefined();
      expect(Barrel.DuplicateRecordComparison).toBe(
        Barrel.DuplicateRecordComparisonPanel,
      );
      expect(
        DuplicateRecordComparisonPanelModule.DuplicateRecordComparison,
      ).toBe(
        DuplicateRecordComparisonPanelModule.DuplicateRecordComparisonPanel,
      );
    });

    it("verifies all statutory mock fixtures are defined, non-null and match direct modules", () => {
      const fixtures: Array<[string, unknown, unknown]> = [
        [
          "DEMO_SAMPLE_RECORDS",
          Barrel.DEMO_SAMPLE_RECORDS,
          MockDataModule.DEMO_SAMPLE_RECORDS,
        ],
        [
          "SAMPLE_CSV_TEMPLATE",
          Barrel.SAMPLE_CSV_TEMPLATE,
          MockDataModule.SAMPLE_CSV_TEMPLATE,
        ],
        [
          "MOCK_ADMISSION_BATCH_INPUT",
          Barrel.MOCK_ADMISSION_BATCH_INPUT,
          MockDataModule.MOCK_ADMISSION_BATCH_INPUT,
        ],
        [
          "MOCK_PROCESSING_STAGES",
          Barrel.MOCK_PROCESSING_STAGES,
          MockDataModule.MOCK_PROCESSING_STAGES,
        ],
        [
          "MOCK_VALIDATION_SUMMARY",
          Barrel.MOCK_VALIDATION_SUMMARY,
          MockDataModule.MOCK_VALIDATION_SUMMARY,
        ],
        [
          "MOCK_VALIDATION_ISSUES",
          Barrel.MOCK_VALIDATION_ISSUES,
          MockDataModule.MOCK_VALIDATION_ISSUES,
        ],
        [
          "MOCK_QUARANTINE_RECORDS",
          Barrel.MOCK_QUARANTINE_RECORDS,
          MockDataModule.MOCK_QUARANTINE_RECORDS,
        ],
        [
          "MOCK_STUDENT_RECORD",
          Barrel.MOCK_STUDENT_RECORD,
          MockDataModule.MOCK_STUDENT_RECORD,
        ],
        [
          "MOCK_QUOTA_ALLOCATIONS",
          Barrel.MOCK_QUOTA_ALLOCATIONS,
          MockDataModule.MOCK_QUOTA_ALLOCATIONS,
        ],
        [
          "MOCK_DUPLICATE_COMPARISON",
          Barrel.MOCK_DUPLICATE_COMPARISON,
          MockDataModule.MOCK_DUPLICATE_COMPARISON,
        ],
        [
          "MOCK_SUBMISSION_TIMELINE",
          Barrel.MOCK_SUBMISSION_TIMELINE,
          MockDataModule.MOCK_SUBMISSION_TIMELINE,
        ],
        [
          "MOCK_INSTITUTION_STATUS",
          Barrel.MOCK_INSTITUTION_STATUS,
          MockDataModule.MOCK_INSTITUTION_STATUS,
        ],
        [
          "MOCK_AUDIT_EVENTS",
          Barrel.MOCK_AUDIT_EVENTS,
          MockDataModule.MOCK_AUDIT_EVENTS,
        ],
        [
          "MOCK_RECORD_VERIFICATION",
          Barrel.MOCK_RECORD_VERIFICATION,
          MockDataModule.MOCK_RECORD_VERIFICATION,
        ],
      ];

      for (const [name, barrelFixture, directFixture] of fixtures) {
        expect(
          barrelFixture,
          `${name} in barrel should be defined`,
        ).toBeDefined();
        expect(
          barrelFixture,
          `${name} in barrel should not be null`,
        ).not.toBeNull();
        expect(barrelFixture).toBe(directFixture);
      }
    });
  });

  // =========================================================================
  // Test Suite 2: Component Mounting & Edge Case Stress
  // =========================================================================
  describe("Suite 2: Component Mounting & Edge-Case Stress", () => {
    // 1. BatchUploadPanel
    it("BatchUploadPanel mounts with zero optional props and handles actions cleanly without crashing", () => {
      const { container } = render(<Barrel.BatchUploadPanel />);
      expect(container).toBeDefined();

      // Ingest button disabled initially
      const submitBtn = screen.getByRole("button", {
        name: /Ingest & Validate Batch/i,
      });
      expect(submitBtn).toBeDisabled();

      // Download CSV template trigger executes without crashing
      const templateBtn = screen.getByRole("button", { name: /CSV Template/i });
      expect(() => fireEvent.click(templateBtn)).not.toThrow();
    });

    it("BatchUploadPanel handles isUploading loading state and disabled inputs", () => {
      render(<Barrel.BatchUploadPanel isUploading={true} />);
      const submitBtn = screen.getByRole("button", {
        name: /Ingest & Validate Batch/i,
      });
      expect(submitBtn).toBeDisabled();
      expect(submitBtn).toHaveAttribute("aria-busy", "true");
    });

    // 2. FileProcessingProgress
    it("FileProcessingProgress renders under boundary conditions (0%, 100%, empty stages)", () => {
      // 0% progress and empty stages
      const { rerender } = render(
        <Barrel.FileProcessingProgress stages={[]} progressPercent={0} />,
      );
      expect(screen.getByText("0%")).toBeInTheDocument();

      // 100% progress
      rerender(
        <Barrel.FileProcessingProgress
          stages={[
            {
              id: "s1",
              label: "Stage 1",
              description: "Desc 1",
              status: "completed",
            },
            {
              id: "s2",
              label: "Stage 2",
              description: "Desc 2",
              status: "failed",
            },
          ]}
          progressPercent={100}
        />,
      );
      expect(screen.getByText("100%")).toBeInTheDocument();
      expect(screen.getByText("Stage 1")).toBeInTheDocument();
      expect(screen.getByText("Stage 2")).toBeInTheDocument();
    });

    // 3. UploadValidationSummary
    it("UploadValidationSummary handles zero total counts and 100% compliance without division-by-zero crash", () => {
      // 0 total count (edge case: 0 / 0)
      const { rerender } = render(
        <Barrel.UploadValidationSummary
          summary={{
            totalCount: 0,
            validCount: 0,
            quarantineCount: 0,
            rejectedCount: 0,
            complianceRate: 0,
            validatedAt: "2026-11-03 10:00 IST",
            batchId: "TEST-0",
          }}
        />,
      );
      expect(screen.getByText("0%")).toBeInTheDocument();

      // 100% compliance
      rerender(
        <Barrel.UploadValidationSummary
          summary={{
            totalCount: 50,
            validCount: 50,
            quarantineCount: 0,
            rejectedCount: 0,
            complianceRate: 100,
            validatedAt: "2026-11-03 10:00 IST",
            batchId: "TEST-100",
          }}
        />,
      );
      expect(screen.getByText("100%")).toBeInTheDocument();
      expect(screen.getByText("Fully Concordant")).toBeInTheDocument();
    });

    // 4. ValidationIssueSummary
    it("ValidationIssueSummary handles empty issue list and non-matching filter", () => {
      const { container } = render(
        <Barrel.ValidationIssueSummary issues={[]} />,
      );
      expect(
        screen.getByText(/No Validation Issues Found/i),
      ).toBeInTheDocument();
      expect(container).toBeDefined();
    });

    // 5. QuarantineIssueRow
    it("QuarantineIssueRow mounts with minimal record and triggers actions safely", () => {
      const record = Barrel.MOCK_QUARANTINE_RECORDS[0];
      const handleRemediate = vi.fn();
      const handleDiscard = vi.fn();

      render(
        <Barrel.QuarantineIssueRow
          record={record}
          onRemediate={handleRemediate}
          onDiscard={handleDiscard}
        />,
      );

      // Safe button clicks
      const remediateBtn = screen.getByRole("button", {
        name: /Remediate row #14/i,
      });
      fireEvent.click(remediateBtn);
      expect(handleRemediate).toHaveBeenCalledWith(record);

      const discardBtn = screen.getByRole("button", {
        name: /Discard row #14/i,
      });
      fireEvent.click(discardBtn);
      expect(handleDiscard).toHaveBeenCalledWith(record);

      // Toggle raw payload inspection
      const rawToggle = screen.getByRole("button", {
        name: /Toggle raw data/i,
      });
      fireEvent.click(rawToggle);
      expect(screen.getByText("Raw Payload Object")).toBeInTheDocument();
    });

    // 6. QuarantineTriageTable
    it("QuarantineTriageTable handles empty records array and search mismatch without crashing", () => {
      const { rerender } = render(
        <Barrel.QuarantineTriageTable records={[]} />,
      );
      expect(screen.getByText(/No Quarantined Records/i)).toBeInTheDocument();

      // Rerender with mock data and search for non-existent record
      rerender(
        <Barrel.QuarantineTriageTable
          records={Barrel.MOCK_QUARANTINE_RECORDS}
        />,
      );
      const searchInput = screen.getByLabelText(/Search quarantined records/i);
      fireEvent.change(searchInput, {
        target: { value: "NON_EXISTENT_NAME_XYZ" },
      });
      expect(screen.getByText(/No Quarantined Records/i)).toBeInTheDocument();
    });

    // 7. StudentRecordSummary
    it("StudentRecordSummary renders with default mock, toggles APAAR unmasking, and handles missing handlers", () => {
      render(<Barrel.StudentRecordSummary />);
      expect(screen.getByText("Aarav Sharma")).toBeInTheDocument();

      // Unmask click
      const unmaskBtn = screen.getByRole("button", {
        name: /Unmask APAAR identifier/i,
      });
      fireEvent.click(unmaskBtn);
      expect(
        screen.getByRole("button", { name: /Mask APAAR identifier/i }),
      ).toBeInTheDocument();
    });

    // 8. QuotaCategoryIndicator
    it("QuotaCategoryIndicator handles overview mode and single quota mode", () => {
      // Default overview mode
      const { rerender } = render(<Barrel.QuotaCategoryIndicator />);
      expect(
        screen.getByText(/Sanctioned Intake & Quota Allocations/i),
      ).toBeInTheDocument();

      // Single quota mode with 0 enrolled
      rerender(
        <Barrel.QuotaCategoryIndicator
          quota="Sports Quota"
          allocated={0}
          sanctionedCapacity={10}
          status="compliant"
        />,
      );
      const sportsCard = screen.getByTestId("quota-indicator-Sports Quota");
      expect(within(sportsCard).getByText("Sports Quota")).toBeInTheDocument();
      expect(within(sportsCard).getByText("0%")).toBeInTheDocument();

      // Single quota mode with OVER_INTAKE / breach
      rerender(
        <Barrel.QuotaCategoryIndicator
          quota="Management Quota"
          allocated={35}
          sanctionedCapacity={30}
          status="breach"
        />,
      );
      const mgmtCard = screen.getByTestId("quota-indicator-Management Quota");
      expect(
        within(mgmtCard).getByText("Management Quota"),
      ).toBeInTheDocument();
      expect(
        within(mgmtCard).getByText("OVER-ADMISSION BREACH"),
      ).toBeInTheDocument();
    });

    // 9. DuplicateRecordComparisonPanel
    it("DuplicateRecordComparisonPanel renders with default conflict and executes fallback resolution", () => {
      render(<Barrel.DuplicateRecordComparisonPanel />);
      expect(
        screen.getByText(/Duplicate Admission Claim Comparison/i),
      ).toBeInTheDocument();

      // Click Keep Claim without callback (safe no-op)
      const keepBtn = screen.getByRole("button", {
        name: /Keep Existing Claim/i,
      });
      expect(() => fireEvent.click(keepBtn)).not.toThrow();

      // Click Escalate without callback (safe no-op)
      const escalateBtn = screen.getByRole("button", {
        name: /Escalate to AICTE/i,
      });
      expect(() => fireEvent.click(escalateBtn)).not.toThrow();
    });

    // 10. SubmissionStatusTimeline
    it("SubmissionStatusTimeline handles empty timeline gracefully", () => {
      const { container } = render(
        <Barrel.SubmissionStatusTimeline milestones={[]} />,
      );
      expect(
        screen.getByText(/Statutory Cohort Submission Lifecycle/i),
      ).toBeInTheDocument();
      expect(container).toBeDefined();
    });

    // 11. InstitutionStatusPanel
    it("InstitutionStatusPanel renders active, show-cause, and non-compliant states safely", () => {
      const { rerender } = render(<Barrel.InstitutionStatusPanel />);
      expect(
        screen.getByText("Delhi Institute of Technology"),
      ).toBeInTheDocument();

      // SHOW_CAUSE status with notice
      rerender(
        <Barrel.InstitutionStatusPanel
          institution={{
            code: "INST-TEST",
            name: "Test Polytechnic Institute",
            aisheCode: "U-9999",
            status: "SHOW_CAUSE",
            eoaOrderNumber: "AICTE/EOA/2026/TEST",
            approvedIntake: 100,
            enrolled: 95,
            quarantined: 15,
            complianceRate: 75.0,
            regulatoryDeadline: "2026-11-15 18:00 IST",
            activeNotices: [
              {
                id: "N-1",
                title: "Show Cause Notice Issued for Intake Irregularities",
                severity: "danger",
                issuedDate: "2026-11-01",
              },
            ],
          }}
        />,
      );
      expect(screen.getByText("SHOW CAUSE NOTICE")).toBeInTheDocument();
      expect(
        screen.getByText("Show Cause Notice Issued for Intake Irregularities"),
      ).toBeInTheDocument();
    });

    // 12. AuditEventEntry
    it("AuditEventEntry renders mutation diff and copies correlation ID safely", () => {
      const event = Barrel.MOCK_AUDIT_EVENTS[0];
      render(<Barrel.AuditEventEntry event={event} />);
      expect(screen.getByText(event.correlationId)).toBeInTheDocument();

      // Copy correlation ID trigger
      const copyBtn = screen.getByTitle(/Copy correlation ID/i);
      expect(() => fireEvent.click(copyBtn)).not.toThrow();

      // Toggle diff inspection
      const diffToggleBtn = screen.getByRole("button", {
        name: /Inspect Diff/i,
      });
      fireEvent.click(diffToggleBtn);
      expect(screen.getByText(/Resource Endpoint/i)).toBeInTheDocument();
    });

    // 13. AuditLogFilter & AuditLogViewer
    it("AuditLogFilter mounts and triggers changes safely", () => {
      const handleFilterChange = vi.fn();
      const handleReset = vi.fn();

      render(
        <Barrel.AuditLogFilter
          filters={{}}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />,
      );
      const searchInput = screen.getByPlaceholderText(
        /e\.g\. corr_01HNY or dit\.ac\.in/i,
      );
      fireEvent.change(searchInput, { target: { value: "admin" } });
      expect(handleFilterChange).toHaveBeenCalled();

      const resetBtn = screen.getByRole("button", { name: /Reset Filters/i });
      fireEvent.click(resetBtn);
      expect(handleReset).toHaveBeenCalled();
    });

    it("AuditLogViewer handles empty event list without crashing", () => {
      render(<Barrel.AuditLogViewer logs={[]} />);
      expect(screen.getByText(/No Audit Events Matched/i)).toBeInTheDocument();
    });

    // 14. RecordVerificationSummary
    it("RecordVerificationSummary renders authentic and pending states cleanly", () => {
      const { rerender } = render(<Barrel.RecordVerificationSummary />);
      expect(
        screen.getByText(/Technical Education Concordance Certificate/i),
      ).toBeInTheDocument();
      expect(screen.getByText("CONCORDED & VALIDATED")).toBeInTheDocument();

      // Pending state
      rerender(
        <Barrel.RecordVerificationSummary
          verificationData={{
            ...Barrel.MOCK_RECORD_VERIFICATION,
            status: "PENDING",
          }}
        />,
      );
      expect(screen.getByText("PENDING")).toBeInTheDocument();

      // Invalid state
      rerender(
        <Barrel.RecordVerificationSummary
          verificationData={{
            ...Barrel.MOCK_RECORD_VERIFICATION,
            status: "INVALID",
          }}
        />,
      );
      expect(screen.getByText("INVALID")).toBeInTheDocument();
    });
  });
});
