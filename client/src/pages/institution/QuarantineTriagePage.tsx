import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Wrench,
  Check,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/forms/FormField";
import { LoadingState } from "@/components/feedback/LoadingState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { SubmissionsApi, ApiException } from "@/lib/api";
import { SubmissionBatch, QuarantineRecord } from "@aire/api-contracts";
import { useAuth } from "@/context/AuthContext";
import { DEMO_INSTITUTION_ID } from "./InstitutionDashboard";

export const QuarantineTriagePage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const { activeInstitution } = useAuth();
  const effectiveInstitutionId = activeInstitution?.id || DEMO_INSTITUTION_ID;

  const [batch, setBatch] = useState<SubmissionBatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiException | null>(null);
  const [activeTab, setActiveTab] = useState<"quarantine" | "staged">(
    "quarantine",
  );

  // Remediation Modal State
  const [selectedQuarantineRow, setSelectedQuarantineRow] =
    useState<QuarantineRecord | null>(null);
  const [remediationCategory, setRemediationCategory] = useState("OBC-NCL");
  const [remediationDob, setRemediationDob] = useState("");
  const [remediationStudentName, setRemediationStudentName] = useState("");
  const [remediationRollNumber, setRemediationRollNumber] = useState("");
  const [isRemediating, setIsRemediating] = useState(false);
  const [remediationError, setRemediationError] = useState<string | null>(null);

  const fetchBatch = async () => {
    if (!batchId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await SubmissionsApi.getBatch(
        effectiveInstitutionId,
        batchId,
      );
      setBatch(data);
      if (data.quarantineCount === 0) {
        setActiveTab("staged");
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch();
  }, [batchId]);

  const openRemediationModal = (row: QuarantineRecord) => {
    setSelectedQuarantineRow(row);
    setRemediationError(null);
    setRemediationStudentName(String(row.rawData.studentName || ""));
    setRemediationRollNumber(String(row.rawData.rollNumber || ""));

    // If DOB was defective (e.g. 15/05/2005), format as YYYY-MM-DD
    const rawDob = String(row.rawData.dateOfBirth || "");
    if (rawDob.includes("/")) {
      const parts = rawDob.split("/");
      if (parts.length === 3) {
        setRemediationDob(
          `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`,
        );
      } else {
        setRemediationDob("2005-05-15");
      }
    } else {
      setRemediationDob(rawDob || "2005-01-01");
    }

    // Default category fallback to valid code
    const rawCat = String(row.rawData.category || "");
    if (rawCat.startsWith("OBC")) {
      setRemediationCategory("OBC-NCL");
    } else if (rawCat.startsWith("SC")) {
      setRemediationCategory("SC");
    } else if (rawCat.startsWith("ST")) {
      setRemediationCategory("ST");
    } else if (rawCat.startsWith("EWS")) {
      setRemediationCategory("EWS");
    } else {
      setRemediationCategory("GEN");
    }
  };

  const handleRemediateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId || !selectedQuarantineRow) return;

    setIsRemediating(true);
    setRemediationError(null);

    try {
      const updatedBatch = await SubmissionsApi.remediateRow(
        effectiveInstitutionId,
        batchId,
        selectedQuarantineRow.rowId,
        {
          studentName: remediationStudentName,
          rollNumber: remediationRollNumber,
          category: remediationCategory as any,
          dateOfBirth: remediationDob,
        },
      );

      setBatch(updatedBatch);
      setSelectedQuarantineRow(null);

      // If all quarantined rows resolved, switch to staged tab
      if (updatedBatch.quarantineCount === 0) {
        setActiveTab("staged");
      }
    } catch (err: any) {
      if (err instanceof ApiException) {
        setRemediationError(`${err.message} (${err.code})`);
      } else {
        setRemediationError(err.message || "Remediation failed");
      }
    } finally {
      setIsRemediating(false);
    }
  };

  if (loading) {
    return (
      <LoadingState label="Loading batch details and quarantine triage..." />
    );
  }

  if (error || !batch) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Link
          to="/institution"
          className="text-xs text-[var(--text-muted)] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Submissions</span>
        </Link>
        <ErrorState
          title="Batch Not Found"
          message={error?.message || "Failed to load submission batch"}
          correlationId={error?.correlationId}
          onRetry={fetchBatch}
        />
      </div>
    );
  }

  const isAllClean = batch.quarantineCount === 0;

  return (
    <div className="space-y-6">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-default)]">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)]">
            <Link
              to="/institution"
              className="hover:text-[var(--text-primary)] flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Submissions Ledger</span>
            </Link>
            <span>/</span>
            <span className="font-mono text-[var(--text-primary)] font-medium">
              Batch {batch.id.slice(0, 8)}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {batch.programme}
            </h1>
            <Badge
              variant={isAllClean ? "success" : "warning"}
              size="default"
              className="font-medium"
            >
              {isAllClean ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[var(--state-success-icon)]" />
                  Ready for Sign-Off
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 text-[var(--state-warning-icon)]" />
                  {batch.quarantineCount} Quarantined
                </>
              )}
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
            File: {batch.fileName} &bull; Cycle: {batch.academicYear} &bull;
            Ingested: {new Date(batch.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBatch}
            className="gap-1.5 h-9"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Status</span>
          </Button>

          {isAllClean && (
            <Button
              variant="default"
              size="sm"
              onClick={() =>
                alert(
                  "Cohort ready for legal certification by Institution Admin (J-03).",
                )
              }
              className="h-9 gap-1.5 shadow-sm"
            >
              <Check className="h-4 w-4" />
              <span>Proceed to Sign-Off</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Status Banner Alert */}
      {isAllClean ? (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>All Records Cleanly Validated & Staged</AlertTitle>
          <AlertDescription>
            All {batch.totalCount} student candidate records have passed AICTE
            schema validation. The cohort is ready for legal attestation and
            tamper sealing (Journey J-03).
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            Quarantine Triage Required ({batch.quarantineCount} Records
            Isolated)
          </AlertTitle>
          <AlertDescription>
            The ingestion pipeline isolated defective rows below. Remediate
            field errors inline using the action buttons. Corrected rows will be
            re-validated and promoted into the staged ledger immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* 3. Metric Split */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[var(--surface-card)]">
          <div className="text-xs font-semibold text-[var(--text-muted)]">
            Total Records
          </div>
          <div className="text-2xl font-bold font-mono font-tabular text-[var(--text-primary)] mt-1">
            {batch.totalCount}
          </div>
        </Card>

        <Card className="p-4 border-[var(--state-success-border)] bg-[var(--state-success-bg)]/30">
          <div className="text-xs font-semibold text-[var(--state-success-text)] flex items-center justify-between">
            <span>Staged / Validated</span>
            <CheckCircle2 className="h-4 w-4 text-[var(--state-success-icon)]" />
          </div>
          <div className="text-2xl font-bold font-mono font-tabular text-[var(--state-success-text)] mt-1">
            {batch.validCount}
          </div>
        </Card>

        <Card className="p-4 border-[var(--state-warning-border)] bg-[var(--state-warning-bg)]/40">
          <div className="text-xs font-semibold text-[var(--state-warning-text)] flex items-center justify-between">
            <span>Quarantined</span>
            <AlertTriangle className="h-4 w-4 text-[var(--state-warning-icon)]" />
          </div>
          <div className="text-2xl font-bold font-mono font-tabular text-[var(--state-warning-text)] mt-1">
            {batch.quarantineCount}
          </div>
        </Card>
      </div>

      {/* 4. Tab Switcher */}
      <div className="flex border-b border-[var(--border-default)] space-x-6 text-sm font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("quarantine")}
          className={`pb-2 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "quarantine"
              ? "border-[var(--brand-primary)] text-[var(--brand-primary)] font-semibold"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <AlertTriangle className="h-4 w-4 text-[var(--state-warning-icon)]" />
          <span>Quarantine Triage Workbench ({batch.quarantineCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("staged")}
          className={`pb-2 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "staged"
              ? "border-[var(--brand-primary)] text-[var(--brand-primary)] font-semibold"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <FileText className="h-4 w-4 text-[var(--state-success-icon)]" />
          <span>Staged Cohort Ledger ({batch.validCount})</span>
        </button>
      </div>

      {/* 5. TAB A: Quarantine Triage Workbench */}
      {activeTab === "quarantine" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quarantine Triage Workbench</CardTitle>
            <CardDescription>
              Isolate and remediate candidate row errors inline without
              rejecting the overall batch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {batch.quarantineRecords.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--surface-card-subdued)] rounded border border-dashed border-[var(--border-default)]">
                <CheckCircle2 className="h-8 w-8 text-[var(--state-success-icon)] mx-auto mb-2" />
                <p className="font-semibold text-sm text-[var(--text-primary)]">
                  Zero Quarantined Records Remaining
                </p>
                <p className="mt-1">
                  All student records have been successfully remediated and
                  staged.
                </p>
              </div>
            ) : (
              <div className="rounded border border-[var(--border-default)] overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse table-compact font-sans">
                  <thead>
                    <tr className="border-b border-[var(--border-default)] bg-[var(--surface-card-subdued)] text-xs font-semibold text-[var(--text-secondary)]">
                      <th className="px-3 py-2 w-12 text-center">Row</th>
                      <th className="px-3 py-2">Roll No</th>
                      <th className="px-3 py-2">Candidate Name</th>
                      <th className="px-3 py-2">Field in Error</th>
                      <th className="px-3 py-2">Received Value</th>
                      <th className="px-3 py-2">Validation Rule & Reason</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
                    {batch.quarantineRecords.map((row) => {
                      const firstError = row.errors[0];
                      return (
                        <tr
                          key={row.rowId}
                          className="hover:bg-[var(--surface-card-subdued)] transition-colors"
                        >
                          <td className="px-3 py-2 text-center font-mono text-[var(--text-muted)]">
                            {row.rowNumber}
                          </td>
                          <td className="px-3 py-2 font-mono font-medium">
                            {String(row.rawData.rollNumber || "-")}
                          </td>
                          <td className="px-3 py-2 font-medium">
                            {String(row.rawData.studentName || "-")}
                          </td>
                          <td className="px-3 py-2">
                            <span className="font-mono text-xs font-semibold text-[var(--state-danger-text)] bg-[var(--state-danger-bg)] px-1.5 py-0.5 rounded border border-[var(--state-danger-border)]">
                              {firstError?.field || "record"}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-mono text-[var(--text-primary)] bg-[var(--surface-card-subdued)] rounded">
                            {String(firstError?.received ?? "-")}
                          </td>
                          <td className="px-3 py-2 text-[var(--state-warning-text)] text-[11px] leading-tight max-w-xs">
                            {firstError?.message}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openRemediationModal(row)}
                              className="h-7 text-xs border-[var(--state-warning-border)] text-[var(--state-warning-text)] hover:bg-[var(--state-warning-bg)] gap-1"
                            >
                              <Wrench className="h-3 w-3" />
                              <span>Remediate</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 6. TAB B: Staged Valid Cohort Ledger */}
      {activeTab === "staged" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>
              Staged Valid Admissions ({batch.validCount} Records)
            </CardTitle>
            <CardDescription>
              Admissions verified against schema rules and staged for legal
              certification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {batch.stagedRecords.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--surface-card-subdued)] rounded border border-dashed border-[var(--border-default)]">
                <p>
                  No records staged yet. Remediate quarantined rows to populate
                  ledger.
                </p>
              </div>
            ) : (
              <div className="rounded border border-[var(--border-default)] overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse table-compact font-sans">
                  <thead>
                    <tr className="border-b border-[var(--border-default)] bg-[var(--surface-card-subdued)] text-xs font-semibold text-[var(--text-secondary)]">
                      <th className="px-3 py-2 w-12 text-center">#</th>
                      <th className="px-3 py-2">Roll Number</th>
                      <th className="px-3 py-2">Candidate Name</th>
                      <th className="px-3 py-2">DOB</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Quota Category</th>
                      <th className="px-3 py-2">APAAR ID (Masked)</th>
                      <th className="px-3 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
                    {batch.stagedRecords.map((staged, i) => (
                      <tr
                        key={staged.rowId}
                        className="hover:bg-[var(--surface-card-subdued)] transition-colors"
                      >
                        <td className="px-3 py-2 text-center font-mono text-[var(--text-muted)]">
                          {i + 1}
                        </td>
                        <td className="px-3 py-2 font-mono font-medium font-tabular">
                          {staged.data.rollNumber}
                        </td>
                        <td className="px-3 py-2 font-medium">
                          {staged.data.studentName}
                        </td>
                        <td className="px-3 py-2 font-mono font-tabular">
                          {staged.data.dateOfBirth}
                        </td>
                        <td className="px-3 py-2">
                          <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--surface-card-subdued)] border border-[var(--border-default)] text-[var(--text-primary)]">
                            {staged.data.category}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-[var(--text-secondary)]">
                          {staged.data.quota}
                        </td>
                        <td className="px-3 py-2 font-mono text-[var(--text-muted)] font-tabular">
                          {staged.data.apaarId || "••••-••••-8821"}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Badge variant="success" size="sm">
                            Accepted
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 7. Inline Remediation Dialog (J-02 Step 5) */}
      <Dialog
        open={Boolean(selectedQuarantineRow)}
        onOpenChange={(open) => {
          if (!open) setSelectedQuarantineRow(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remediate Quarantined Record</DialogTitle>
            <DialogDescription>
              Row #{selectedQuarantineRow?.rowNumber} &bull; Edit candidate data
              to satisfy AICTE validation rules.
            </DialogDescription>
          </DialogHeader>

          {remediationError && (
            <Alert variant="destructive">
              <AlertDescription>{remediationError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRemediateSubmit} className="space-y-4">
            <FormField id="rem-name" label="Candidate Name" required>
              <Input
                id="rem-name"
                value={remediationStudentName}
                onChange={(e) => setRemediationStudentName(e.target.value)}
              />
            </FormField>

            <FormField
              id="rem-roll"
              label="Roll Number / Application ID"
              required
            >
              <Input
                id="rem-roll"
                value={remediationRollNumber}
                onChange={(e) => setRemediationRollNumber(e.target.value)}
              />
            </FormField>

            <FormField
              id="rem-category"
              label="Reservation Category"
              required
              helperText="Select canonical AICTE reservation category"
            >
              <Select
                value={remediationCategory}
                onValueChange={setRemediationCategory}
              >
                <SelectTrigger id="rem-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GEN">
                    GEN — General / Unreserved
                  </SelectItem>
                  <SelectItem value="OBC-NCL">
                    OBC-NCL — Other Backward Classes (Non-Creamy)
                  </SelectItem>
                  <SelectItem value="SC">SC — Scheduled Caste</SelectItem>
                  <SelectItem value="ST">ST — Scheduled Tribe</SelectItem>
                  <SelectItem value="EWS">
                    EWS — Economically Weaker Section
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              id="rem-dob"
              label="Date of Birth (YYYY-MM-DD)"
              required
              helperText="Must be format YYYY-MM-DD (e.g. 2005-08-25)"
            >
              <Input
                id="rem-dob"
                value={remediationDob}
                onChange={(e) => setRemediationDob(e.target.value)}
                placeholder="2005-08-25"
              />
            </FormField>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedQuarantineRow(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                loading={isRemediating}
                className="gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>Save & Re-validate</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
