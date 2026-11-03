import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import {
  Button,
  ConfirmationDialog,
  FileUpload,
  ToastProvider,
  useToast,
} from "./index";

describe("Layer B Empirical Challenger Stress Harness", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // 1. Button Anti-Double-Submission & Processing State Stress Tests
  // =========================================================================
  describe("Challenge 1: Button Anti-Double-Submission", () => {
    it("verify button cannot be clicked when loading={true}", () => {
      const handleClick = vi.fn();
      render(
        <Button loading={true} onClick={handleClick}>
          Submit Application
        </Button>,
      );

      const button = screen.getByRole("button", {
        name: /Submit Application/i,
      });

      // Semantic & accessibility assertions
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toHaveClass("disabled:pointer-events-none");

      // Single click attempt
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();

      // Stress test: 15 rapid consecutive clicks (simulating frantic double/multi-clicks)
      for (let i = 0; i < 15; i++) {
        fireEvent.click(button);
      }
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("verify button cannot be clicked when disabled={true}", () => {
      const handleClick = vi.fn();
      render(
        <Button disabled={true} onClick={handleClick}>
          Action
        </Button>,
      );

      const button = screen.getByRole("button", { name: /Action/i });
      expect(button).toBeDisabled();
      expect(button).not.toHaveAttribute("aria-busy");

      // Stress test: 10 rapid clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("verify asChild button intercepts clicks and sets aria attributes when loading={true}", () => {
      const handleClick = vi.fn();
      render(
        <Button asChild loading={true} onClick={handleClick}>
          <a href="/download">Download Report</a>
        </Button>,
      );

      const link = screen.getByRole("link", { name: /Download Report/i });
      expect(link).toHaveAttribute("aria-busy", "true");
      expect(link).toHaveAttribute("aria-disabled", "true");

      fireEvent.click(link);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("verify dynamic transition from idle to loading blocks secondary clicks", () => {
      const handleClick = vi.fn();

      const DynamicSubmissionButton = () => {
        const [loading, setLoading] = React.useState(false);
        return (
          <Button
            loading={loading}
            onClick={(e) => {
              handleClick(e);
              setLoading(true);
            }}
          >
            {loading ? "Processing" : "Submit"}
          </Button>
        );
      };

      render(<DynamicSubmissionButton />);
      const btn = screen.getByRole("button");

      // First click: should succeed and transition state
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Now button is in loading state
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute("aria-busy", "true");

      // Subsequent 5 rapid clicks while loading
      for (let i = 0; i < 5; i++) {
        fireEvent.click(btn);
      }
      // Click count remains strictly 1
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("verify form submission is suppressed when submit button is loading", () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <input name="test" defaultValue="abc" />
          <Button type="submit" loading={true}>
            Save
          </Button>
        </form>,
      );

      const btn = screen.getByRole("button", { name: /Save/i });
      fireEvent.click(btn);
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // 2. Confirmation Dialog Attestation Gating Stress Tests
  // =========================================================================
  describe("Challenge 2: Confirmation Dialog Attestation Requirement", () => {
    it("verify confirm button remains disabled until the attestation checkbox is checked", () => {
      const handleConfirm = vi.fn();
      const handleCancel = vi.fn();

      render(
        <ConfirmationDialog
          open={true}
          onOpenChange={vi.fn()}
          title="Seal Ledger"
          description="Permanent action cannot be undone."
          digest="sha256-test-digest-001"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />,
      );

      const confirmBtn = screen.getByRole("button", {
        name: /Confirm Action/i,
      });
      const checkbox = screen.getByRole("checkbox");

      // Initially unchecked and disabled
      expect(checkbox).not.toBeChecked();
      expect(confirmBtn).toBeDisabled();

      // Stress: rapid clicks while unchecked must not trigger onConfirm
      for (let i = 0; i < 5; i++) {
        fireEvent.click(confirmBtn);
      }
      expect(handleConfirm).not.toHaveBeenCalled();

      // Check attestation
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      expect(confirmBtn).not.toBeDisabled();

      // Now click confirm
      fireEvent.click(confirmBtn);
      expect(handleConfirm).toHaveBeenCalledTimes(1);

      // Uncheck attestation -> button must be disabled again
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
      expect(confirmBtn).toBeDisabled();

      fireEvent.click(confirmBtn);
      expect(handleConfirm).toHaveBeenCalledTimes(1); // Still only 1
    });

    it("verify confirmation dialog resets attestation when closed and reopened", () => {
      const DialogHarness = () => {
        const [open, setOpen] = React.useState(true);
        return (
          <div>
            <button onClick={() => setOpen(true)}>Open Dialog</button>
            <ConfirmationDialog
              open={open}
              onOpenChange={setOpen}
              title="Audit Approval"
              description="Confirming audit status."
              onConfirm={vi.fn()}
            />
          </div>
        );
      };

      render(<DialogHarness />);
      const checkbox = screen.getByRole("checkbox");
      const confirmBtn = screen.getByRole("button", {
        name: /Confirm Action/i,
      });

      // Check checkbox -> confirm becomes enabled
      fireEvent.click(checkbox);
      expect(confirmBtn).not.toBeDisabled();

      // Cancel / close dialog
      const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
      fireEvent.click(cancelBtn);

      // Dialog is closed
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // Reopen dialog
      const openBtn = screen.getByText("Open Dialog");
      fireEvent.click(openBtn);

      // Verify attestation state has RESET to unchecked and confirm is DISABLED
      const reopenedCheckbox = screen.getByRole("checkbox");
      const reopenedConfirmBtn = screen.getByRole("button", {
        name: /Confirm Action/i,
      });

      expect(reopenedCheckbox).not.toBeChecked();
      expect(reopenedConfirmBtn).toBeDisabled();
    });

    it("verify loading state disables both Confirm and Cancel buttons and blocks actions", () => {
      const handleConfirm = vi.fn();
      const handleCancel = vi.fn();

      render(
        <ConfirmationDialog
          open={true}
          onOpenChange={vi.fn()}
          title="Sealing..."
          description="In progress"
          loading={true}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />,
      );

      const confirmBtn = screen.getByRole("button", {
        name: /Confirm Action/i,
      });
      const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
      const checkbox = screen.getByRole("checkbox");

      expect(confirmBtn).toBeDisabled();
      expect(confirmBtn).toHaveAttribute("aria-busy", "true");
      expect(cancelBtn).toBeDisabled();
      expect(checkbox).toBeDisabled();

      fireEvent.click(confirmBtn);
      fireEvent.click(cancelBtn);

      expect(handleConfirm).not.toHaveBeenCalled();
      expect(handleCancel).not.toHaveBeenCalled();
    });

    it("supports custom attestation text and destructive variant styling", () => {
      render(
        <ConfirmationDialog
          open={true}
          onOpenChange={vi.fn()}
          title="Revoke Approval"
          description="Revoking approval status."
          attestationText="Custom legal acknowledgment text"
          isDestructive={true}
          onConfirm={vi.fn()}
        />,
      );

      expect(
        screen.getByText("Custom legal acknowledgment text"),
      ).toBeInTheDocument();
      const confirmBtn = screen.getByRole("button", {
        name: /Confirm Action/i,
      });
      expect(confirmBtn).toHaveClass("bg-state-danger-icon");
    });
  });

  // =========================================================================
  // 3. Toast Error Persistence vs Auto-Dismiss Stress Tests
  // =========================================================================
  describe("Challenge 3: Toast Error Persistence", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("verify error/destructive toasts do NOT auto-dismiss after 4 seconds while info/success do", () => {
      const ToastTestApp = () => {
        const { toast } = useToast();
        return (
          <div>
            <button
              onClick={() =>
                toast({
                  title: "Info Notice",
                  description: "Sync scheduled",
                  variant: "info",
                })
              }
            >
              Trigger Info
            </button>
            <button
              onClick={() =>
                toast({
                  title: "Success Notice",
                  description: "Batch uploaded",
                  variant: "success",
                })
              }
            >
              Trigger Success
            </button>
            <button
              onClick={() =>
                toast({
                  title: "Critical Error",
                  description: "Quota breach detected",
                  variant: "destructive",
                  correlationId: "cor-crit-404",
                })
              }
            >
              Trigger Error
            </button>
          </div>
        );
      };

      render(
        <ToastProvider>
          <ToastTestApp />
        </ToastProvider>,
      );

      // Trigger all three toasts
      act(() => {
        fireEvent.click(screen.getByText("Trigger Info"));
        fireEvent.click(screen.getByText("Trigger Success"));
        fireEvent.click(screen.getByText("Trigger Error"));
      });

      // All 3 should be visible immediately
      expect(screen.getByText("Info Notice")).toBeInTheDocument();
      expect(screen.getByText("Success Notice")).toBeInTheDocument();
      expect(screen.getByText("Critical Error")).toBeInTheDocument();

      // Advance time by 3.9 seconds (before 4s dismissal threshold)
      act(() => {
        vi.advanceTimersByTime(3900);
      });
      expect(screen.getByText("Info Notice")).toBeInTheDocument();
      expect(screen.getByText("Success Notice")).toBeInTheDocument();
      expect(screen.getByText("Critical Error")).toBeInTheDocument();

      // Advance time past 4.0 seconds (e.g. +200ms -> total 4.1s)
      act(() => {
        vi.advanceTimersByTime(200);
      });

      // Info and Success MUST be auto-dismissed
      expect(screen.queryByText("Info Notice")).not.toBeInTheDocument();
      expect(screen.queryByText("Success Notice")).not.toBeInTheDocument();

      // Destructive/Error MUST STILL be in the document!
      expect(screen.getByText("Critical Error")).toBeInTheDocument();
      expect(screen.getByText(/cor-crit-404/)).toBeInTheDocument();

      // Stress: Advance time by 60 more seconds (total > 1 minute)
      act(() => {
        vi.advanceTimersByTime(60000);
      });

      // Destructive/Error MUST NEVER auto-dismiss
      expect(screen.getByText("Critical Error")).toBeInTheDocument();

      // Verify it can still be manually dismissed by clicking close (X) button
      const dismissButtons = screen.getAllByRole("button", {
        name: "Dismiss notification",
      });
      act(() => {
        fireEvent.click(dismissButtons[dismissButtons.length - 1]);
      });

      expect(screen.queryByText("Critical Error")).not.toBeInTheDocument();
    });

    it("verify error toast ignores explicit duration prop and persists", () => {
      const ToastExplicitDuration = () => {
        const { toast } = useToast();
        return (
          <button
            onClick={() =>
              toast({
                title: "Persistent Error With Duration",
                variant: "destructive",
                duration: 1000, // Short duration should be ignored for destructive
              })
            }
          >
            Trigger
          </button>
        );
      };

      render(
        <ToastProvider>
          <ToastExplicitDuration />
        </ToastProvider>,
      );

      act(() => {
        fireEvent.click(screen.getByText("Trigger"));
      });

      expect(
        screen.getByText("Persistent Error With Duration"),
      ).toBeInTheDocument();

      // Advance past the 1000ms duration
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Must still be present
      expect(
        screen.getByText("Persistent Error With Duration"),
      ).toBeInTheDocument();
    });

    it("copies correlation ID to clipboard when copy button clicked", async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      const ToastApp = () => {
        const { toast } = useToast();
        return (
          <button
            onClick={() =>
              toast({
                title: "Error 500",
                variant: "destructive",
                correlationId: "cor-copy-test-999",
              })
            }
          >
            Trigger
          </button>
        );
      };

      render(
        <ToastProvider>
          <ToastApp />
        </ToastProvider>,
      );

      act(() => {
        fireEvent.click(screen.getByText("Trigger"));
      });

      const copyBtn = screen.getByTitle("Copy Correlation ID");
      expect(copyBtn).toBeInTheDocument();

      act(() => {
        fireEvent.click(copyBtn);
      });

      expect(writeTextMock).toHaveBeenCalledWith("cor-copy-test-999");
      expect(screen.getByText("Copied")).toBeInTheDocument();

      // After 2 seconds, reverts to "Copy"
      act(() => {
        vi.advanceTimersByTime(2100);
      });
      expect(screen.getByText("Copy")).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 4. FileUpload Rejection & Validation Stress Tests
  // =========================================================================
  describe("Challenge 4: FileUpload Rejection", () => {
    it("verify dropzone properly rejects invalid file types and sizes", () => {
      const handleFileSelect = vi.fn();
      const handleFileRemove = vi.fn();

      render(
        <FileUpload
          accept=".csv,.xlsx"
          maxSizeBytes={2 * 1024 * 1024} // 2 MB limit
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
        />,
      );

      const dropzone = screen.getByLabelText("Upload file");

      // 1. Stress: Drop invalid file type (.pdf)
      const invalidTypeFile = new File(["dummy pdf content"], "records.pdf", {
        type: "application/pdf",
      });

      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [invalidTypeFile],
        },
      });

      expect(handleFileSelect).not.toHaveBeenCalled();
      expect(
        screen.getByText(/Invalid file format. Allowed formats: .csv,.xlsx/i),
      ).toBeInTheDocument();

      // 2. Stress: Drop file exceeding maximum size (3 MB > 2 MB limit)
      const oversizedContent = new Uint8Array(3 * 1024 * 1024);
      const oversizedFile = new File([oversizedContent], "large_batch.csv", {
        type: "text/csv",
      });

      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [oversizedFile],
        },
      });

      expect(handleFileSelect).not.toHaveBeenCalled();
      expect(
        screen.getByText(/exceeds maximum allowed size/i),
      ).toBeInTheDocument();

      // 3. Drop valid file (.csv, 1 MB <= 2 MB limit)
      const validContent = new Uint8Array(1 * 1024 * 1024);
      const validFile = new File([validContent], "valid_batch.csv", {
        type: "text/csv",
      });

      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [validFile],
        },
      });

      // Should succeed, invoke callback, clear previous error, and show selected file UI
      expect(handleFileSelect).toHaveBeenCalledTimes(1);
      expect(handleFileSelect).toHaveBeenCalledWith(validFile);
      expect(
        screen.queryByText(/exceeds maximum allowed size/i),
      ).not.toBeInTheDocument();
      expect(screen.getByText("valid_batch.csv")).toBeInTheDocument();

      // 4. Test file removal
      const removeBtn = screen.getByRole("button", {
        name: "Remove selected file",
      });
      fireEvent.click(removeBtn);

      expect(handleFileRemove).toHaveBeenCalledTimes(1);
      expect(screen.queryByText("valid_batch.csv")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Upload file")).toBeInTheDocument();
    });

    it("verify dropzone ignores drag and drop events when disabled or loading", () => {
      const handleFileSelect = vi.fn();
      const { rerender } = render(
        <FileUpload
          accept=".csv"
          disabled={true}
          onFileSelect={handleFileSelect}
        />,
      );

      const validFile = new File(["col1,col2\nval1,val2"], "data.csv", {
        type: "text/csv",
      });
      const dropzone = screen.getByLabelText("Upload file");

      // Attempt drop on disabled component
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [validFile],
        },
      });
      expect(handleFileSelect).not.toHaveBeenCalled();

      // Re-render with isLoading={true}
      rerender(
        <FileUpload
          accept=".csv"
          isLoading={true}
          onFileSelect={handleFileSelect}
        />,
      );

      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [validFile],
        },
      });
      expect(handleFileSelect).not.toHaveBeenCalled();
    });

    it("verify uppercase extensions matching accepted extensions are accepted", () => {
      const handleFileSelect = vi.fn();
      render(
        <FileUpload
          accept=".csv"
          maxSizeBytes={1024 * 1024}
          onFileSelect={handleFileSelect}
        />,
      );

      const dropzone = screen.getByLabelText("Upload file");
      const uppercaseFile = new File(["col1\na"], "TEST_DATA.CSV", {
        type: "text/csv",
      });

      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [uppercaseFile],
        },
      });

      expect(handleFileSelect).toHaveBeenCalledTimes(1);
      expect(screen.getByText("TEST_DATA.CSV")).toBeInTheDocument();
    });

    it("verify exact boundary file size is accepted while size+1 is rejected", () => {
      const handleFileSelect = vi.fn();
      const exactLimit = 1024 * 1024; // Exactly 1 MB
      const { rerender } = render(
        <FileUpload
          accept=".csv"
          maxSizeBytes={exactLimit}
          onFileSelect={handleFileSelect}
        />,
      );

      const dropzone = screen.getByLabelText("Upload file");

      // File of exact size limit
      const exactFile = new File([new Uint8Array(exactLimit)], "exact.csv", {
        type: "text/csv",
      });

      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [exactFile],
        },
      });

      expect(handleFileSelect).toHaveBeenCalledTimes(1);
      expect(screen.getByText("exact.csv")).toBeInTheDocument();

      // File 1 byte over limit
      rerender(
        <FileUpload
          accept=".csv"
          maxSizeBytes={exactLimit}
          onFileSelect={handleFileSelect}
        />,
      );

      const overBy1File = new File(
        [new Uint8Array(exactLimit + 1)],
        "over.csv",
        { type: "text/csv" },
      );

      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [overBy1File],
        },
      });

      expect(handleFileSelect).toHaveBeenCalledTimes(1); // Not called again
      expect(
        screen.getByText(/exceeds maximum allowed size/i),
      ).toBeInTheDocument();
    });

    it("verify files without extension are rejected when extension list is required", () => {
      const handleFileSelect = vi.fn();
      render(
        <FileUpload accept=".csv,.xlsx" onFileSelect={handleFileSelect} />,
      );

      const dropzone = screen.getByLabelText("Upload file");
      const noExtFile = new File(["some text"], "README", {
        type: "text/plain",
      });

      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [noExtFile],
        },
      });

      expect(handleFileSelect).not.toHaveBeenCalled();
      expect(screen.getByText(/Invalid file format/i)).toBeInTheDocument();
    });
  });
});
