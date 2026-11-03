import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Lock,
  Layers,
  Sparkles,
  Download,
  ShieldCheck,
  Eye,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/forms/FormField";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";

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
  const [btnLoading, setBtnLoading] = useState(false);
  const [switchState, setSwitchState] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [densityMode, setDensityMode] = useState<"compact" | "standard">(
    "compact",
  );

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
    alert(
      `Form validated successfully via Zod:\n${JSON.stringify(data, null, 2)}`,
    );
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Platform Header & Token System Summary */}
      <div className="border-b border-[var(--border-default)] pb-6">
        <div className="flex items-center space-x-2 text-xs text-[var(--brand-teal)] font-semibold uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>Stage 3.5 Institutional UX & Visual Design System</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1.5">
          AIRE Canonical Design Tokens & Foundations
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-3xl leading-relaxed">
          Grounded in HCI research, public-sector design standards (USWDS,
          GOV.UK), and WCAG 2.2 Level AA accessibility. Driven strictly from{" "}
          <code className="text-xs bg-[var(--surface-card-subdued)] px-1.5 py-0.5 rounded border border-[var(--border-default)] font-mono">
            client/design-tokens.json
          </code>{" "}
          (DTCG 2025.10 specification).
        </p>

        {/* Governance & Compliance Strip */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5 bg-[var(--surface-card)] border border-[var(--border-default)] px-2.5 py-1 rounded">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--brand-teal)]" />
            <span>Institutional Navy: #173B57</span>
          </span>
          <span className="flex items-center gap-1.5 bg-[var(--surface-card)] border border-[var(--border-default)] px-2.5 py-1 rounded">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--state-success-icon)]" />
            <span>WCAG 2.2 AA Contrast Verified</span>
          </span>
          <span className="flex items-center gap-1.5 bg-[var(--surface-card)] border border-[var(--border-default)] px-2.5 py-1 rounded">
            <Layers className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
            <span>DTCG 2025.10 Token Format</span>
          </span>
        </div>
      </div>

      {/* 1. Primitive Foundations */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Layers className="h-5 w-5 text-[var(--brand-primary)]" />
            <span>1. Primitive Token Scales</span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Raw color values defined in{" "}
            <code className="font-mono">color.primitive.*</code>. Application
            components consume semantic aliases exclusively.
          </p>
        </div>

        {/* Brand Navy Scale */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[var(--text-primary)]">
            Brand Institutional Navy Scale (Anchor: #173B57)
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
                hex: "#173B57",
                bg: "#173B57",
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
                hex: "#245880",
                bg: "#245880",
                text: "#FFFFFF",
              },
              {
                name: "navy-100",
                hex: "#E8F0F7",
                bg: "#E8F0F7",
                text: "#172B3A",
              },
              {
                name: "navy-50",
                hex: "#F2F6FA",
                bg: "#F2F6FA",
                text: "#172B3A",
              },
            ].map((swatch) => (
              <div
                key={swatch.name}
                className="p-2.5 rounded border border-[var(--border-default)] bg-[var(--surface-card)]"
              >
                <div
                  className="h-9 rounded mb-2 flex items-end justify-end p-1 shadow-inner"
                  style={{ backgroundColor: swatch.bg }}
                >
                  <span
                    className="text-[10px] font-mono px-1 rounded bg-black/30"
                    style={{ color: swatch.text }}
                  >
                    {swatch.hex}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  {swatch.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Teal Accent Scale */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-[var(--text-primary)]">
            Teal Accent & Focus Scale (Anchor: #0F766E)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              {
                name: "teal-950",
                hex: "#073834",
                bg: "#073834",
                text: "#FFFFFF",
              },
              {
                name: "teal-900",
                hex: "#0A4F4A",
                bg: "#0A4F4A",
                text: "#FFFFFF",
              },
              {
                name: "teal-800",
                hex: "#0D635C",
                bg: "#0D635C",
                text: "#FFFFFF",
              },
              {
                name: "teal-700",
                hex: "#0F766E",
                bg: "#0F766E",
                text: "#FFFFFF",
              },
              {
                name: "teal-100",
                hex: "#CCFBF1",
                bg: "#CCFBF1",
                text: "#0A4F4A",
              },
              {
                name: "teal-50",
                hex: "#F0FDFA",
                bg: "#F0FDFA",
                text: "#0A4F4A",
              },
            ].map((swatch) => (
              <div
                key={swatch.name}
                className="p-2.5 rounded border border-[var(--border-default)] bg-[var(--surface-card)]"
              >
                <div
                  className="h-9 rounded mb-2 flex items-end justify-end p-1 shadow-inner"
                  style={{ backgroundColor: swatch.bg }}
                >
                  <span
                    className="text-[10px] font-mono px-1 rounded bg-black/30"
                    style={{ color: swatch.text }}
                  >
                    {swatch.hex}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  {swatch.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Neutral Slate Scale */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-[var(--text-primary)]">
            Neutral Slate & Background Scale
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              {
                name: "canvas",
                hex: "#F5F7FA",
                bg: "#F5F7FA",
                text: "#172B3A",
              },
              {
                name: "surface",
                hex: "#FFFFFF",
                bg: "#FFFFFF",
                text: "#172B3A",
              },
              {
                name: "slate-900",
                hex: "#172B3A",
                bg: "#172B3A",
                text: "#FFFFFF",
              },
              {
                name: "slate-600",
                hex: "#526579",
                bg: "#526579",
                text: "#FFFFFF",
              },
              {
                name: "slate-500",
                hex: "#5A6E82",
                bg: "#5A6E82",
                text: "#FFFFFF",
              },
              {
                name: "slate-200",
                hex: "#CBD5E1",
                bg: "#CBD5E1",
                text: "#172B3A",
              },
            ].map((swatch) => (
              <div
                key={swatch.name}
                className="p-2.5 rounded border border-[var(--border-default)] bg-[var(--surface-card)]"
              >
                <div
                  className="h-9 rounded mb-2 flex items-end justify-end p-1 border border-black/10"
                  style={{ backgroundColor: swatch.bg }}
                >
                  <span
                    className="text-[10px] font-mono px-1 rounded bg-black/20"
                    style={{ color: swatch.text }}
                  >
                    {swatch.hex}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  {swatch.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Semantic Token Roles & WCAG Ratios */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            2. Semantic Token Roles & Contrast Validation
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Every semantic token is bound to CSS custom properties. Contrast
            ratios are verified against WCAG 2.2 AA (4.5:1 text, 3:1 non-text).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded border border-[var(--border-default)] bg-[var(--surface-card)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                color.action.primary
              </span>
              <Badge variant="outline" size="sm" className="text-[10px]">
                11.7:1 (AAA)
              </Badge>
            </div>
            <div className="h-9 rounded bg-[var(--brand-primary)] text-[var(--text-inverted)] flex items-center justify-center text-xs font-medium mb-2">
              Primary Action
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">
              var(--brand-primary) #173B57
            </p>
          </div>

          <div className="p-3.5 rounded border border-[var(--state-success-border)] bg-[var(--state-success-bg)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--state-success-text)]">
                color.status.success
              </span>
              <Badge variant="success" size="sm" className="text-[10px]">
                8.7:1 (AAA)
              </Badge>
            </div>
            <div className="h-9 rounded border border-[var(--state-success-border)] bg-[var(--surface-card)] flex items-center justify-center gap-1.5 text-xs font-medium text-[var(--state-success-text)] mb-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--state-success-icon)]" />
              <span>Compliant Run</span>
            </div>
            <p className="text-[11px] text-[var(--state-success-text)] font-mono">
              Text #14532D on Bg #F0FDF4
            </p>
          </div>

          <div className="p-3.5 rounded border border-[var(--state-warning-border)] bg-[var(--state-warning-bg)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--state-warning-text)]">
                color.status.warning
              </span>
              <Badge variant="warning" size="sm" className="text-[10px]">
                8.8:1 (AAA)
              </Badge>
            </div>
            <div className="h-9 rounded border border-[var(--state-warning-border)] bg-[var(--surface-card)] flex items-center justify-center gap-1.5 text-xs font-medium text-[var(--state-warning-text)] mb-2">
              <AlertTriangle className="h-4 w-4 text-[var(--state-warning-icon)]" />
              <span>Quarantine (14 Rows)</span>
            </div>
            <p className="text-[11px] text-[var(--state-warning-text)] font-mono">
              Text #78350F on Bg #FFFBEB
            </p>
          </div>

          <div className="p-3.5 rounded border border-[var(--state-danger-border)] bg-[var(--state-danger-bg)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--state-danger-text)]">
                color.status.error
              </span>
              <Badge variant="danger" size="sm" className="text-[10px]">
                9.2:1 (AAA)
              </Badge>
            </div>
            <div className="h-9 rounded border border-[var(--state-danger-border)] bg-[var(--surface-card)] flex items-center justify-center gap-1.5 text-xs font-medium text-[var(--state-danger-text)] mb-2">
              <AlertOctagon className="h-4 w-4 text-[var(--state-danger-icon)]" />
              <span>Show Cause Breach</span>
            </div>
            <p className="text-[11px] text-[var(--state-danger-text)] font-mono">
              Text #7F1D1D on Bg #FEF2F2
            </p>
          </div>
        </div>

        {/* Secondary semantic row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded border border-[var(--border-default)] bg-[var(--surface-card)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                color.focus.ring
              </span>
              <Badge variant="outline" size="sm" className="text-[10px]">
                5.5:1 (AA)
              </Badge>
            </div>
            <div className="h-9 rounded border-2 border-[var(--focus-ring)] bg-[var(--surface-card)] flex items-center justify-center text-xs font-medium text-[var(--text-primary)] mb-2">
              Teal Focus Indicator
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">
              var(--focus-ring) #0F766E
            </p>
          </div>

          <div className="p-3.5 rounded border border-[var(--border-default)] bg-[var(--surface-card)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                color.semantic.text.primary
              </span>
              <Badge variant="outline" size="sm" className="text-[10px]">
                14.5:1 (AAA)
              </Badge>
            </div>
            <div className="h-9 rounded bg-[var(--surface-card-subdued)] flex items-center px-3 text-xs font-semibold text-[var(--text-primary)] mb-2">
              Primary Body & Headings
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">
              var(--text-primary) #172B3A
            </p>
          </div>

          <div className="p-3.5 rounded border border-[var(--border-default)] bg-[var(--surface-card)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                color.semantic.text.muted
              </span>
              <Badge variant="outline" size="sm" className="text-[10px]">
                5.3:1 (AA)
              </Badge>
            </div>
            <div className="h-9 rounded bg-[var(--surface-card-subdued)] flex items-center px-3 text-xs font-medium text-[var(--text-muted)] mb-2">
              Metadata & Timestamps
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">
              var(--text-muted) #5A6E82
            </p>
          </div>

          <div className="p-3.5 rounded border border-[var(--masked-data-border)] bg-[var(--masked-data-bg)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--masked-data-text)]">
                color.semantic.masked
              </span>
              <Badge variant="masked" size="sm" className="text-[10px]">
                7.5:1 (AAA)
              </Badge>
            </div>
            <div className="h-9 rounded border border-[var(--masked-data-border)] bg-[var(--surface-card)] flex items-center justify-center gap-1.5 text-xs font-mono font-medium text-[var(--masked-data-text)] mb-2">
              <Lock className="h-3.5 w-3.5 text-[var(--masked-data-icon)]" />
              <span>••••-••••-8821</span>
            </div>
            <p className="text-[11px] text-[var(--masked-data-text)] font-mono">
              Identity Vault Pseudonym
            </p>
          </div>
        </div>
      </section>

      {/* 3. Typography Hierarchy */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            3. Typography Hierarchy & Tabular Numerals
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Scale optimized for technical document clarity, legal citations, and
            vertically aligned quota counts.
          </p>
        </div>

        <div className="rounded border border-[var(--border-default)] bg-[var(--surface-card)] p-5 space-y-4">
          <div className="border-b border-[var(--border-subtle)] pb-3">
            <p className="text-xs font-mono text-[var(--text-muted)]">
              font-size-2xl (24px / 700) &bull; Page Titles
            </p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              National Admission Reconciliation Ledger
            </p>
          </div>

          <div className="border-b border-[var(--border-subtle)] pb-3">
            <p className="text-xs font-mono text-[var(--text-muted)]">
              font-size-xl (20px / 600) &bull; Section Headers
            </p>
            <p className="text-xl font-semibold text-[var(--text-primary)]">
              Quarantine Remediation & Exception Scrutiny Queue
            </p>
          </div>

          <div className="border-b border-[var(--border-subtle)] pb-3">
            <p className="text-xs font-mono text-[var(--text-muted)]">
              font-size-lg (18px / 600) &bull; Modal Titles & Card Headers
            </p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              Confirm Statutory Batch Seal & Merkle Digest Generation
            </p>
          </div>

          <div className="border-b border-[var(--border-subtle)] pb-3">
            <p className="text-xs font-mono text-[var(--text-muted)]">
              font-size-base (14px / 400) &bull; Standard Body Copy
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              AIRE evaluates candidate records deterministically against AICTE
              Approval Process Handbook (APH) quota ceilings and state
              counseling authority rosters. Evaluators review evidence traces
              prior to submitting Show Cause notices.
            </p>
          </div>

          <div>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              font-size-mono-sm (13px / Tabular) &bull; Numerical IDs & Digests
            </p>
            <div className="font-mono font-tabular text-xs text-[var(--text-primary)] bg-[var(--surface-card-subdued)] p-3 rounded border border-[var(--border-default)] space-y-1">
              <p>
                Roll No: 2026-CSE-001 &bull; APAAR: ••••-••••-1042 &bull; Quota:
                60/60 &bull; Rank: 001,420
              </p>
              <p>
                Digest: SHA256:
                8f9b2d3e1a0c4f5b6e7d8c9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Spacing Scale */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            4. Spacing & Geometric Scale (4px Base Grid)
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Consistent spacing tokens from{" "}
            <code className="font-mono">spacing.1</code> (4px) to{" "}
            <code className="font-mono">spacing.12</code> (48px).
          </p>
        </div>

        <div className="p-4 rounded border border-[var(--border-default)] bg-[var(--surface-card)]">
          <div className="space-y-2">
            {[
              { token: "space-1", px: "4px" },
              { token: "space-2", px: "8px" },
              { token: "space-3", px: "12px" },
              { token: "space-4", px: "16px" },
              { token: "space-5", px: "20px" },
              { token: "space-6", px: "24px" },
              { token: "space-8", px: "32px" },
              { token: "space-12", px: "48px" },
            ].map((s) => (
              <div key={s.token} className="flex items-center text-xs">
                <span className="w-20 font-mono text-[var(--text-muted)]">
                  {s.token}
                </span>
                <span className="w-16 font-mono font-tabular text-[var(--text-secondary)]">
                  {s.px}
                </span>
                <div
                  className="h-4 bg-[var(--brand-primary)] rounded-sm"
                  style={{ width: s.px }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Buttons & Interactive States */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            5. Buttons & Action Hierarchy
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Strict hierarchy: single solid Navy button per view for primary
            action, subdued outline for secondary, high-friction destructive for
            irreversible steps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive / Show Cause</Button>
          <Button variant="ghost">Ghost Trigger</Button>
          <Button variant="link">Hyperlink Button</Button>
          <Button
            variant="default"
            loading={btnLoading}
            onClick={() => {
              setBtnLoading(true);
              setTimeout(() => setBtnLoading(false), 2000);
            }}
          >
            {btnLoading ? "Processing..." : "Click to Test Loading"}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button size="sm">Small (32px)</Button>
          <Button size="default">Default (36px)</Button>
          <Button size="lg">Large (40px)</Button>
          <Button size="icon" aria-label="Download Evidence">
            <Download className="h-4 w-4" />
          </Button>
          <Button disabled>Disabled Action</Button>
        </div>
      </section>

      {/* 6. Form Controls & Validation Engine */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            6. Accessible Forms & Zod Validation Engine (DD-003)
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Accessible labels, input error borders, aria-invalid attributes, and
            error announcements.
          </p>
        </div>

        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Intake Quota Configuration</CardTitle>
            <CardDescription>
              Demonstrates React Hook Form integration with Zod schema
              resolution, aria-invalid attributes, and accessible error
              announcements.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                id="inst-code"
                label="Institution Code"
                required
                error={errors.institutionCode?.message}
                helperText="Permanent AICTE institution identifier"
              >
                <Input
                  id="inst-code"
                  {...register("institutionCode")}
                  error={!!errors.institutionCode}
                />
              </FormField>

              <FormField
                id="course-quota"
                label="Course Intake Quota"
                required
                error={errors.courseQuota?.message}
                helperText="Approved seats from AICTE Approval Process Handbook"
              >
                <Input
                  id="course-quota"
                  type="number"
                  {...register("courseQuota")}
                  error={!!errors.courseQuota}
                />
              </FormField>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Affiliated University
                </label>
                <Select defaultValue="aktu">
                  <SelectTrigger id="university-select">
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktu">
                      Dr. A.P.J. Abdul Kalam Technical University
                    </SelectItem>
                    <SelectItem value="anna">
                      Anna University, Chennai
                    </SelectItem>
                    <SelectItem value="vtu">
                      Visvesvaraya Technological University
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <FormField
                id="remarks"
                label="Compliance Remarks (Optional)"
                helperText="Notes regarding quota sanctions or council approval orders"
              >
                <Textarea
                  id="remarks"
                  placeholder="Enter remarks..."
                  rows={2}
                  {...register("submissionRemarks")}
                />
              </FormField>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="lateral-entry"
                  checked={switchState}
                  onCheckedChange={setSwitchState}
                />
                <label
                  htmlFor="lateral-entry"
                  className="text-sm font-medium text-[var(--text-primary)] cursor-pointer"
                >
                  Enable Lateral Entry Allocation (+10% Supernumerary)
                </label>
              </div>

              <div className="space-y-1 pt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="attestation"
                    checked={watch("attestationAccepted")}
                    onCheckedChange={(checked) =>
                      setValue("attestationAccepted", Boolean(checked))
                    }
                  />
                  <label
                    htmlFor="attestation"
                    className="text-xs text-[var(--text-secondary)] leading-relaxed cursor-pointer"
                  >
                    I solemnly attest that the quota and admission details
                    comply with AICTE Regulations and statutory admission rules.
                  </label>
                </div>
                {errors.attestationAccepted && (
                  <p
                    role="alert"
                    className="text-xs text-[var(--state-danger-text)] font-medium"
                  >
                    {errors.attestationAccepted.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setValue("courseQuota", 0)}
              >
                Set Invalid Quota (Test Error)
              </Button>
              <Button type="submit">Validate Submission</Button>
            </CardFooter>
          </form>
        </Card>
      </section>

      {/* 7. Alerts & Notification Banners */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            7. Alert Banners & Semantic Statuses
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Never convey status by color alone; every banner pairs an SVG icon
            with explicit textual status explanations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Alert variant="info">
            <Info className="h-4 w-4" />
            <AlertTitle>Intake Calculation Notice</AlertTitle>
            <AlertDescription>
              Approved AICTE intake for AY 2026-27 is locked under Gazette
              Notification AICTE/2026/04.
            </AlertDescription>
          </Alert>

          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Cohort Reconciliation Complete</AlertTitle>
            <AlertDescription>
              All 1,200 admitted records matched against state counseling
              authority records without discrepancies.
            </AlertDescription>
          </Alert>

          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Freeze Window Expiring (48 Hours)</AlertTitle>
            <AlertDescription>
              12 quarantined student records remain unresolved. Mandatory cohort
              sealing deadline: 15 Nov 2026.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertOctagon className="h-4 w-4" />
            <AlertTitle>Show Cause Notice Issued</AlertTitle>
            <AlertDescription>
              Computer Science branch exceeds authorized intake by 8 seats.
              Formal explanation required within 7 days.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* 8. Status Badges */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            8. Badges & Regulatory Outcomes
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            High-contrast badges with icons for clear recognition across dense
            tables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">Default Active</Badge>
          <Badge variant="secondary">Draft Intake</Badge>
          <Badge variant="outline">Unsealed</Badge>
          <Badge variant="success">
            <CheckCircle2 className="w-3 h-3 mr-1 text-[var(--state-success-icon)]" />
            Compliant Run
          </Badge>
          <Badge variant="warning">
            <AlertTriangle className="w-3 h-3 mr-1 text-[var(--state-warning-icon)]" />
            Quarantine (14 Rows)
          </Badge>
          <Badge variant="danger">
            <AlertOctagon className="w-3 h-3 mr-1 text-[var(--state-danger-icon)]" />
            Over-Intake Breach
          </Badge>
          <Badge variant="info">
            <Info className="w-3 h-3 mr-1 text-[var(--state-info-icon)]" />
            Supernumerary Quota
          </Badge>
          <Badge variant="masked">
            <Lock className="w-3 h-3 mr-1 text-[var(--masked-data-icon)]" />
            APAAR: ••••-••••-8821
          </Badge>
        </div>
      </section>

      {/* 9. Modal Dialogs & Menus */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            9. Accessible Modals & Menus (Radix Primitives)
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Accessible focus trapping, keyboard navigation, and Escape
            dismissal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Open Confirmation Dialog Preview
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Seal Admission Cohort</DialogTitle>
                <DialogDescription>
                  This action marks the 2026-27 admission batch as immutable.
                  Once sealed, no modifications to student records can occur
                  without an authorized reopening petition.
                </DialogDescription>
              </DialogHeader>
              <div className="p-3 bg-[var(--surface-card-subdued)] rounded text-xs text-[var(--text-secondary)] border border-[var(--border-default)]">
                <p className="font-semibold text-[var(--text-primary)]">
                  Tamper-Evident Cryptographic Digest
                </p>
                <p className="font-mono mt-1 text-[11px] text-[var(--text-muted)] font-tabular">
                  SHA256:
                  8f9b2d3e1a0c4f5b6e7d8c9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDialogOpen(false)}
                >
                  Confirm & Seal Cohort
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Dropdown Actions Preview</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuLabel>Cohort Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("Export initiated")}>
                <Download className="mr-2 h-4 w-4" />
                <span>Export CSV Ledger</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Audit log opened")}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Audit Trail</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("Re-evaluate triggered")}>
                <RotateCcw className="mr-2 h-4 w-4 text-[var(--state-warning-icon)]" />
                <span>Re-run Quota Pass</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* 10. High-Density Institutional Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-default)] pb-2">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              10. High-Density Institutional Data Table
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Testing{" "}
              {densityMode === "compact"
                ? "36px compact rows"
                : "44px standard rows"}{" "}
              with monospace tabular numerics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">Density:</span>
            <Button
              variant={densityMode === "compact" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setDensityMode("compact")}
            >
              Compact (36px)
            </Button>
            <Button
              variant={densityMode === "standard" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setDensityMode("standard")}
            >
              Standard (44px)
            </Button>
          </div>
        </div>

        <div className="rounded border border-[var(--border-default)] bg-[var(--surface-card)] overflow-x-auto shadow-sm">
          <table
            className={`w-full text-left border-collapse ${
              densityMode === "compact" ? "table-compact" : "table-standard"
            } font-sans`}
          >
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--surface-card-subdued)] text-xs font-semibold text-[var(--text-secondary)]">
                <th className="px-3 py-2">Roll Number</th>
                <th className="px-3 py-2">APAAR ID (Masked)</th>
                <th className="px-3 py-2">Course / Branch</th>
                <th className="px-3 py-2">Quota Category</th>
                <th className="px-3 py-2">Merit Rank</th>
                <th className="px-3 py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
              {[
                {
                  roll: "2026-CSE-001",
                  apaar: "••••-••••-1042",
                  branch: "Computer Science & Engineering",
                  quota: "General / Home State",
                  rank: "1,420",
                  status: "success",
                  statusText: "Reconciled",
                },
                {
                  roll: "2026-CSE-002",
                  apaar: "••••-••••-9821",
                  branch: "Computer Science & Engineering",
                  quota: "OBC-NCL / Supernumerary",
                  rank: "3,812",
                  status: "warning",
                  statusText: "Quarantine (DOB Mismatch)",
                },
                {
                  roll: "2026-ECE-015",
                  apaar: "••••-••••-4109",
                  branch: "Electronics & Communication",
                  quota: "EWS All India",
                  rank: "5,108",
                  status: "success",
                  statusText: "Reconciled",
                },
                {
                  roll: "2026-ME-044",
                  apaar: "••••-••••-7734",
                  branch: "Mechanical Engineering",
                  quota: "Management Quota",
                  rank: "14,920",
                  status: "danger",
                  statusText: "Breach (Exceeds 15% Cap)",
                },
              ].map((row) => (
                <tr
                  key={row.roll}
                  className="hover:bg-[var(--surface-card-subdued)] transition-colors"
                >
                  <td className="px-3 py-2 font-mono font-medium text-[var(--text-primary)] font-tabular">
                    {row.roll}
                  </td>
                  <td className="px-3 py-2 font-mono text-[var(--text-muted)] font-tabular">
                    {row.apaar}
                  </td>
                  <td className="px-3 py-2">{row.branch}</td>
                  <td className="px-3 py-2 text-[var(--text-secondary)]">
                    {row.quota}
                  </td>
                  <td className="px-3 py-2 font-mono font-tabular text-[var(--text-secondary)]">
                    {row.rank}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Badge variant={row.status as any} size="sm">
                      {row.statusText}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 11. Feedback States */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            11. Feedback States (Empty, Loading, Error)
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Deterministic feedback views informing users of state and providing
            clear recovery paths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EmptyState
            title="No Quarantined Records"
            description="All student admission records for this cohort have been verified without discrepancy."
          />
          <LoadingState
            label="Verifying State Counseling Ledger..."
            variant="spinner"
          />
          <ErrorState
            title="State Ledger API Unreachable"
            message="Gateway timed out connecting to DTE portal. Retry in a few moments."
            correlationId="req_9f8a1b2c"
            onRetry={() => alert("Retrying request...")}
          />
        </div>
      </section>
    </div>
  );
};
