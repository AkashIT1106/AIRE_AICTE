import React, { useState, useMemo } from "react";
import {
  Search,
  Wrench,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuarantineRecord } from "@aire/api-contracts";
import { QuarantineRemediation } from "@aire/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MOCK_QUARANTINE_RECORDS } from "./mockData";

export interface QuarantineTriageTableProps {
  records?: QuarantineRecord[];
  onRemediateRow?: (
    rowId: string,
    remediation: QuarantineRemediation,
  ) => Promise<void> | void;
  onDiscardRow?: (rowId: string) => Promise<void> | void;
  batchId?: string;
  density?: "compact" | "standard";
  className?: string;
}

export const QuarantineTriageTable: React.FC<QuarantineTriageTableProps> = ({
  records = MOCK_QUARANTINE_RECORDS,
  onRemediateRow,
  onDiscardRow,
  batchId = "BATCH-2026-CSE-001",
  density = "standard",
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fieldFilter, setFieldFilter] = useState("ALL");

  // Remediation Modal State
  const [activeRemediationRecord, setActiveRemediationRecord] =
    useState<QuarantineRecord | null>(null);
  const [remStudentName, setRemStudentName] = useState("");
  const [remRollNumber, setRemRollNumber] = useState("");
  const [remDob, setRemDob] = useState("");
  const [remCategory, setRemCategory] = useState<
    "GEN" | "OBC-NCL" | "SC" | "ST" | "EWS"
  >("GEN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const q = searchQuery.toLowerCase();
      const sName = String(rec.rawData?.studentName || "").toLowerCase();
      const rNum = String(rec.rawData?.rollNumber || "").toLowerCase();
      const matchSearch =
        !q ||
        sName.includes(q) ||
        rNum.includes(q) ||
        String(rec.rowNumber).includes(q);

      if (!matchSearch) return false;
      if (fieldFilter === "ALL") return true;

      return rec.errors.some(
        (err) => err.field.toLowerCase() === fieldFilter.toLowerCase(),
      );
    });
  }, [records, searchQuery, fieldFilter]);

  const openRemediateModal = (rec: QuarantineRecord) => {
    setActiveRemediationRecord(rec);
    setModalError(null);
    setRemStudentName(String(rec.rawData?.studentName || ""));
    setRemRollNumber(String(rec.rawData?.rollNumber || ""));

    // Normalize DOB if defective
    const rawDob = String(rec.rawData?.dateOfBirth || "");
    if (rawDob.includes("/")) {
      const parts = rawDob.split("/");
      if (parts.length === 3) {
        setRemDob(
          `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`,
        );
      } else {
        setRemDob("2005-01-01");
      }
    } else {
      setRemDob(rawDob || "2005-01-01");
    }

    // Fallback category
    const rawCat = String(rec.rawData?.category || "");
    if (rawCat.startsWith("OBC")) setRemCategory("OBC-NCL");
    else if (rawCat.startsWith("SC")) setRemCategory("SC");
    else if (rawCat.startsWith("ST")) setRemCategory("ST");
    else if (rawCat.startsWith("EWS")) setRemCategory("EWS");
    else setRemCategory("GEN");
  };

  const handleRemediateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRemediationRecord) return;

    if (!remDob.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setModalError("Date of Birth must be in YYYY-MM-DD format.");
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const remediationData: QuarantineRemediation = {
        studentName: remStudentName,
        rollNumber: remRollNumber,
        dateOfBirth: remDob,
        category: remCategory,
      };

      await onRemediateRow?.(activeRemediationRecord.rowId, remediationData);
      setActiveRemediationRecord(null);
    } catch (err: any) {
      setModalError(err.message || "Failed to remediate row.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      className={cn("w-full border-line-default shadow-sm", className)}
      data-testid="quarantine-triage-table"
    >
      <CardHeader className="border-b border-line-subtle bg-surface-card pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="text-[11px] font-semibold">
                S-12 TRIAGE WORKBENCH
              </Badge>
              <span className="text-xs text-txt-muted font-mono">
                {batchId}
              </span>
            </div>
            <CardTitle className="text-lg font-bold text-txt-primary flex items-center gap-2">
              <AlertTriangle
                className="h-5 w-5 text-state-warning-icon"
                aria-hidden="true"
              />
              <span>Quarantined Records Triage ({records.length})</span>
            </CardTitle>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search
                className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-txt-muted"
                aria-hidden="true"
              />
              <Input
                type="text"
                placeholder="Search candidate or roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs border-line-default bg-surface-card"
                aria-label="Search quarantined records"
              />
            </div>

            <Select value={fieldFilter} onValueChange={setFieldFilter}>
              <SelectTrigger className="h-8 text-xs w-full sm:w-36 border-line-default bg-surface-card">
                <SelectValue placeholder="Filter field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">
                  All Fields
                </SelectItem>
                <SelectItem value="category" className="text-xs">
                  Category Codes
                </SelectItem>
                <SelectItem value="dateOfBirth" className="text-xs">
                  Date of Birth
                </SelectItem>
                <SelectItem value="apaarId" className="text-xs">
                  APAAR ID
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          className="overflow-x-auto"
          tabIndex={0}
          aria-label="Quarantined candidate records table"
        >
          <Table density={density}>
            <TableHeader className="bg-surface-card-subdued">
              <TableRow>
                <TableHead className="w-16 font-mono text-center">
                  Row
                </TableHead>
                <TableHead>Candidate Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Identified Violation</TableHead>
                <TableHead>Defective Input</TableHead>
                <TableHead className="text-right w-44">Triage Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-txt-muted"
                  >
                    <CheckCircle2
                      className="h-8 w-8 text-state-success-icon mx-auto mb-2"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-semibold text-txt-primary">
                      No Quarantined Records Found
                    </p>
                    <p className="text-xs text-txt-secondary mt-0.5">
                      All records in this batch are valid or match query
                      criteria.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((rec) => {
                  const sName = String(rec.rawData?.studentName || "Unknown");
                  const rNum = String(rec.rawData?.rollNumber || "N/A");
                  const primaryError = rec.errors[0];

                  return (
                    <TableRow
                      key={rec.rowId}
                      className="hover:bg-surface-card-subdued/80"
                    >
                      <TableCell className="font-mono font-bold text-center text-xs text-txt-muted">
                        #{rec.rowNumber}
                      </TableCell>
                      <TableCell className="font-semibold text-txt-primary text-xs">
                        {sName}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-txt-secondary">
                        {rNum}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-state-danger-text bg-state-danger-bg px-2 py-0.5 rounded border border-state-danger-border">
                          <AlertTriangle
                            className="h-3 w-3 shrink-0"
                            aria-hidden="true"
                          />
                          <span>
                            {primaryError?.message || "Schema violation"}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-state-danger-text font-bold">
                        {String(primaryError?.received ?? "Invalid")}
                      </TableCell>
                      <TableCell className="text-right space-x-1.5">
                        {onDiscardRow && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onDiscardRow(rec.rowId)}
                            className="h-7 text-xs text-txt-muted hover:text-state-danger-text hover:bg-state-danger-bg px-2"
                            aria-label={`Discard row #${rec.rowNumber}`}
                          >
                            <Trash2
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => openRemediateModal(rec)}
                          className="h-7 text-xs bg-brand-primary hover:bg-brand-primary-hover text-txt-inverted px-2.5 font-semibold gap-1"
                          aria-label={`Remediate row #${rec.rowNumber}`}
                        >
                          <Wrench className="h-3 w-3" aria-hidden="true" />
                          <span>Remediate</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Inline Remediation Dialog */}
      <Dialog
        open={Boolean(activeRemediationRecord)}
        onOpenChange={(open) => !open && setActiveRemediationRecord(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-txt-primary flex items-center gap-2">
              <Wrench
                className="h-4 w-4 text-brand-primary"
                aria-hidden="true"
              />
              <span>
                Remediate Quarantined Record #
                {activeRemediationRecord?.rowNumber}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-txt-secondary">
              Correct candidate information to satisfy statutory quota criteria
              and promote to accepted status.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRemediateSubmit} className="space-y-4 py-2">
            {modalError && (
              <div
                role="alert"
                className="p-2.5 rounded border border-state-danger-border bg-state-danger-bg text-xs text-state-danger-text"
              >
                {modalError}
              </div>
            )}

            <div className="space-y-1">
              <Label
                htmlFor="rem-name"
                className="text-xs font-semibold text-txt-primary"
              >
                Candidate Full Name
              </Label>
              <Input
                id="rem-name"
                type="text"
                value={remStudentName}
                onChange={(e) => setRemStudentName(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="rem-roll"
                className="text-xs font-semibold text-txt-primary"
              >
                Roll Number / Application ID
              </Label>
              <Input
                id="rem-roll"
                type="text"
                value={remRollNumber}
                onChange={(e) => setRemRollNumber(e.target.value)}
                className="h-9 text-xs font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label
                  htmlFor="rem-dob"
                  className="text-xs font-semibold text-txt-primary"
                >
                  Date of Birth (YYYY-MM-DD)
                </Label>
                <Input
                  id="rem-dob"
                  type="date"
                  value={remDob}
                  onChange={(e) => setRemDob(e.target.value)}
                  className="h-9 text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="rem-category"
                  className="text-xs font-semibold text-txt-primary"
                >
                  Statutory Category
                </Label>
                <Select
                  value={remCategory}
                  onValueChange={(val) => setRemCategory(val as any)}
                >
                  <SelectTrigger id="rem-category" className="h-9 text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GEN" className="text-xs">
                      GEN
                    </SelectItem>
                    <SelectItem value="OBC-NCL" className="text-xs">
                      OBC-NCL
                    </SelectItem>
                    <SelectItem value="SC" className="text-xs">
                      SC
                    </SelectItem>
                    <SelectItem value="ST" className="text-xs">
                      ST
                    </SelectItem>
                    <SelectItem value="EWS" className="text-xs">
                      EWS
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveRemediationRecord(null)}
                disabled={isSubmitting}
                className="text-xs h-9 border-line-default"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                loading={isSubmitting}
                className="text-xs h-9 bg-brand-primary hover:bg-brand-primary-hover text-txt-inverted font-semibold"
              >
                <span>Save &amp; Promote to Staged</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

QuarantineTriageTable.displayName = "QuarantineTriageTable";
