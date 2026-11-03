import React, { useState } from "react";
import {
  AireButton,
  AireBadge,
  AireAlert,
  AireInput,
  AireCard,
  AireCardHeader,
  AireCardTitle,
  AireCardBody,
  AireCardFooter,
  AireBreadcrumbs,
  AireStatusIndicator,
  AireAccordion,
} from "../components/aire";
import { AireHeroIllustration } from "../components/aire/AireHeroIllustration";
import { AireSecurityIllustration } from "../components/aire/AireSecurityIllustration";
import {
  ShieldCheck,
  Search,
  Mail,
  Lock,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export const VisualFoundationPreview: React.FC = () => {
  const [inputVal, setInputVal] = useState("inst-aicte-9024");
  const [hasError, setHasError] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans selection:bg-brand-50 selection:text-brand-primary pb-24">
      {/* 1. Governance & Inspection Header */}
      <header className="bg-brand-950 text-neutral-0 border-b border-brand-900 px-6 py-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-teal-800 bg-teal-50/10 px-2 py-0.5 rounded">
                design.md v1.0 Authority
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-brass-800 bg-brass-50/10 px-2 py-0.5 rounded">
                UX4G 3.0.2 Confirmed
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 border border-neutral-600 px-2 py-0.5 rounded">
                Anti-Slop Active (During)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white m-0">
              AIRE Visual Foundation & Design Token Preview
            </h1>
            <p className="text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Mandatory frontend governance specification verification: semantic token cascade, UX4G 3.0 component abstractions, original editorial SVG vectors, restrained glassmorphism, and WCAG 2.1/2.2 AA accessibility guardrails.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="ux4g-btn-outline-neutral text-xs text-white border border-neutral-600 hover:bg-neutral-800/80 px-4 py-2 rounded-control inline-flex items-center gap-1.5 transition-colors"
            >
              ← Back to Public Portal
            </a>
          </div>
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 mt-10 space-y-16">
        {/* SECTION 1: BREADCRUMBS & CONTEXT */}
        <section aria-labelledby="section-nav" className="space-y-4">
          <div className="border-b border-neutral-200 pb-2">
            <h2 id="section-nav" className="text-lg font-semibold text-brand-950">
              1. Institutional Navigation & Breadcrumbs
            </h2>
            <p className="text-xs text-neutral-600">
              Documented UX4G 3.0 breadcrumb divider pattern (<code className="text-brand-primary">ux4g-breadcrumb ux4g-breadcrumb-divider</code>) with explicit current page state.
            </p>
          </div>

          <div className="bg-neutral-0 p-5 rounded-card border border-neutral-200 shadow-xs">
            <AireBreadcrumbs
              items={[
                { label: "Government of India", href: "#" },
                { label: "Technical Education Regulatory Portal", href: "#" },
                { label: "Institution Roster Review", href: "#" },
                { label: "Batch 2026-IN-094 Discrepancy Triage", current: true },
              ]}
            />
          </div>
        </section>

        {/* SECTION 2: COLOR PALETTE SPECIFICATION */}
        <section aria-labelledby="section-palette" className="space-y-6">
          <div className="border-b border-neutral-200 pb-2">
            <h2 id="section-palette" className="text-lg font-semibold text-brand-950">
              2. Semantic AIRE Colour System & UX4G Cascade (design.md §4)
            </h2>
            <p className="text-xs text-neutral-600">
              Calculated WCAG relative-luminance contrast guardrails: normal text &gt;= 4.5:1, large text &gt;= 3:1, non-text controls &gt;= 3:1. Primary interaction led by action blue (<code className="text-brand-primary">#24536F</code>) rather than default UX4G purple.
            </p>
          </div>

          {/* Core Brand Group */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase text-neutral-600 tracking-wider mb-3">
              A. Core Brand Tokens
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { token: "aire-brand-950", hex: "#142C3D", role: "Deep ink navy", contrast: "14.4:1 on white" },
                { token: "aire-brand-900", hex: "#19384E", role: "Institutional navy", contrast: "11.2:1 on white" },
                { token: "aire-brand-800", hex: "#24536F", role: "Primary action blue", contrast: "8.26:1 on white" },
                { token: "aire-brand-700", hex: "#2B6685", role: "Supporting blue", contrast: "6.3:1 on white" },
                { token: "aire-teal-800", hex: "#075E58", role: "Deep teal accent", contrast: "7.63:1 on white" },
                { token: "aire-brass-800", hex: "#8B4F16", role: "Muted warm accent", contrast: "6.51:1 on white" },
              ].map((c) => (
                <div key={c.token} className="bg-neutral-0 rounded-card border border-neutral-200 overflow-hidden shadow-xs">
                  <div className="h-16 w-full" style={{ backgroundColor: c.hex }} />
                  <div className="p-3 text-xs">
                    <p className="font-semibold text-neutral-800 m-0">{c.token}</p>
                    <p className="font-mono text-neutral-600 text-[11px] mt-0.5">{c.hex}</p>
                    <p className="text-neutral-600 text-[10px] mt-1">{c.role}</p>
                    <span className="inline-block mt-1.5 text-[9px] font-mono text-state-success bg-state-success-bg px-1.5 py-0.5 rounded">
                      {c.contrast}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Neutral & Canvas Group */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase text-neutral-600 tracking-wider mb-3">
              B. Neutral Surfaces & Text Hierarchy
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { token: "aire-neutral-0", hex: "#FFFFFF", role: "Content Surface (White)" },
                { token: "aire-neutral-50", hex: "#F5F7F7", role: "Canvas Public Background" },
                { token: "aire-neutral-100", hex: "#EEF3F3", role: "Subdued Inset & Table Header" },
                { token: "aire-neutral-200", hex: "#D8E0E3", role: "Default Component Border" },
                { token: "aire-neutral-800", hex: "#1D2935", role: "Primary Text (13.7:1)" },
              ].map((c) => (
                <div key={c.token} className="bg-neutral-0 rounded-card border border-neutral-200 overflow-hidden shadow-xs">
                  <div className="h-12 w-full border-b border-neutral-150" style={{ backgroundColor: c.hex }} />
                  <div className="p-2.5 text-xs">
                    <p className="font-semibold text-neutral-800 m-0">{c.token}</p>
                    <p className="font-mono text-neutral-600 text-[11px]">{c.hex}</p>
                    <p className="text-neutral-600 text-[10px] mt-0.5">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic State Colours */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase text-neutral-600 tracking-wider mb-3">
              C. Semantic Status Tokens (Function Only — Never Decorative)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { name: "Success", text: "#176B45", bg: "#E7F2EC", border: "#B7DEC8", ratio: "5.68:1", desc: "Completed / Sealed" },
                { name: "Warning", text: "#8A4D0A", bg: "#F8F0E5", border: "#F2D8B3", ratio: "5.91:1", desc: "Quarantined / Non-blocking" },
                { name: "Error", text: "#B42318", bg: "#FCEDEB", border: "#F9C3BE", ratio: "5.78:1", desc: "Quota Breach / Failure" },
                { name: "Info", text: "#245B78", bg: "#EAF1F5", border: "#BDD5E1", ratio: "6.47:1", desc: "Guidance Notice" },
                { name: "Pending", text: "#536474", bg: "#EEF3F3", border: "#D8E0E3", ratio: "6.10:1", desc: "Queued / Staged" },
              ].map((s) => (
                <div
                  key={s.name}
                  className="rounded-card border p-3 flex flex-col justify-between"
                  style={{ backgroundColor: s.bg, borderColor: s.border }}
                >
                  <div>
                    <span className="text-xs font-bold" style={{ color: s.text }}>
                      {s.name}
                    </span>
                    <p className="text-[11px] text-neutral-800 mt-1 leading-snug">{s.desc}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] font-mono" style={{ color: s.text }}>
                    <span>{s.text}</span>
                    <span>{s.ratio}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: TYPOGRAPHY SCALE */}
        <section aria-labelledby="section-typography" className="space-y-4">
          <div className="border-b border-neutral-200 pb-2">
            <h2 id="section-typography" className="text-lg font-semibold text-brand-950">
              3. Noto Sans Typographic Scale & Editorial Hierarchy (design.md §5)
            </h2>
            <p className="text-xs text-neutral-600">
              Documented UX4G typography baseline: Noto Sans with system fallbacks. Line lengths calibrated for 55–75 characters per line on desktop. No 10–11px text used for important metadata.
            </p>
          </div>

          <div className="bg-neutral-0 rounded-card border border-neutral-200 p-6 space-y-6 shadow-xs">
            <div className="border-b border-neutral-150 pb-4">
              <span className="text-xs font-mono text-neutral-600 block mb-1">Display (52px / 600) — Public Hero Only</span>
              <p className="text-4xl sm:text-5xl font-semibold tracking-tight text-brand-950 leading-tight m-0">
                Student records. Verified with confidence.
              </p>
            </div>

            <div className="border-b border-neutral-150 pb-4">
              <span className="text-xs font-mono text-neutral-600 block mb-1">H1 Page Title (36px / 600)</span>
              <h1 className="text-3xl font-semibold text-brand-950 m-0">
                Institutional Admission Reconciliation Dossier
              </h1>
            </div>

            <div className="border-b border-neutral-150 pb-4">
              <span className="text-xs font-mono text-neutral-600 block mb-1">H2 Major Section (28px / 600)</span>
              <h2 className="text-2xl font-semibold text-brand-950 m-0">
                Deterministic Policy Evaluation & Quota Scrutiny
              </h2>
            </div>

            <div className="border-b border-neutral-150 pb-4">
              <span className="text-xs font-mono text-neutral-600 block mb-1">H3 Subsection (22px / 600)</span>
              <h3 className="text-xl font-semibold text-brand-950 m-0">
                Quarantined Discrepancy Cohort Summary
              </h3>
            </div>

            <div className="border-b border-neutral-150 pb-4">
              <span className="text-xs font-mono text-neutral-600 block mb-1">Lead Copy Body-LG (18px / 1.6 / 400)</span>
              <p className="text-lg text-neutral-600 leading-relaxed max-w-3xl m-0">
                AIRE operates as an authoritative multi-tenant verification engine for technical institutions. Student intake records are reconciled against sanctioned statutory quotas using reproducible deterministic rules with zero plaintext PII exposure.
              </p>
            </div>

            <div>
              <span className="text-xs font-mono text-neutral-600 block mb-1">Body Text (16px / 1.6 / 400)</span>
              <p className="text-base text-neutral-800 leading-relaxed max-w-3xl m-0">
                Every admission roster submitted by an institution passes through pre-flight schema staging, deterministic multi-pass rule evaluation, and cryptographic hashing before a statutory seal is committed. Quarantined records require formal human remediation by designated authorities.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: BUTTON MATRIX */}
        <section aria-labelledby="section-buttons" className="space-y-4">
          <div className="border-b border-neutral-200 pb-2">
            <h2 id="section-buttons" className="text-lg font-semibold text-brand-950">
              4. UX4G 3.0 Button Abstraction (<code className="text-brand-primary">AireButton</code>)
            </h2>
            <p className="text-xs text-neutral-600">
              Documented UX4G 3.0 classes (<code className="text-brand-primary">ux4g-btn-primary</code>, <code className="text-brand-primary">ux4g-btn-outline-primary</code>, <code className="text-brand-primary">ux4g-btn-tonal-primary</code>, <code className="text-brand-primary">ux4g-btn-s</code>, <code className="text-brand-primary">ux4g-btn-m</code>). All standard buttons enforce &gt;= 44px minimum height for WCAG 2.2 AA touch target compliance.
            </p>
          </div>

          <div className="bg-neutral-0 rounded-card border border-neutral-200 p-6 space-y-6 shadow-xs">
            {/* Variant Rows */}
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase text-neutral-600 mb-3">
                Variants (Default Size: Medium 44px)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <AireButton variant="primary">Primary Action</AireButton>
                <AireButton variant="outline-primary">Outline Primary</AireButton>
                <AireButton variant="secondary">Outline Neutral</AireButton>
                <AireButton variant="tonal-primary">Tonal Primary</AireButton>
                <AireButton variant="text-primary">Text Primary</AireButton>
                <AireButton variant="danger">Destructive Action</AireButton>
              </div>
            </div>

            {/* Size Scale */}
            <div className="border-t border-neutral-150 pt-4">
              <h3 className="text-xs font-mono font-semibold uppercase text-neutral-600 mb-3">
                Size Scale (Documented UX4G s, m, l)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <AireButton size="sm" variant="secondary">Small (36px min-h)</AireButton>
                <AireButton size="md" variant="primary">Medium Default (44px min-h)</AireButton>
                <AireButton size="lg" variant="primary">Large Hero (48px min-h)</AireButton>
              </div>
            </div>

            {/* Interactive States */}
            <div className="border-t border-neutral-150 pt-4">
              <h3 className="text-xs font-mono font-semibold uppercase text-neutral-600 mb-3">
                Interactive States (Disabled, Loading, Icon-Enhanced)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <AireButton variant="primary" disabled>
                  Disabled Primary
                </AireButton>
                <AireButton variant="secondary" disabled>
                  Disabled Outline
                </AireButton>
                <AireButton
                  variant="primary"
                  loading={btnLoading}
                  onClick={() => {
                    setBtnLoading(true);
                    setTimeout(() => setBtnLoading(false), 2000);
                  }}
                >
                  {btnLoading ? "Processing Proof..." : "Click to Test Loading"}
                </AireButton>
                <AireButton
                  variant="primary"
                  icon={<ShieldCheck className="w-4 h-4" />}
                >
                  Verified Submission
                </AireButton>
                <AireButton
                  variant="outline-primary"
                  icon={<ExternalLink className="w-4 h-4" />}
                >
                  Institutional Guidelines
                </AireButton>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: FORM FIELDS & INPUT CONTROLS */}
        <section aria-labelledby="section-forms" className="space-y-4">
          <div className="border-b border-neutral-200 pb-2">
            <h2 id="section-forms" className="text-lg font-semibold text-brand-950">
              5. Accessible Form Controls (<code className="text-brand-primary">AireInput</code>)
            </h2>
            <p className="text-xs text-neutral-600">
              Adheres to UX4G 3.0 form field conventions (<code className="text-brand-primary">ux4g-input-container</code>, <code className="text-brand-primary">ux4g-input-helper</code>). Inputs maintain explicit label association, accessible error announcements (<code className="text-brand-primary">role="alert"</code>), and focus visibility.
            </p>
          </div>

          <div className="bg-neutral-0 rounded-card border border-neutral-200 p-6 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <AireInput
                label="Institution Permanent AICTE Code"
                required
                startIcon={<Search className="w-4 h-4" />}
                placeholder="e.g. 1-10928374"
                helperText="Permanent identifier assigned by the Approval Bureau"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />

              <AireInput
                label="Registrar Institutional Email"
                required
                type="email"
                startIcon={<Mail className="w-4 h-4" />}
                placeholder="registrar@institution.edu.in"
                helperText="Must match institution registrar domain on file"
              />

              <AireInput
                label="Sanctioned Intake Batch Password"
                type="password"
                required
                startIcon={<Lock className="w-4 h-4" />}
                placeholder="••••••••••••"
                errorMessage={hasError ? "Security passphrase is required for dual-auth signing" : undefined}
                helperText="Encrypted locally before cryptographic digest generation"
              />

              <div className="flex flex-col justify-end gap-2">
                <AireButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setHasError(!hasError)}
                >
                  Toggle Error State Demonstration
                </AireButton>
                <p className="text-[11px] text-neutral-600">
                  Current state: <strong className={hasError ? "text-state-error" : "text-state-success"}>{hasError ? "Validation Error" : "Normal"}</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: ALERTS & SYSTEM FEEDBACK */}
        <section aria-labelledby="section-alerts" className="space-y-4">
          <div className="border-b border-neutral-200 pb-2">
            <h2 id="section-alerts" className="text-lg font-semibold text-brand-950">
              6. Contextual Alerts & System Notices (<code className="text-brand-primary">AireAlert</code>)
            </h2>
            <p className="text-xs text-neutral-600">
              Adheres to UX4G 3.0 alert patterns (<code className="text-brand-primary">ux4g-alert ux4g-alert-info/success/warning/error</code>). High-contrast backgrounds meet WCAG 2.1 AA against canvas. Includes screen-reader announcements.
            </p>
          </div>

          <div className="space-y-3 max-w-4xl">
            <AireAlert
              variant="info"
              title="Statutory Admission Cycle Active"
            >
              Academic Year 2026–27 intake reconciliation window is open. Roster uploads must be submitted before October 31, 23:59 IST.
            </AireAlert>

            <AireAlert
              variant="success"
              title="Batch Integrity Verified"
            >
              Roster #2026-B1 cryptographic Merkle digest computed: <code className="font-mono text-xs">4f9b...8e11</code>. Zero quota violations detected.
            </AireAlert>

            <AireAlert
              variant="warning"
              title="Supernumerary Quota Nearing Threshold"
            >
              Institution has utilized 92% of sanctioned TFW (Tuition Fee Waiver) seats. Additional admissions will trigger an automatic quarantine.
            </AireAlert>

            {!alertDismissed ? (
              <AireAlert
                variant="error"
                title="Intake Limit Exceeded (Blocking Discrepancy)"
                dismissible
                onDismiss={() => setAlertDismissed(true)}
              >
                Computer Science & Engineering intake of 124 students exceeds AICTE approved limit of 120. Statutory seal locked until remediated.
              </AireAlert>
            ) : (
              <div className="p-3 bg-neutral-100 rounded-card text-xs text-neutral-600 flex items-center justify-between">
                <span>Alert was dismissed by user.</span>
                <AireButton variant="text-primary" size="sm" onClick={() => setAlertDismissed(false)}>
                  Restore Alert
                </AireButton>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 7: INSTITUTIONAL ADMISSION STATUS INDICATORS */}
        <section aria-labelledby="section-status" className="space-y-4">
          <div className="border-b border-neutral-200 pb-2">
            <h2 id="section-status" className="text-lg font-semibold text-brand-950">
              7. Institutional Admission Lifecycle Statuses (<code className="text-brand-primary">AireStatusIndicator</code>)
            </h2>
            <p className="text-xs text-neutral-600">
              Mandatory domain compliance (design.md §1.1 & §4.4): every status explicitly distinguishes Uploaded, Ingested, Staged, Quarantined, Sealed, Reconciled, and Approved. State is <strong>never communicated by colour alone</strong>; each has a clear text label and distinct icon.
            </p>
          </div>

          <div className="bg-neutral-0 rounded-card border border-neutral-200 p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "UPLOADED",
                "INGESTED",
                "STAGED",
                "QUARANTINED",
                "SEALED",
                "RECONCILED",
                "APPROVED",
              ].map((status) => (
                <div key={status} className="p-3.5 rounded-card border border-neutral-200 bg-neutral-50/50 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <AireStatusIndicator status={status as any} />
                    <span className="text-[10px] font-mono text-neutral-600">STATE</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-snug m-0">
                    {status === "UPLOADED" && "Intake file received; raw payload held in secure staging."}
                    {status === "INGESTED" && "Schema normalized; mapped into institutional schema."}
                    {status === "STAGED" && "Held in tenant partition; queued for deterministic engine."}
                    {status === "QUARANTINED" && "Quota breach or invalid APAAR id detected. Remediation needed."}
                    {status === "SEALED" && "Statutory seal committed by Registrar with SHA-256 digest."}
                    {status === "RECONCILED" && "Zero discrepancy verified against approved intake limits."}
                    {status === "APPROVED" && "Council Regulatory Authority formal endorsement complete."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8: CARDS & CONTROLLED GLASSMORPHISM */}
        <section aria-labelledby="section-cards" className="space-y-4">
          <div className="border-b border-neutral-200 pb-2">
            <h2 id="section-cards" className="text-lg font-semibold text-brand-950">
              8. Card Abstraction & Restrained Glassmorphism (design.md §7)
            </h2>
            <p className="text-xs text-neutral-600">
              <strong>Anti-Slop Hard Rule:</strong> The default AIRE card is a solid white surface with a neutral border—not a floating glass panel. Glassmorphism is demonstrated here only as a <em>restrained illustrative accent layer</em> with &gt;= 92% opacity, 12px blur, and solid fallback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard Solid Card (Default) */}
            <AireCard variant="solid">
              <AireCardHeader>
                <AireCardTitle>Default Institutional Card</AireCardTitle>
                <AireBadge variant="neutral" size="sm">Solid Surface</AireBadge>
              </AireCardHeader>
              <AireCardBody>
                Standard production container for forms, tables, and workflows. Neutral white canvas (<code className="text-xs">#FFFFFF</code>) with a crisp 1px neutral-200 border (<code className="text-xs">#D8E0E3</code>) and zero decorative glow.
              </AireCardBody>
              <AireCardFooter>
                <span>Default AIRE Geometry</span>
                <span className="font-mono text-neutral-600">10px Radius</span>
              </AireCardFooter>
            </AireCard>

            {/* Outline Card */}
            <AireCard variant="outline">
              <AireCardHeader>
                <AireCardTitle>Structural Outline Card</AireCardTitle>
                <AireBadge variant="brand" size="sm">Secondary</AireBadge>
              </AireCardHeader>
              <AireCardBody>
                Used for secondary grouping or inset workbench zones. Transparent background with structural boundary, allowing page canvas (<code className="text-xs">#F5F7F7</code>) to show through cleanly.
              </AireCardBody>
              <AireCardFooter>
                <span>Secondary Container</span>
                <span className="font-mono text-neutral-600">Zero Elevation</span>
              </AireCardFooter>
            </AireCard>

            {/* Controlled Glassmorphic Layer (Permitted only in illustrative/hero layers) */}
            <div className="relative p-1 rounded-card bg-gradient-to-br from-brand-50 via-teal-50 to-neutral-100">
              <AireCard variant="glass" className="h-full">
                <AireCardHeader>
                  <AireCardTitle className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-800" />
                    Restrained Glass Layer
                  </AireCardTitle>
                  <AireBadge variant="teal" size="sm">Illustrative Only</AireBadge>
                </AireCardHeader>
                <AireCardBody>
                  Complies strictly with <strong>design.md §7</strong>: near-opaque surface (92% opacity), 12px blur, crisp neutral border, readable contrast, and solid-surface fallback when unsupported. Never applied globally to standard forms or tables.
                </AireCardBody>
                <AireCardFooter>
                  <span className="text-teal-800 font-semibold">92% Opacity / 12px Blur</span>
                  <span className="font-mono text-neutral-600">No Neon Glow</span>
                </AireCardFooter>
              </AireCard>
            </div>
          </div>
        </section>

        {/* SECTION 9: ACCORDION PATTERN */}
        <section aria-labelledby="section-accordion" className="space-y-4">
          <div className="border-b border-neutral-200 pb-2">
            <h2 id="section-accordion" className="text-lg font-semibold text-brand-950">
              9. Accessible Accordion Pattern (<code className="text-brand-primary">AireAccordion</code>)
            </h2>
            <p className="text-xs text-neutral-600">
              Official UX4G 3.0 accordion classes (<code className="text-brand-primary">ux4g-accordion ux4g-accordion-bordered ux4g-accordion-arrow-right</code>) with keyboard operability, ARIA expanded state, and clear statutory content.
            </p>
          </div>

          <div className="max-w-4xl">
            <AireAccordion
              items={[
                {
                  id: "acc-1",
                  question: "What is the distinction between Schema Staging and Regulatory Approval?",
                  answer: "Schema Staging verifies syntactic file integrity, column mapping, and field validity upon initial CSV upload. Regulatory Approval is a separate, statutory milestone granted only after deterministic reconciliation against AICTE sanctioned intake limits with dual authority sign-off.",
                },
                {
                  id: "acc-2",
                  question: "How does AIRE safeguard student PII and enforce Data Minimization?",
                  answer: "AIRE utilizes a dedicated Identity Vault where sensitive student attributes (such as Aadhaar or direct personal contact data) are transformed into irreversible cryptographic tokens. The admission reconciliation ledger operates exclusively on tokenized identifiers, preventing plaintext PII leakage across institutional boundaries.",
                },
              ]}
            />
          </div>
        </section>

        {/* SECTION 10: ORIGINAL EDITORIAL SVG VECTOR ARTWORK */}
        <section aria-labelledby="section-artwork" className="space-y-6">
          <div className="border-b border-neutral-200 pb-2">
            <h2 id="section-artwork" className="text-lg font-semibold text-brand-950">
              10. Original Editorial SVG Artwork (design.md §8 & Anti-Slop Policy)
            </h2>
            <p className="text-xs text-neutral-600">
              <strong>Strict Anti-AI-Slop Governance:</strong> No generic 3D floating cubes, random purple blobs, fabricated SaaS dashboards, or stock illustration people. Pure, mathematically authored SVG vectors using AIRE tokens.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Vector Scene A: Hero Admission Reconciliation Ledger */}
            <div className="bg-neutral-0 p-6 rounded-card border border-neutral-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-150 pb-3">
                <div>
                  <h3 className="text-base font-semibold text-brand-950 m-0">
                    Scene A: Institutional Admission Ledger Pipeline
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Layered ledger sheets, verification node, and restrained glassmorphic evidence badge.
                  </p>
                </div>
                <AireBadge variant="brand" size="sm">Hero Scene</AireBadge>
              </div>

              <div className="bg-neutral-50 p-4 rounded-card border border-neutral-200 overflow-hidden">
                <AireHeroIllustration />
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed pt-2">
                Features structured tabular rows (<code className="font-mono text-xs">VALID</code>, <code className="font-mono text-xs">TRIAGE</code>, <code className="font-mono text-xs">QUEUED</code>), connected verification gateway, and live Merkle root digest without fictitious statistics.
              </p>
            </div>

            {/* Vector Scene B: Security Architecture & Tenant Isolation */}
            <div className="bg-neutral-0 p-6 rounded-card border border-neutral-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-150 pb-3">
                <div>
                  <h3 className="text-base font-semibold text-brand-950 m-0">
                    Scene B: Security & Multi-Tenant Architecture
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    PostgreSQL Forced RLS, Identity Vault, and append-only tamper-evident audit ledger.
                  </p>
                </div>
                <AireBadge variant="teal" size="sm">Architecture</AireBadge>
              </div>

              <div className="bg-neutral-50 p-4 rounded-card border border-neutral-200 overflow-hidden">
                <AireSecurityIllustration />
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed pt-2">
                Demonstrates institutional tenant isolation (<code className="font-mono text-xs">TENANT: 1-10928</code> vs <code className="font-mono text-xs">TENANT: 1-84912</code>), PII tokenization vault, and chronological append-only audit trail nodes.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Statutory Footer Indicator */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-12 mt-16 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-600 gap-4">
        <p className="m-0">
          AIRE Platform • Design System Foundation • Compliant with UX4G 3.0 & WCAG 2.1/2.2 Level AA
        </p>
        <div className="flex items-center gap-4">
          <a href="/" className="text-brand-primary hover:underline font-medium">
            View Public Portal
          </a>
          <span>•</span>
          <span className="font-mono">Token Build: Synchronized</span>
        </div>
      </footer>
    </div>
  );
};
