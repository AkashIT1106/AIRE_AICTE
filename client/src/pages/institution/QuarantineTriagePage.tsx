import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Wrench,
  Check,
  FileText,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { SubmissionsApi, ApiException } from "@/lib/api";
import { SubmissionBatch, QuarantineRecord } from "@aire/api-contracts";
import { LoadingState } from "@/components/feedback/LoadingState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useAuth } from "@/context/AuthContext";

export const QuarantineTriagePage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const { activeInstitution } = useAuth();

  const [batch, setBatch] = useState<SubmissionBatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiException | null>(null);
  const [activeTab, setActiveTab] = useState<"quarantine" | "staged">(
    "quarantine",
  );

  // Remediation Modal State
  const [selectedQuarantineRow, setSelectedQuarantineRow] =
    useState<QuarantineRecord | null>(null);
  const [remediationStudentName, setRemediationStudentName] = useState("");
  const [remediationRollNumber, setRemediationRollNumber] = useState("");
  const [remediationCategory, setRemediationCategory] = useState("GEN");
  const [remediationDob, setRemediationDob] = useState("2005-01-01");
  const [isRemediating, setIsRemediating] = useState(false);
  const [remediationError, setRemediationError] = useState<string | null>(null);

  const institutionId = activeInstitution?.id;

  const fetchBatch = useCallback(async () => {
    if (!batchId || !institutionId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await SubmissionsApi.getBatch(institutionId, batchId);
      setBatch(data);
      // Auto-switch to staged tab if batch has no quarantine records
      if (data.quarantineCount === 0) {
        setActiveTab("staged");
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [batchId, institutionId]);

  useEffect(() => {
    fetchBatch();
  }, [fetchBatch]);

  if (!activeInstitution) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8">
        <Alert
          variant="warning"
          role="alert"
          className="border-amber-200 bg-amber-50 text-amber-900"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="font-semibold text-sm">
            Institutional Context Required
          </AlertTitle>
          <AlertDescription className="text-xs text-amber-800 leading-relaxed mt-1">
            Active institution context is required to inspect and remediate
            quarantined records. Please select your institution from the tenant
            switcher in the header.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
        institutionId!,
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
      <div className="space-y-4 max-w-4xl mx-auto py-8">
        <Link
          to="/institution"
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium"
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Breadcrumb */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link
                to="/institution"
                className="hover:text-slate-900 flex items-center gap-1 font-medium transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Submissions Ledger</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="font-mono text-slate-700 font-semibold">
                Batch {batch.id.slice(0, 8)}...
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {batch.programme}
              </h1>
              <Badge
                variant={isAllClean ? "success" : "warning"}
                size="default"
                className="font-semibold"
              >
                {isAllClean ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Ready for Sign-Off
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    {batch.quarantineCount} Quarantined
                  </>
                )}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              File: {batch.fileName} &bull; Cycle: {batch.academicYear} &bull;
              Ingested: {new Date(batch.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchBatch}
              className="gap-1.5 h-9 border-slate-200 text-slate-700 hover:bg-slate-50"
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
                className="h-9 gap-1.5 shadow-xs bg-[#245B75] hover:bg-[#1C4666] text-white font-semibold text-xs"
              >
                <Check className="h-4 w-4" />
                <span>Proceed to Sign-Off</span>
              </Button>
            )}
          </div>
        </div>

        {/* Metric Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Candidates
              </div>
              <div className="text-xl font-bold font-mono font-tabular text-slate-900 mt-0.5">
                {batch.totalCount}
              </div>
            </div>
            <Layers className="h-5 w-5 text-slate-400" />
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                Staged / Validated
              </div>
              <div className="text-xl font-bold font-mono font-tabular text-emerald-700 mt-0.5">
                {batch.validCount}
              </div>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                Quarantined Discrepancies
              </div>
              <div className="text-xl font-bold font-mono font-tabular text-amber-700 mt-0.5">
                {batch.quarantineCount}
              </div>
            </div>
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
        </div>
      </div>

      {/* 2. Status Banner Alert */}
      {isAllClean ? (
        <Alert
          variant="success"
          className="border-emerald-200 bg-emerald-50 text-emerald-950 shadow-2xs"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="font-semibold text-xs tracking-tight text-emerald-900">
            All Records Cleanly Validated &amp; Staged
          </AlertTitle>
          <AlertDescription className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
            All {batch.totalCount} student candidate records have passed AICTE
            schema validation. The cohort is ready for legal attestation and
            tamper sealing (Journey J-03).
          </AlertDescription>
        </Alert>
      ) : (
        <Alert
          variant="warning"
          className="border-amber-200 bg-amber-50 text-amber-950 shadow-2xs"
        >
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="font-semibold text-xs tracking-tight text-amber-900">
            Quarantine Triage Required ({batch.quarantineCount} Records
            Isolated)
          </AlertTitle>
          <AlertDescription className="text-xs text-amber-800 mt-0.5 leading-relaxed">
            The ingestion pipeline isolated defective rows below. Remediate
            field errors inline using the action buttons. Corrected rows will be
            re-validated and promoted into the staged ledger immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* 3. High-Density Tab Workbench */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 px-4 pt-2 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("quarantine")}
            className={`pb-2.5 px-2 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "quarantine"
                ? "border-[#245B75] text-[#245B75] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Quarantine Triage Workbench ({batch.quarantineCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("staged")}
            className={`pb-2.5 px-2 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "staged"
                ? "border-[#245B75] text-[#245B75] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="h-4 w-4 text-emerald-600" />
            <span>Staged Cohort Ledger ({batch.validCount})</span>
          </button>
        </div>

        {/* TAB A: Quarantine Triage Workbench */}
        {activeTab === "quarantine" && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Quarantine Discrepancy Resolution Table
                </h3>
                <p className="text-xs text-slate-500">
                  Isolate and remediate candidate row errors inline without
                  rejecting the overall batch.
                </p>
              </div>
            </div>

            {batch.quarantineRecords.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-900">
                  Zero Quarantined Records Remaining
                </p>
                <p className="mt-1">
                  All student records have been successfully remediated and
                  staged into the approved cohort.
                </p>
              </div>
            ) : (
              <div className="ux4g-o-x-auto rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
                <table className="ux4g-table w-full text-left border-collapse table-compact font-sans">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <th className="px-3.5 py-2.5 w-12 text-center">Row</th>
                      <th className="px-3.5 py-2.5">Roll No</th>
                      <th className="px-3.5 py-2.5">Candidate Name</th>
                      <th className="px-3.5 py-2.5">Field in Error</th>
                      <th className="px-3.5 py-2.5">Received Value</th>
                      <th className="px-3.5 py-2.5">
                        Validation Rule &amp; Reason
                      </th>
                      <th className="px-3.5 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                    {batch.quarantineRecords.map((row) => {
                      const firstError = row.errors[0];
                      return (
                        <tr
                          key={row.rowId}
                          className="hover:bg-slate-50/70 transition-colors h-[44px]"
                        >
                          <td className="px-3.5 py-2 text-center font-mono text-slate-400">
                            {row.rowNumber}
                          </td>
                          <td className="px-3.5 py-2 font-mono font-medium text-slate-900">
                            {String(row.rawData.rollNumber || "-")}
                          </td>
                          <td className="px-3.5 py-2 font-medium">
                            {String(row.rawData.studentName || "-")}
                          </td>
                          <td className="px-3.5 py-2">
                            <span className="font-mono text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              {firstError?.field || "record"}
                            </span>
                          </td>
                          <td className="px-3.5 py-2 font-mono text-slate-900 bg-slate-100/60 rounded px-2">
                            {String(firstError?.received ?? "-")}
                          </td>
                          <td className="px-3.5 py-2 text-amber-800 text-[11px] leading-tight max-w-xs font-medium">
                            {firstError?.message}
                          </td>
                          <td className="px-3.5 py-2 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openRemediationModal(row)}
                              className="h-8 text-xs border-amber-300 bg-amber-50/50 text-amber-800 hover:bg-amber-100 gap-1.5 font-semibold"
                            >
                              <Wrench className="h-3.5 w-3.5 text-amber-700" />
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
          </div>
        )}

        {/* TAB B: Staged Valid Cohort Ledger */}
        {activeTab === "staged" && (
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Staged Valid Admissions ({batch.validCount} Records)
              </h3>
              <p className="text-xs text-slate-500">
                Admissions verified against schema rules and staged for legal
                certification.
              </p>
            </div>

            {batch.stagedRecords.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p>
                  No records staged yet. Remediate quarantined rows to populate
                  ledger.
                </p>
              </div>
            ) : (
              <div className="ux4g-o-x-auto rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
                <table className="ux4g-table w-full text-left border-collapse table-compact font-sans">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <th className="px-3.5 py-2.5 w-12 text-center">Row</th>
                      <th className="px-3.5 py-2.5">Roll No</th>
                      <th className="px-3.5 py-2.5">Candidate Name</th>
                      <th className="px-3.5 py-2.5">DOB</th>
                      <th className="px-3.5 py-2.5">Category</th>
                      <th className="px-3.5 py-2.5">Quota</th>
                      <th className="px-3.5 py-2.5">APAAR ID</th>
                      <th className="px-3.5 py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                    {batch.stagedRecords.map((staged) => (
                      <tr
                        key={staged.rowId}
                        className="hover:bg-slate-50/70 transition-colors h-[40px]"
                      >
                        <td className="px-3.5 py-2 text-center font-mono text-slate-400">
                          {staged.rowNumber}
                        </td>
                        <td className="px-3.5 py-2 font-mono font-medium text-slate-900">
                          {staged.data.rollNumber}
                        </td>
                        <td className="px-3.5 py-2 font-medium">
                          {staged.data.studentName}
                        </td>
                        <td className="px-3.5 py-2 font-mono text-slate-600">
                          {staged.data.dateOfBirth}
                        </td>
                        <td className="px-3.5 py-2">
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium">
                            {staged.data.category}
                          </span>
                        </td>
                        <td className="px-3.5 py-2 text-slate-600">
                          {staged.data.quota}
                        </td>
                        <td className="px-3.5 py-2 font-mono text-slate-500 font-tabular text-[11px]">
                          {staged.data.apaarId || "••••-••••-8821"}
                        </td>
                        <td className="px-3.5 py-2 text-right">
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
          </div>
        )}
      </div>

      {/* Inline Remediation Dialog (J-02 Step 5) */}
      <Dialog
        open={Boolean(selectedQuarantineRow)}
        onOpenChange={(open) => {
          if (!open) setSelectedQuarantineRow(null);
        }}
      >
        <DialogContent className="max-w-md bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Remediate Quarantined Record
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              Row #{selectedQuarantineRow?.rowNumber} &bull; Edit candidate data
              to satisfy AICTE validation rules.
            </DialogDescription>
          </DialogHeader>

          {remediationError && (
            <Alert
              variant="destructive"
              className="border-rose-200 bg-rose-50 text-rose-900 mt-2"
            >
              <AlertDescription className="text-xs">
                {remediationError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRemediateSubmit} className="space-y-4 mt-3">
            <FormField id="rem-name" label="Candidate Name" required>
              <Input
                id="rem-name"
                value={remediationStudentName}
                onChange={(e) => setRemediationStudentName(e.target.value)}
                className="h-9 text-xs border-slate-200"
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
                className="h-9 text-xs border-slate-200 font-mono"
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
                <SelectTrigger
                  id="rem-category"
                  className="h-9 text-xs border-slate-200"
                >
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
                className="h-9 text-xs border-slate-200 font-mono"
              />
            </FormField>

            <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedQuarantineRow(null)}
                className="h-9 text-xs border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isRemediating}
                className="h-9 text-xs font-semibold gap-1.5 bg-[#245B75] hover:bg-[#1C4666] text-white"
              >
                <Check className="h-4 w-4" />
                <span>Save &amp; Re-validate</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
