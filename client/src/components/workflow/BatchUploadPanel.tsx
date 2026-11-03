import React, { useState } from "react";
import {
  Download,
  Sparkles,
  UploadCloud,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { AdmissionBatchInput } from "@aire/validation";
import { DEMO_SAMPLE_RECORDS, SAMPLE_CSV_TEMPLATE } from "./mockData";

export interface BatchUploadPanelProps {
  academicYear?: string;
  onAcademicYearChange?: (year: string) => void;
  programme?: string;
  onProgrammeChange?: (programme: string) => void;
  onUpload?: (data: AdmissionBatchInput) => void;
  onDownloadTemplate?: () => void;
  onLoadSample?: () => void;
  isUploading?: boolean;
  error?: string | null;
  institutionCode?: string;
  className?: string;
}

const DEFAULT_ACADEMIC_YEARS = ["2026-27", "2025-26", "2024-25"];
const DEFAULT_PROGRAMMES = [
  "B.Tech Computer Science and Engineering",
  "B.Tech Information Technology",
  "B.Tech Electronics & Communication",
  "B.Tech Mechanical Engineering",
  "Master of Business Administration (MBA)",
  "Master of Computer Applications (MCA)",
];

export const BatchUploadPanel: React.FC<BatchUploadPanelProps> = ({
  academicYear: controlledYear,
  onAcademicYearChange,
  programme: controlledProgramme,
  onProgrammeChange,
  onUpload,
  onDownloadTemplate,
  onLoadSample,
  isUploading = false,
  error: externalError,
  institutionCode = "INST-101",
  className,
}) => {
  const [internalYear, setInternalYear] = useState("2026-27");
  const [internalProgramme, setInternalProgramme] = useState(
    "B.Tech Computer Science and Engineering",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<Record<string, unknown>[]>([]);
  const [internalError, setInternalError] = useState<string | null>(null);

  const academicYear =
    controlledYear !== undefined ? controlledYear : internalYear;
  const programme =
    controlledProgramme !== undefined ? controlledProgramme : internalProgramme;
  const displayError =
    externalError !== undefined ? externalError : internalError;

  const handleYearChange = (year: string) => {
    setInternalYear(year);
    onAcademicYearChange?.(year);
  };

  const handleProgrammeChange = (prog: string) => {
    setInternalProgramme(prog);
    onProgrammeChange?.(prog);
  };

  const parseCsvText = (text: string) => {
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length <= 1) {
      setInternalError("Uploaded CSV contains no candidate record rows.");
      setParsedRows([]);
      return;
    }

    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const row: Record<string, unknown> = {};
      headers.forEach((h, i) => {
        row[h] = values[i] || "";
      });
      return row;
    });

    setParsedRows(rows);
    setInternalError(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setInternalError(null);

    // Read and pre-parse
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        parseCsvText(content);
      }
    };
    reader.onerror = () => {
      setInternalError("Failed to read the selected file.");
    };
    reader.readAsText(file);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setParsedRows([]);
    setInternalError(null);
  };

  const handleDefaultDownloadTemplate = () => {
    if (onDownloadTemplate) {
      onDownloadTemplate();
      return;
    }
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "aicte_admissions_template_2026_27.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDefaultLoadSample = () => {
    if (onLoadSample) {
      onLoadSample();
      return;
    }
    const dummyFile = new File(
      [SAMPLE_CSV_TEMPLATE],
      "sample_btech_admissions_triage.csv",
      { type: "text/csv" },
    );
    setSelectedFile(dummyFile);
    setParsedRows(DEMO_SAMPLE_RECORDS as unknown as Record<string, unknown>[]);
    setInternalError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && parsedRows.length === 0) {
      setInternalError(
        "Please select or drop an admission spreadsheet to upload.",
      );
      return;
    }

    if (parsedRows.length === 0) {
      setInternalError(
        "No candidate records found in file. Please verify CSV content.",
      );
      return;
    }

    const payload: AdmissionBatchInput = {
      academicYear,
      programme,
      fileName: selectedFile?.name || "admissions_batch.csv",
      records: parsedRows,
    };

    onUpload?.(payload);
  };

  return (
    <Card className={className} data-testid="batch-upload-panel">
      <CardHeader className="border-b border-line-subtle bg-surface-card pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="font-mono text-[11px] font-semibold"
              >
                AISHE: {institutionCode}
              </Badge>
              <Badge variant="info" className="text-[11px]">
                S-11 INTAKE WORKBENCH
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold text-txt-primary flex items-center gap-2">
              <FileSpreadsheet
                className="h-5 w-5 text-brand-primary"
                aria-hidden="true"
              />
              <span>Admission Batch Upload</span>
            </CardTitle>
            <CardDescription className="text-xs text-txt-secondary">
              Ingest institutional admission spreadsheet for automated AIRE
              validation and quarantine triage.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDefaultDownloadTemplate}
              aria-label="Download CSV Template"
              className="text-xs gap-1.5 h-8 border-line-default text-txt-primary hover:bg-surface-card-subdued"
            >
              <Download
                className="h-3.5 w-3.5 text-brand-primary"
                aria-hidden="true"
              />
              <span>CSV Template</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDefaultLoadSample}
              className="text-xs gap-1.5 h-8 border-line-default text-txt-primary hover:bg-surface-card-subdued"
            >
              <Sparkles
                className="h-3.5 w-3.5 text-brand-teal"
                aria-hidden="true"
              />
              <span>Load Sample</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 pt-5">
          {displayError && (
            <Alert variant="destructive" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <AlertTitle className="text-xs font-semibold">
                Upload Validation Error
              </AlertTitle>
              <AlertDescription className="text-xs leading-relaxed mt-0.5">
                {displayError}
              </AlertDescription>
            </Alert>
          )}

          {/* Academic Cycle & Programme Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="academic-year-select"
                className="text-xs font-semibold text-txt-primary"
              >
                Academic Year <span className="text-state-danger-text">*</span>
              </Label>
              <Select value={academicYear} onValueChange={handleYearChange}>
                <SelectTrigger
                  id="academic-year-select"
                  className="h-9 text-xs"
                >
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_ACADEMIC_YEARS.map((yr) => (
                    <SelectItem key={yr} value={yr} className="text-xs">
                      {yr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="programme-select"
                className="text-xs font-semibold text-txt-primary"
              >
                Programme & Branch{" "}
                <span className="text-state-danger-text">*</span>
              </Label>
              <Select value={programme} onValueChange={handleProgrammeChange}>
                <SelectTrigger id="programme-select" className="h-9 text-xs">
                  <SelectValue placeholder="Select programme" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_PROGRAMMES.map((prog) => (
                    <SelectItem key={prog} value={prog} className="text-xs">
                      {prog}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* File Upload Dropzone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-txt-primary">
              Candidate Admission Spreadsheet (.csv, .xlsx){" "}
              <span className="text-state-danger-text">*</span>
            </Label>
            <FileUpload
              accept=".csv,.xlsx"
              maxSizeBytes={50 * 1024 * 1024}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              disabled={isUploading}
              hint="Max 50MB. Required columns: studentName, rollNumber, dateOfBirth, category, quota, apaarId"
            />
          </div>

          {/* Pre-parse Record Summary Preview */}
          {parsedRows.length > 0 && (
            <div className="rounded-lg border border-state-success-border bg-state-success-bg p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-state-success-icon/20 text-state-success-text">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <span className="font-semibold text-state-success-text">
                    {parsedRows.length} Candidate Records Detected
                  </span>
                  <p className="text-[11px] text-state-success-text/90 mt-0.5">
                    Ready for automated ingestion into AIRE validation pipeline.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleFileRemove}
                disabled={isUploading}
                className="h-7 text-xs text-state-danger-text hover:bg-state-danger-bg px-2"
                aria-label="Clear parsed records"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                <span>Clear</span>
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t border-line-subtle bg-surface-card-subdued px-6 py-3 flex items-center justify-between">
          <span className="text-xs text-txt-muted">
            All submissions are digitally timestamped and audited under Section
            10(1) of AICTE Act.
          </span>
          <Button
            type="submit"
            disabled={isUploading || (!selectedFile && parsedRows.length === 0)}
            loading={isUploading}
            className="text-xs font-semibold px-5 h-9 bg-brand-primary hover:bg-brand-primary-hover text-txt-inverted shadow-sm"
          >
            <UploadCloud className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
            <span>Ingest &amp; Validate Batch</span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

BatchUploadPanel.displayName = "BatchUploadPanel";
