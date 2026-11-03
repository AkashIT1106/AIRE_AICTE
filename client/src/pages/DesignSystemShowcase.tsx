import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CheckCircle2,
  AlertOctagon,
  Info,
  Layers,
  Sparkles,
  ShieldCheck,
  Fingerprint,
} from "lucide-react";

// UI Primitives (Layer B)
import {
  Button,
  ButtonGroup,
  Input,
  SearchInput,
  Textarea,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Badge,
  StatusIndicator,
  Alert,
  AlertTitle,
  AlertDescription,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  ConfirmationDialog,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Tabs,
  TabsList,
  TabsTrigger,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  Progress,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  FileUpload,
  ErrorSummary,
  Stepper,
  MetricCard,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Label,
  Separator,
  toast,
} from "@/components/ui";

import { FormField } from "@/components/forms/FormField";

// Workflow Components (Layer C)
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
  SubmissionStatusTimeline,
  InstitutionStatusPanel,
  AuditEventEntry,
  AuditLogViewer,
  RecordVerificationSummary,
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
} from "@/components/workflow";

const demoFormSchema = z.object({
  institutionCode: z
    .string()
    .min(3, "Institution code must be at least 3 characters"),
  courseQuota: z.coerce.number().min(1, "Quota must be at least 1 seat"),
  submissionRemarks: z.string().optional(),
  attestationAccepted: z.boolean().refine((val) => val === true, {
    message: "You must attest to statutory regulatory compliance",
  }),
});

type DemoFormValues = z.infer<typeof demoFormSchema>;

export const DesignSystemShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "foundations" | "primitives" | "workflows"
  >("foundations");
  const [btnLoading, setBtnLoading] = useState(false);
  const [switchState, setSwitchState] = useState(false);
  const [radioSelection, setRadioSelection] = useState("all-india");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [densityMode, setDensityMode] = useState<"compact" | "standard">(
    "compact",
  );
  const [stepperStep, setStepperStep] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [progressVal] = useState(65);
  const [currentPage, setCurrentPage] = useState(2);

  // Workflow mock state
  const [simulatedProgress, setSimulatedProgress] = useState(68);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedWorkflowTab, setSelectedWorkflowTab] = useState("overview");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DemoFormValues>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      institutionCode: "AICTE-ENG-001",
      courseQuota: 60,
      submissionRemarks: "",
      attestationAccepted: false,
    },
  });

  const onSubmit = (data: DemoFormValues) => {
    toast({
      title: "Statutory Form Validated",
      description: `Institution ${data.institutionCode} validated successfully with quota ${data.courseQuota}.`,
      variant: "success",
    });
  };

  const handleSimulateProcessing = () => {
    setIsProcessing(true);
    setSimulatedProgress(10);
    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          toast({
            title: "Reconciliation Complete",
            description:
              "500 student records parsed, hashed, and matched against sanctioned quotas.",
            variant: "success",
          });
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  return (
    <TooltipProvider>
      <div className="space-y-8 pb-20">
        {/* Platform Header & Token Governance Banner */}
        <div className="border-b border-[var(--border-default)] pb-6">
          <div className="flex items-center space-x-2 text-xs text-[var(--brand-teal)] font-semibold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>
              Statutory Design System — UX4G 3.0 & DTCG 2025.10 Conformance
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1.5">
            AIRE Design System & Workflow Components
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-3xl leading-relaxed">
            Institutional component architecture designed for AICTE admission
            reconciliation, statutory quota compliance, cryptographic evidence
            verification, and quarantine triage. Verified against WCAG 2.2 Level
            AA accessibility.
          </p>

          {/* Compliance & Standards Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5 bg-[var(--surface-card)] border border-[var(--border-default)] px-2.5 py-1 rounded">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--brand-teal)]" />
              <span>Institutional Navy: #183B56</span>
            </span>
            <span className="flex items-center gap-1.5 bg-[var(--surface-card)] border border-[var(--border-default)] px-2.5 py-1 rounded">
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--state-success-icon)]" />
              <span>WCAG 2.2 AA Contrast Verified</span>
            </span>
            <span className="flex items-center gap-1.5 bg-[var(--surface-card)] border border-[var(--border-default)] px-2.5 py-1 rounded">
              <Layers className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
              <span>3-Layer Architecture: Tokens → Primitives → Workflows</span>
            </span>
            <span className="flex items-center gap-1.5 bg-[var(--surface-card)] border border-[var(--border-default)] px-2.5 py-1 rounded">
              <Fingerprint className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
              <span>Cryptographic Audit Proofs</span>
            </span>
          </div>

          {/* Top-Level Section Tabs */}
          <div className="mt-6">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as any)}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-xl grid-cols-3">
                <TabsTrigger value="foundations" className="text-xs sm:text-sm">
                  1. Foundations & Tokens
                </TabsTrigger>
                <TabsTrigger value="primitives" className="text-xs sm:text-sm">
                  2. Layer B Primitives
                </TabsTrigger>
                <TabsTrigger value="workflows" className="text-xs sm:text-sm">
                  3. Layer C AIRE Workflows
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: FOUNDATIONS & TOKENS
           ========================================================================= */}
        {activeTab === "foundations" && (
          <div className="space-y-12">
            {/* 1. Primitive Token Scales */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[var(--brand-primary)]" />
                  <span>1. Primitive Token Scales</span>
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Raw palette values defined in{" "}
                  <code className="font-mono">color.primitive.*</code>.
                  Application components consume semantic aliases exclusively.
                </p>
              </div>

              {/* Brand Navy Scale */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  Brand Institutional Navy Scale (Anchor: #183B56)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    {
                      name: "navy-950",
                      hex: "#0D2233",
                      bg: "#0D2233",
                      text: "#FFFFFF",
                    },
                    {
                      name: "navy-900",
                      hex: "#183B56",
                      bg: "#183B56",
                      text: "#FFFFFF",
                    },
                    {
                      name: "navy-800",
                      hex: "#1C4666",
                      bg: "#1C4666",
                      text: "#FFFFFF",
                    },
                    {
                      name: "navy-700",
                      hex: "#245B75",
                      bg: "#245B75",
                      text: "#FFFFFF",
                    },
                    {
                      name: "navy-600",
                      hex: "#356B85",
                      bg: "#356B85",
                      text: "#FFFFFF",
                    },
                    {
                      name: "navy-50",
                      hex: "#E8F0F7",
                      bg: "#E8F0F7",
                      text: "#183B56",
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      style={{ backgroundColor: item.bg, color: item.text }}
                      className="p-3 rounded border border-[var(--border-subtle)] text-xs flex flex-col justify-between h-20 shadow-sm"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="font-mono text-[11px] opacity-90">
                        {item.hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Blue & Teal Accent */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  Action Blue (#245B75) & Verification Teal Accent (#0F766E)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    {
                      name: "action-primary",
                      hex: "#245B75",
                      bg: "#245B75",
                      text: "#FFFFFF",
                    },
                    {
                      name: "action-hover",
                      hex: "#1C4666",
                      bg: "#1C4666",
                      text: "#FFFFFF",
                    },
                    {
                      name: "teal-accent",
                      hex: "#0F766E",
                      bg: "#0F766E",
                      text: "#FFFFFF",
                    },
                    {
                      name: "teal-subtle",
                      hex: "#CCFBF1",
                      bg: "#CCFBF1",
                      text: "#0F766E",
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      style={{ backgroundColor: item.bg, color: item.text }}
                      className="p-3 rounded border border-[var(--border-subtle)] text-xs flex flex-col justify-between h-20 shadow-sm"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="font-mono text-[11px] opacity-90">
                        {item.hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Status Colors */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  Status States (WCAG 2.2 AA Contrast Verified)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Success (Approved / Reconciled)",
                      bg: "var(--state-success-bg)",
                      border: "var(--state-success-border)",
                      text: "var(--state-success-text)",
                      desc: "Intake cleared, SHA-256 seal valid",
                    },
                    {
                      label: "Warning (Quarantine Triage)",
                      bg: "var(--state-warning-bg)",
                      border: "var(--state-warning-border)",
                      text: "var(--state-warning-text)",
                      desc: "Quota capacity ≥ 90%, pending review",
                    },
                    {
                      label: "Danger (Intake Breach / Fraud)",
                      bg: "var(--state-danger-bg)",
                      border: "var(--state-danger-border)",
                      text: "var(--state-danger-text)",
                      desc: "Over-admission > 100%, show cause",
                    },
                    {
                      label: "Info (Guideline Callouts)",
                      bg: "var(--state-info-bg)",
                      border: "var(--state-info-border)",
                      text: "var(--state-info-text)",
                      desc: "AICTE Approval Process Handbook ref",
                    },
                  ].map((status) => (
                    <div
                      key={status.label}
                      style={{
                        backgroundColor: status.bg,
                        borderColor: status.border,
                        color: status.text,
                      }}
                      className="p-3.5 rounded border text-xs space-y-1 shadow-sm"
                    >
                      <p className="font-semibold">{status.label}</p>
                      <p className="text-[11px] opacity-90">{status.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Typography Foundations */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  2. Typography Scale & Tabular Numerals
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Inter for textual clarity; JetBrains Mono with tabular numeral
                  features for quotas, roll numbers, and hashes.
                </p>
              </div>

              <div className="space-y-3 bg-[var(--surface-card)] p-4 rounded border border-[var(--border-default)]">
                <div className="border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Display / H1 — 24px (font-bold)
                  </span>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                    AICTE Institutional Records & Verification Platform
                  </p>
                </div>
                <div className="border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Headline / H2 — 18px (font-semibold)
                  </span>
                  <p className="text-lg font-semibold text-[var(--text-primary)] mt-1">
                    Approved Sanctioned Intake vs Quarantined Admissions
                  </p>
                </div>
                <div className="border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Section / H3 — 14px (font-semibold)
                  </span>
                  <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">
                    Academic Year 2026–2027 Ingestion Batch Manifest
                  </p>
                </div>
                <div className="border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Body / Regular — 13px
                  </span>
                  <p className="text-[13px] text-[var(--text-primary)] mt-1 leading-relaxed">
                    Student admission records ingested through state counseling
                    portals are deterministically validated against sanctioned
                    institution seat matrices.
                  </p>
                </div>
                <div>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Tabular Numerals & Identifiers — JetBrains Mono
                    (font-tabular)
                  </span>
                  <p className="text-xs font-mono font-tabular text-[var(--text-secondary)] mt-1">
                    SHA-256 Digest:
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </p>
                  <p className="text-xs font-mono font-tabular text-[var(--text-primary)] mt-1">
                    Roll #2026-CSE-101 | Quota Allocation: 120 / 120 (100.00%) |
                    Latency: 142ms
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Spacing Grid & Geometric Dimensions */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  3. Spacing & Geometric Scale (4px Base Grid)
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Consistent spacing tokens from 4px to 48px, standard control
                  heights (36px / 44px), and 4px button radius.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {[
                  { token: "spacing.1", px: "4px" },
                  { token: "spacing.2", px: "8px" },
                  { token: "spacing.3", px: "12px" },
                  { token: "spacing.4", px: "16px" },
                  { token: "spacing.6", px: "24px" },
                  { token: "spacing.8", px: "32px" },
                ].map((item) => (
                  <div
                    key={item.token}
                    className="p-3 bg-[var(--surface-card)] rounded border border-[var(--border-default)] text-xs"
                  >
                    <p className="font-mono text-[11px] text-[var(--text-muted)]">
                      {item.token}
                    </p>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {item.px}
                    </p>
                    <div
                      className="mt-2 h-2 bg-[var(--brand-primary)] rounded"
                      style={{ width: item.px }}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            TAB 2: LAYER B REUSABLE PRIMITIVES
           ========================================================================= */}
        {activeTab === "primitives" && (
          <div className="space-y-12">
            {/* 1. Buttons & Button Group */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  1. Buttons, Button Groups & Interactive States
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Single primary solid button per view; keyboard focus rings,
                  loading states with anti-double-submission.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 bg-[var(--surface-card)] p-4 rounded border border-[var(--border-default)]">
                <Button variant="default">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Statutory Link</Button>

                <Button
                  variant="default"
                  loading={btnLoading}
                  onClick={() => {
                    setBtnLoading(true);
                    setTimeout(() => setBtnLoading(false), 2000);
                  }}
                >
                  {btnLoading ? "Processing..." : "Click for Loading State"}
                </Button>

                <Button variant="default" disabled>
                  Disabled
                </Button>

                <Separator orientation="vertical" className="h-8" />

                <ButtonGroup label="View modes">
                  <Button variant="outline" size="sm">
                    Compact
                  </Button>
                  <Button variant="outline" size="sm">
                    Standard
                  </Button>
                  <Button variant="outline" size="sm">
                    Detailed
                  </Button>
                </ButtonGroup>
              </div>
            </section>

            {/* 2. Accessible Form Controls */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  2. Accessible Forms, Validation & Error Summary
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Zod schema integration, visible labels, described-by error
                  text, and keyboard focusable error summary.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Statutory Quota Submission Form</CardTitle>
                  <CardDescription>
                    All fields strictly validated client-side with immediate
                    accessible announcements.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 max-w-xl"
                  >
                    {/* Error Summary Component */}
                    {Object.keys(errors).length > 0 && (
                      <ErrorSummary
                        title="Submission Validation Errors"
                        errors={Object.entries(errors).map(([field, err]) => ({
                          fieldId: field,
                          message: err?.message || "Invalid field",
                        }))}
                      />
                    )}

                    <FormField
                      label="Institution AICTE Code"
                      id="institutionCode"
                      required
                      error={errors.institutionCode?.message}
                      helperText="Official 10-digit AICTE approval identifier"
                    >
                      <Input
                        id="institutionCode"
                        {...register("institutionCode")}
                        error={!!errors.institutionCode}
                        placeholder="e.g. 1-10972411"
                      />
                    </FormField>

                    <FormField
                      label="Sanctioned Seat Intake"
                      id="courseQuota"
                      required
                      error={errors.courseQuota?.message}
                    >
                      <Input
                        id="courseQuota"
                        type="number"
                        {...register("courseQuota")}
                        error={!!errors.courseQuota}
                      />
                    </FormField>

                    <FormField
                      label="Administrative Remarks"
                      id="submissionRemarks"
                      helperText="Optional statutory notes for state reconciliation officer"
                    >
                      <Textarea
                        id="submissionRemarks"
                        {...register("submissionRemarks")}
                        placeholder="Add institutional justification notes if applicable..."
                      />
                    </FormField>

                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="attestationAccepted"
                        checked={watch("attestationAccepted")}
                        onCheckedChange={(checked) =>
                          setValue("attestationAccepted", !!checked)
                        }
                      />
                      <Label htmlFor="attestationAccepted" className="text-xs">
                        I hereby attest that submitted admission records comply
                        with AICTE Sanctioned Quotas.
                      </Label>
                    </div>
                    {errors.attestationAccepted && (
                      <p className="text-xs text-[var(--state-danger-text)] font-medium">
                        {errors.attestationAccepted.message}
                      </p>
                    )}

                    <div className="pt-2">
                      <Button type="submit" variant="default">
                        Validate & Submit Cohort
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Individual Form Elements Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Search & Filter Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SearchInput
                      value={searchValue}
                      onChange={(val) => setSearchValue(val)}
                      onClear={() => setSearchValue("")}
                      placeholder="Search candidate by name, roll, or masked APAAR..."
                    />

                    <div className="space-y-2">
                      <Label htmlFor="branchSelect">Programme Discipline</Label>
                      <Select defaultValue="cse">
                        <SelectTrigger id="branchSelect">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cse">
                            Computer Science & Engineering
                          </SelectItem>
                          <SelectItem value="ece">
                            Electronics & Communication
                          </SelectItem>
                          <SelectItem value="me">
                            Mechanical Engineering
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quota Allotment Tier</Label>
                      <RadioGroup
                        value={radioSelection}
                        onValueChange={setRadioSelection}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all-india" id="r-ai" />
                          <Label htmlFor="r-ai" className="text-xs">
                            All India Merit Quota
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="home-state" id="r-hs" />
                          <Label htmlFor="r-hs" className="text-xs">
                            Home State Reservation
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="supernumerary" id="r-sn" />
                          <Label htmlFor="r-sn" className="text-xs">
                            Supernumerary (TFW / EWS)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Label htmlFor="demoSwitch">
                        Strict Intake Enforcement Mode
                      </Label>
                      <Switch
                        id="demoSwitch"
                        checked={switchState}
                        onCheckedChange={setSwitchState}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      File Upload & Drag-and-Drop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FileUpload
                      accept=".csv,.json"
                      maxSizeBytes={5 * 1024 * 1024}
                      onFileSelect={(file) => {
                        toast({
                          title: "File Selected",
                          description: `${file.name} (${(file.size / 1024).toFixed(1)} KB) ready for ingestion.`,
                          variant: "info",
                        });
                      }}
                      hint="Upload official CSV or JSON admission batch ledger (Max: 5MB)"
                    />
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 3. Alerts & Notification Banners */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  3. Alerts, Badges & Toast Notifications
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Semantic status feedback pairing text, icons, and WCAG AA
                  contrast. Never convey status by color alone.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Alert variant="default">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Institutional Notice</AlertTitle>
                    <AlertDescription>
                      AICTE Academic Year 2026–2027 seat allocation
                      reconciliation window closes in 4 days.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="destructive">
                    <AlertOctagon className="h-4 w-4" />
                    <AlertTitle>Intake Violation Detected</AlertTitle>
                    <AlertDescription>
                      Mechanical Engineering admitted 68 candidates against 60
                      sanctioned seats (8 over quota).
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="bg-[var(--surface-card)] p-4 rounded border border-[var(--border-default)] space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusIndicator
                      status="compliant"
                      label="Statutory Sealed"
                    />
                    <StatusIndicator
                      status="warning"
                      label="Quarantine Triage"
                    />
                    <StatusIndicator status="breach" label="Intake Breach" />
                    <StatusIndicator status="masked" label="••••-••••-1042" />
                  </div>

                  <Separator />

                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">
                      Trigger Accessible Toast Announcements
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toast({
                            title: "Audit Digest Calculated",
                            description:
                              "SHA-256 batch hash verified across 500 records.",
                            variant: "info",
                          })
                        }
                      >
                        Info Toast
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toast({
                            title: "Cohort Sealed",
                            description:
                              "Irreversible cryptographic seal applied by Head of Institution.",
                            variant: "success",
                          })
                        }
                      >
                        Success Toast
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toast({
                            title: "Quarantine Exception",
                            description:
                              "Candidate APAAR ID mismatch requires manual remediation.",
                            variant: "destructive",
                            correlationId: "req_audit_7f2a1b",
                          })
                        }
                      >
                        Persistent Error Toast
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Modals, Drawers & Overlays */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  4. Dialogs, Confirmation Modals & Drawers
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Accessible focus traps, keyboard navigation (Escape to
                  dismiss), and explicit cancellation buttons.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 bg-[var(--surface-card)] p-4 rounded border border-[var(--border-default)]">
                <Button variant="default" onClick={() => setDialogOpen(true)}>
                  Open Standard Dialog
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => setConfirmDialogOpen(true)}
                >
                  Open Statutory Seal Confirmation
                </Button>

                <Button variant="outline" onClick={() => setDrawerOpen(true)}>
                  Open Detail Drawer
                </Button>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Regulatory help info"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Statutory Rule: AICTE Approval Handbook Appendix 4
                  </TooltipContent>
                </Tooltip>

                {/* Dialog Implementation */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Statutory Quota Details</DialogTitle>
                      <DialogDescription>
                        Sanctioned capacity breakdown for Academic Year
                        2026–2027.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-3 text-xs text-[var(--text-secondary)] space-y-2">
                      <p>
                        Approved Intake: <strong>120 Seats</strong>
                      </p>
                      <p>
                        Supernumerary TFW Cap: <strong>6 Seats (5%)</strong>
                      </p>
                      <p>
                        EWS Supernumerary: <strong>12 Seats (10%)</strong>
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="secondary"
                        onClick={() => setDialogOpen(false)}
                      >
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Confirmation Dialog */}
                <ConfirmationDialog
                  open={confirmDialogOpen}
                  onOpenChange={setConfirmDialogOpen}
                  title="Irreversible Statutory Cohort Seal"
                  description="Sealing this admission cohort permanently locks the ledger and issues an official compliance certificate to AICTE. This operation cannot be reversed."
                  confirmLabel="Confirm & Seal Cohort"
                  cancelLabel="Cancel"
                  isDestructive={true}
                  attestationText="I verify under statutory penalty that all quota allocations have been audited."
                  onConfirm={() => {
                    toast({
                      title: "Cohort Sealed",
                      description: "Official statutory seal applied.",
                      variant: "success",
                    });
                    setConfirmDialogOpen(false);
                  }}
                  onCancel={() => setConfirmDialogOpen(false)}
                />

                {/* Drawer */}
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Student Admission Record Detail</DrawerTitle>
                      <DrawerDescription>
                        Cryptographic ledger proof for Roll #2026-CSE-101.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 space-y-4 text-xs">
                      <div className="p-3 bg-[var(--surface-card-subdued)] rounded border border-[var(--border-subtle)] space-y-2">
                        <p>
                          <strong>Candidate:</strong> Aarav Sharma
                        </p>
                        <p>
                          <strong>Masked APAAR:</strong> ••••-••••-1042
                        </p>
                        <p>
                          <strong>Category:</strong> General / All India
                        </p>
                        <p>
                          <strong>Merit Rank:</strong> 1,420
                        </p>
                        <p className="font-mono text-[11px] text-[var(--text-muted)]">
                          Digital Digest: 98f1c24...b855
                        </p>
                      </div>
                    </div>
                    <DrawerFooter>
                      <Button
                        variant="secondary"
                        onClick={() => setDrawerOpen(false)}
                      >
                        Close Panel
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </section>

            {/* 5. High-Density Institutional Table & Pagination */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-default)] pb-2">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    5. High-Density Institutional Data Table & Pagination
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Operational density (36px compact rows) with horizontal
                    overflow containment, sort headers, and keyboard navigation.
                  </p>
                </div>
                <ButtonGroup label="Table density toggle">
                  <Button
                    size="sm"
                    variant={densityMode === "compact" ? "default" : "outline"}
                    onClick={() => setDensityMode("compact")}
                  >
                    Compact (36px)
                  </Button>
                  <Button
                    size="sm"
                    variant={densityMode === "standard" ? "default" : "outline"}
                    onClick={() => setDensityMode("standard")}
                  >
                    Standard (44px)
                  </Button>
                </ButtonGroup>
              </div>

              <Table density={densityMode}>
                <TableHeader>
                  <TableRow>
                    <TableHead sortable>Roll Number</TableHead>
                    <TableHead>Masked APAAR ID</TableHead>
                    <TableHead>Course / Branch</TableHead>
                    <TableHead>Quota Category</TableHead>
                    <TableHead sortable>Merit Rank</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      roll: "2026-CSE-101",
                      apaar: "••••-••••-1042",
                      branch: "Computer Science",
                      quota: "General / All India",
                      rank: "1,420",
                      status: "success",
                      text: "Reconciled",
                    },
                    {
                      roll: "2026-CSE-102",
                      apaar: "••••-••••-9821",
                      branch: "Computer Science",
                      quota: "OBC-NCL Home State",
                      rank: "3,812",
                      status: "warning",
                      text: "Quarantine (DOB Mismatch)",
                    },
                    {
                      roll: "2026-ECE-105",
                      apaar: "••••-••••-4109",
                      branch: "Electronics & Comm",
                      quota: "EWS Supernumerary",
                      rank: "5,108",
                      status: "success",
                      text: "Reconciled",
                    },
                    {
                      roll: "2026-ME-112",
                      apaar: "••••-••••-7734",
                      branch: "Mechanical Engineering",
                      quota: "Management Quota",
                      rank: "14,920",
                      status: "danger",
                      text: "Quota Breach (>15%)",
                    },
                  ].map((row) => (
                    <TableRow key={row.roll}>
                      <TableCell className="font-mono font-medium font-tabular">
                        {row.roll}
                      </TableCell>
                      <TableCell className="font-mono font-tabular text-[var(--text-muted)]">
                        {row.apaar}
                      </TableCell>
                      <TableCell>{row.branch}</TableCell>
                      <TableCell className="text-[var(--text-secondary)]">
                        {row.quota}
                      </TableCell>
                      <TableCell className="font-mono font-tabular">
                        {row.rank}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={row.status as any} size="sm">
                          {row.text}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>
                  AICTE Admission Batch #BATCH-2026-001 — Sample Ledger Preview
                </TableCaption>
              </Table>

              {/* Accessible Pagination */}
              <div className="flex justify-between items-center bg-[var(--surface-card)] p-3 rounded border border-[var(--border-default)]">
                <span className="text-xs text-[var(--text-secondary)] font-tabular">
                  Showing 1–4 of 120 verified admission records
                </span>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        isActive={currentPage === 1}
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        isActive={currentPage === 2}
                        onClick={() => setCurrentPage(2)}
                      >
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        isActive={currentPage === 3}
                        onClick={() => setCurrentPage(3)}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) => Math.min(3, p + 1))
                        }
                        disabled={currentPage === 3}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </section>

            {/* 6. Stepper, Progress, Metric Cards & Timeline */}
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  6. Steppers, Metrics, Progress & Timelines
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Sequential progress visualization, KPI displays, and audit
                  trails.
                </p>
              </div>

              {/* Metric Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard
                  title="Sanctioned Intake"
                  value="120"
                  status="success"
                  subtext="Sanctioned by AICTE for 2026–27"
                />
                <MetricCard
                  title="Reconciled Seats"
                  value="112"
                  status="info"
                  subtext="Validated against state counseling"
                />
                <MetricCard
                  title="Quarantine Issues"
                  value="6"
                  status="warning"
                  subtext="Requires institutional review"
                />
                <MetricCard
                  title="Quota Violations"
                  value="2"
                  status="danger"
                  subtext="Exceeds statutory reservation cap"
                />
              </div>

              {/* Workflow Stepper */}
              <div className="bg-[var(--surface-card)] p-4 rounded border border-[var(--border-default)] space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-semibold text-[var(--text-primary)]">
                    Sequential Batch Reconciliation Pipeline
                  </p>
                  <ButtonGroup label="Stepper controls">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStepperStep((s) => Math.max(0, s - 1))}
                      disabled={stepperStep === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStepperStep((s) => Math.min(3, s + 1))}
                      disabled={stepperStep === 3}
                    >
                      Next Step
                    </Button>
                  </ButtonGroup>
                </div>

                <Stepper
                  steps={[
                    {
                      title: "Upload Ingestion",
                      description: "CSV / JSON parsing",
                    },
                    {
                      title: "Automated Rules",
                      description: "Quota & APAAR validation",
                    },
                    {
                      title: "Quarantine Triage",
                      description: "Remediate discrepancies",
                    },
                    {
                      title: "Statutory Seal",
                      description: "Cryptographic sign-off",
                    },
                  ]}
                  currentStepIndex={stepperStep}
                />
              </div>

              {/* Progress & Accordion Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--surface-card)] p-4 rounded border border-[var(--border-default)] space-y-4">
                  <p className="text-xs font-semibold text-[var(--text-primary)]">
                    Progress Bar Indicators
                  </p>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Reconciliation Progress</span>
                        <span className="font-mono font-tabular">
                          {progressVal}%
                        </span>
                      </div>
                      <Progress value={progressVal} variant="default" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Sanctioned Quota Utilization</span>
                        <span className="font-mono font-tabular text-[var(--state-success-text)]">
                          93%
                        </span>
                      </div>
                      <Progress value={93} variant="success" />
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--surface-card)] p-4 rounded border border-[var(--border-default)]">
                  <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">
                    Collapsible Regulatory Accordion
                  </p>
                  <Accordion type="single" collapsible defaultValue="rules">
                    <AccordionItem value="rules">
                      <AccordionTrigger>
                        Statutory AICTE Quota Rules
                      </AccordionTrigger>
                      <AccordionContent>
                        Institutions cannot exceed approved seat matrix without
                        explicit state council supernumerary allotment orders.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="audit">
                      <AccordionTrigger>
                        Audit Log Integrity Protocol
                      </AccordionTrigger>
                      <AccordionContent>
                        Every triage modification generates a SHA-256 merkle
                        proof logged with timestamp in Indian Standard Time
                        (IST).
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =========================================================================
            TAB 3: LAYER C AIRE WORKFLOW COMPONENTS
           ========================================================================= */}
        {activeTab === "workflows" && (
          <div className="space-y-10">
            {/* Workflow Navigation Strip */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-default)] pb-4">
              {[
                { id: "overview", label: "1. Overview & Institution Status" },
                { id: "upload", label: "2. Batch Upload & Ingestion" },
                { id: "triage", label: "3. Quarantine Triage Workbench" },
                { id: "records", label: "4. Student Record & Quota" },
                { id: "audit", label: "5. Audit Explorer & Proofs" },
              ].map((item) => (
                <Button
                  key={item.id}
                  size="sm"
                  variant={
                    selectedWorkflowTab === item.id ? "default" : "outline"
                  }
                  onClick={() => setSelectedWorkflowTab(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </div>

            {/* WORKFLOW VIEW 1: Overview & Institution Status */}
            {selectedWorkflowTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Institution Compliance Overview & Statutory Timeline
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    High-level compliance workbench summarizing AICTE intake
                    authorization, submission timeline, and cohort verification
                    seal.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Component 11: InstitutionStatusPanel */}
                    <InstitutionStatusPanel
                      institution={MOCK_INSTITUTION_STATUS}
                    />

                    {/* Component 14: RecordVerificationSummary */}
                    <RecordVerificationSummary
                      verificationData={MOCK_RECORD_VERIFICATION}
                    />
                  </div>

                  <div className="space-y-6">
                    {/* Component 10: SubmissionStatusTimeline */}
                    <SubmissionStatusTimeline
                      currentStatus={MOCK_SUBMISSION_TIMELINE.currentStatus}
                      milestones={MOCK_SUBMISSION_TIMELINE.milestones}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* WORKFLOW VIEW 2: Batch Upload & Processing */}
            {selectedWorkflowTab === "upload" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Admission Batch Upload & Processing Lifecycle
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Client-side validation, parsing simulation, real-time stage
                    progress, and validation issue breakdown.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Component 1: BatchUploadPanel */}
                  <BatchUploadPanel
                    onUpload={(data) => {
                      toast({
                        title: "Batch Received",
                        description: `Initiating reconciliation for ${data.records.length} records.`,
                        variant: "info",
                      });
                      handleSimulateProcessing();
                    }}
                  />

                  {/* Component 2: FileProcessingProgress */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex justify-between items-center">
                          <span>Live Ingestion Pipeline</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSimulateProcessing}
                            disabled={isProcessing}
                          >
                            {isProcessing
                              ? "Simulating..."
                              : "Simulate Processing"}
                          </Button>
                        </CardTitle>
                        <CardDescription>
                          Deterministic stages: CSV Parse → APAAR Check → Quota
                          Rule Verification → Merkle Digest
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FileProcessingProgress
                          fileName="AY2026_Engineering_Batch_01.csv"
                          progressPercent={simulatedProgress}
                          status={isProcessing ? "processing" : "completed"}
                          stages={MOCK_PROCESSING_STAGES}
                        />
                      </CardContent>
                    </Card>

                    {/* Component 3: UploadValidationSummary */}
                    <UploadValidationSummary
                      summary={MOCK_VALIDATION_SUMMARY}
                    />
                  </div>
                </div>

                {/* Component 4: ValidationIssueSummary */}
                <div className="pt-2">
                  <ValidationIssueSummary
                    issues={MOCK_VALIDATION_ISSUES}
                    onSelectIssue={(field, issueType) => {
                      toast({
                        title: "Issue Filter Applied",
                        description: `Filtering by ${field}: ${issueType}`,
                        variant: "info",
                      });
                      setSelectedWorkflowTab("triage");
                    }}
                  />
                </div>
              </div>
            )}

            {/* WORKFLOW VIEW 3: Quarantine Triage Workbench */}
            {selectedWorkflowTab === "triage" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Quarantine Triage Workbench & Issue Remediation
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Structured human oversight: sortable triage table, bulk
                    resolution actions, and detailed discrepancy rows.
                  </p>
                </div>

                {/* Component 6: QuarantineTriageTable */}
                <QuarantineTriageTable
                  records={MOCK_QUARANTINE_RECORDS}
                  onRemediateRow={(rowId) => {
                    toast({
                      title: "Remediation Saved",
                      description: `Row ${rowId} updated.`,
                      variant: "success",
                    });
                  }}
                  onDiscardRow={(rowId) => {
                    toast({
                      title: "Row Discarded",
                      description: `Row ${rowId} removed from submission.`,
                      variant: "info",
                    });
                  }}
                />

                {/* Component 5: QuarantineIssueRow standalone showcase */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    Individual Quarantine Issue Row (Expanded Detail View)
                  </h4>
                  <div className="bg-[var(--surface-card)] rounded border border-[var(--border-default)] p-3 divide-y divide-[var(--border-subtle)]">
                    {MOCK_QUARANTINE_RECORDS.slice(0, 2).map((record) => (
                      <div key={record.rowId} className="py-2">
                        <QuarantineIssueRow
                          record={record}
                          onRemediate={() => {
                            toast({
                              title: "Action Initiated",
                              description: `Remediation started for candidate row #${record.rowNumber}`,
                              variant: "info",
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* WORKFLOW VIEW 4: Student Record & Quota Allocation */}
            {selectedWorkflowTab === "records" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Student Record Details & Quota Capacity Indicators
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Individual verified candidate records, duplicate record
                    comparison diffs, and seat reservation breakdown.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Component 7: StudentRecordSummary */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                      Verified Student Record Card
                    </h4>
                    <StudentRecordSummary student={MOCK_STUDENT_RECORD} />
                  </div>

                  {/* Component 8: QuotaCategoryIndicator */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                      Statutory Quota Capacity Overview
                    </h4>
                    <QuotaCategoryIndicator overview={MOCK_QUOTA_ALLOCATIONS} />
                  </div>
                </div>

                {/* Component 9: DuplicateRecordComparisonPanel */}
                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                    Duplicate Admission Conflict Comparison
                  </h4>
                  <DuplicateRecordComparisonPanel
                    conflictData={MOCK_DUPLICATE_COMPARISON}
                    onResolve={(action, note) => {
                      toast({
                        title: "Conflict Resolved",
                        description: `Action: ${action}. Note: ${note || "None"}`,
                        variant: "success",
                      });
                    }}
                  />
                </div>
              </div>
            )}

            {/* WORKFLOW VIEW 5: Audit Explorer & Proofs */}
            {selectedWorkflowTab === "audit" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Statutory Audit Trail Explorer & Tamper-Evident Proofs
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Non-repudiation event ledger: role-based action logs,
                    SHA-256 cryptographic digests, and payload diff inspection.
                  </p>
                </div>

                {/* Component 13: AuditLogViewer */}
                <AuditLogViewer
                  logs={MOCK_AUDIT_EVENTS}
                  onExport={() => {
                    toast({
                      title: "Audit Log Exported",
                      description:
                        "Official tamper-evident CSV manifest downloaded.",
                      variant: "info",
                    });
                  }}
                />

                {/* Component 12: AuditEventEntry (Standalone View) */}
                <div className="space-y-3 pt-4">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                    Single Audit Event Proof (Detailed Signature Card)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_AUDIT_EVENTS.slice(0, 2).map((event) => (
                      <AuditEventEntry key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
