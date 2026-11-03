import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  PlayCircle,
  Building2,
  Layers,
  GraduationCap,
  ShieldCheck,
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Send,
  BarChart3,
  Lock,
  SlidersHorizontal,
  History,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-[#245B75]/20 selection:text-[#183B56]">
      {/* 1. Header with UX4G Accessibility Bar & AIRE Navigation */}
      <PublicHeader />

      {/* Main Content Area with Skip Target */}
      <main id="main-content" className="flex-1">
        {/* =========================================================================
            2. HERO SECTION
            ========================================================================= */}
        <section
          id="home"
          className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-[var(--border-default)] bg-gradient-to-b from-white via-white to-[var(--surface-canvas)]"
        >
          {/* Subtle architectural grid pattern background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #183B56 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headline, Description & CTAs */}
              <div className="lg:col-span-6 space-y-6 text-left">
                {/* Official Initiative Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0F7] border border-[#B8D4EA] text-[#0F766E] text-xs font-semibold tracking-wide shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-pulse" />
                  <span>An AICTE Digital Initiative</span>
                </div>

                {/* Primary Editorial Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.18]">
                  Institutional Student Records.{" "}
                  <span className="text-[#0F766E] block sm:inline">
                    Verified with Confidence.
                  </span>
                </h1>

                {/* Value Proposition Subtitle */}
                <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
                  AIRE helps AICTE-approved institutions organize student
                  records, identify data issues, and manage structured
                  submission and verification workflows.
                </p>

                {/* Dual Action CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Link to="/login">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-[#245B75] hover:bg-[#1C4666] text-white font-medium px-6 py-2.5 rounded shadow-sm text-sm inline-flex items-center justify-center gap-2"
                    >
                      <span>Sign in to AIRE</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <a href="#how-it-works">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-[var(--border-default)] hover:bg-[var(--surface-card-subdued)] text-[var(--text-primary)] font-medium px-5 py-2.5 rounded text-sm inline-flex items-center justify-center gap-2 shadow-xs"
                    >
                      <PlayCircle className="w-4 h-4 text-[#245B75]" />
                      <span>How AIRE Works</span>
                    </Button>
                  </a>
                </div>

                {/* Statutory Guarantee Badge */}
                <div className="pt-3 flex items-center gap-6 text-xs text-[var(--text-secondary)] border-t border-[var(--border-subtle)]">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                    <span>AICTE Regulatory Norms</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                    <span>Cryptographic Evidence Logs</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Apple-inspired Application UI Mockup */}
              <div className="lg:col-span-6 relative">
                {/* Decorative Subtle Elevation Shadow */}
                <div
                  className="absolute -inset-2 bg-gradient-to-tr from-[#245B75]/10 to-[#0F766E]/10 rounded-2xl blur-xl -z-10"
                  aria-hidden="true"
                />

                {/* Container Card */}
                <div className="bg-[var(--surface-card)] rounded-xl border border-[var(--border-default)] shadow-xl overflow-hidden">
                  {/* Mock Window Title Bar */}
                  <div className="bg-[#183B56] px-4 py-2.5 flex items-center justify-between text-white border-b border-white/10">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                      <span className="text-xs font-semibold tracking-wide ml-2">
                        AIRE — Institutional Gateway
                      </span>
                    </div>
                    <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded text-white/90 font-mono">
                      v2.4 Live
                    </span>
                  </div>

                  {/* Mock Window Body */}
                  <div className="p-5 space-y-4 bg-gradient-to-b from-white to-[var(--surface-canvas)]">
                    {/* Stepper Progress Bar */}
                    <div className="bg-white rounded-lg p-3 border border-[var(--border-default)] shadow-xs">
                      <div className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                        Submission Overview
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-[#166534] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span>Upload</span>
                        </div>
                        <span className="h-0.5 w-6 bg-[#BBF7D0]" />
                        <div className="flex items-center gap-1 text-[#166534] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span>Validate</span>
                        </div>
                        <span className="h-0.5 w-6 bg-[#BBF7D0]" />
                        <div className="flex items-center gap-1 text-[#245B75] font-semibold">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#245B75] text-white flex items-center justify-center text-[9px]">
                            3
                          </span>
                          <span>Review</span>
                        </div>
                        <span className="h-0.5 w-6 bg-[var(--border-default)]" />
                        <div className="flex items-center gap-1 text-[var(--text-muted)]">
                          <span className="w-3.5 h-3.5 rounded-full border border-[var(--border-default)] flex items-center justify-center text-[9px]">
                            4
                          </span>
                          <span>Submit</span>
                        </div>
                      </div>
                    </div>

                    {/* Simulated Table Checklist */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 bg-white rounded border border-[var(--border-subtle)] text-xs">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-4 h-4 rounded-full bg-[#EAF4ED] text-[#166534] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span className="font-medium text-[var(--text-primary)]">
                            Sanctioned Intake Quota Validation
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-[#166534] bg-[#EAF4ED] px-2 py-0.5 rounded">
                          100% Verified
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-white rounded border border-[var(--border-subtle)] text-xs">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-4 h-4 rounded-full bg-[#EAF4ED] text-[#166534] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span className="font-medium text-[var(--text-primary)]">
                            Duplicate Enrollment Checks (All-India)
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-[#166534] bg-[#EAF4ED] px-2 py-0.5 rounded">
                          Clean
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-white rounded border border-[var(--border-subtle)] text-xs">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-4 h-4 rounded-full bg-[#FFF4E5] text-[#B45309] flex items-center justify-center">
                            <AlertTriangle className="w-2.5 h-2.5" />
                          </div>
                          <span className="font-medium text-[var(--text-primary)]">
                            Lateral Entry & Category Eligibility
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-[#B45309] bg-[#FFF4E5] px-2 py-0.5 rounded">
                          Triage Pending
                        </span>
                      </div>
                    </div>

                    {/* Architectural Facade Vector */}
                    <div className="pt-2 flex items-center justify-center text-[var(--border-strong)] opacity-30">
                      <svg
                        className="w-full h-12"
                        viewBox="0 0 400 40"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M200 4L280 18H120L200 4Z" />
                        <rect x="130" y="20" width="10" height="20" />
                        <rect x="160" y="20" width="10" height="20" />
                        <rect x="195" y="20" width="10" height="20" />
                        <rect x="230" y="20" width="10" height="20" />
                        <rect x="260" y="20" width="10" height="20" />
                        <rect x="100" y="36" width="200" height="4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Pill 1: Records Validated */}
                <div className="absolute -top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-[#BBF7D0] shadow-lg flex items-center space-x-3 transition-transform hover:scale-105 duration-200">
                  <div className="w-9 h-9 rounded-lg bg-[#EAF4ED] text-[#16A34A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-[var(--text-primary)] font-tabular leading-tight">
                      24,860
                    </div>
                    <div className="text-[11px] font-medium text-[#166534]">
                      Records Validated
                    </div>
                  </div>
                </div>

                {/* Floating Metric Pill 2: Issues to Review */}
                <div className="absolute -bottom-4 -left-2 sm:-left-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-[#FDE68A] shadow-lg flex items-center space-x-3 transition-transform hover:scale-105 duration-200">
                  <div className="w-9 h-9 rounded-lg bg-[#FFF4E5] text-[#D97706] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-[var(--text-primary)] font-tabular leading-tight">
                      128
                    </div>
                    <div className="text-[11px] font-medium text-[#B45309]">
                      Issues to Review
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. PERSONA-BASED PORTALS (UX4G ROLE CARDS)
            ========================================================================= */}
        <section
          className="py-10 bg-[var(--surface-canvas)] border-b border-[var(--border-default)]"
          aria-label="User Portals"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Portal 1: Institutions */}
              <Link
                to="/login"
                className="group bg-white rounded-xl p-4 border border-[var(--border-default)] shadow-xs hover:shadow-md hover:border-[#245B75]/40 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#E8F0F7] text-[#245B75] flex items-center justify-center shrink-0 group-hover:bg-[#245B75] group-hover:text-white transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#245B75] transition-colors">
                      For Institutions
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Upload, validate and submit student records
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-[var(--surface-card-subdued)] text-[var(--text-secondary)] flex items-center justify-center group-hover:bg-[#245B75] group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Portal 2: AICTE Reviewers */}
              <Link
                to="/login"
                className="group bg-white rounded-xl p-4 border border-[var(--border-default)] shadow-xs hover:shadow-md hover:border-[#245B75]/40 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#E8F0F7] text-[#245B75] flex items-center justify-center shrink-0 group-hover:bg-[#245B75] group-hover:text-white transition-colors">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#245B75] transition-colors">
                      For AICTE Reviewers
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Review submissions and manage verification
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-[var(--surface-card-subdued)] text-[var(--text-secondary)] flex items-center justify-center group-hover:bg-[#245B75] group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Portal 3: Students */}
              <Link
                to="/login"
                className="group bg-white rounded-xl p-4 border border-[var(--border-default)] shadow-xs hover:shadow-md hover:border-[#245B75]/40 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#E8F0F7] text-[#245B75] flex items-center justify-center shrink-0 group-hover:bg-[#245B75] group-hover:text-white transition-colors">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#245B75] transition-colors">
                      For Students
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      View your academic record and verification status
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-[var(--surface-card-subdued)] text-[var(--text-secondary)] flex items-center justify-center group-hover:bg-[#245B75] group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Portal 4: Auditors */}
              <Link
                to="/login"
                className="group bg-white rounded-xl p-4 border border-[var(--border-default)] shadow-xs hover:shadow-md hover:border-[#245B75]/40 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#E8F0F7] text-[#245B75] flex items-center justify-center shrink-0 group-hover:bg-[#245B75] group-hover:text-white transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#245B75] transition-colors">
                      For Auditors
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Access audit logs and activity trail
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-[var(--surface-card-subdued)] text-[var(--text-secondary)] flex items-center justify-center group-hover:bg-[#245B75] group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. STRUCTURED 6-STEP VERIFICATION PROCESS (NN/g MENTAL MODEL)
            ========================================================================= */}
        <section
          id="how-it-works"
          className="py-16 md:py-20 bg-white border-b border-[var(--border-default)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] font-sans">
                A clear and structured verification process
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)]">
                From record preparation to verification, AIRE simplifies the
                entire journey for institutions.
              </p>
            </div>

            {/* 6 Linear Connected Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-4 bg-[var(--surface-canvas)] rounded-xl border border-[var(--border-default)] shadow-xs relative">
                <div className="w-12 h-12 rounded-full bg-white border border-[var(--border-default)] text-[#245B75] flex items-center justify-center shadow-xs mb-3.5">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  1. Prepare Records
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  Organize student data as per prescribed format
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-4 bg-[var(--surface-canvas)] rounded-xl border border-[var(--border-default)] shadow-xs relative">
                <div className="w-12 h-12 rounded-full bg-white border border-[var(--border-default)] text-[#245B75] flex items-center justify-center shadow-xs mb-3.5">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  2. Upload a Batch
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  Submit records securely in bulk
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-4 bg-[var(--surface-canvas)] rounded-xl border border-[var(--border-default)] shadow-xs relative">
                <div className="w-12 h-12 rounded-full bg-[#EAF4ED] border border-[#BBF7D0] text-[#16A34A] flex items-center justify-center shadow-xs mb-3.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  3. Validate Data
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  Automated checks for duplicates and inconsistencies
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center p-4 bg-[var(--surface-canvas)] rounded-xl border border-[var(--border-default)] shadow-xs relative">
                <div className="w-12 h-12 rounded-full bg-[#FFF4E5] border border-[#FDE68A] text-[#D97706] flex items-center justify-center shadow-xs mb-3.5">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  4. Review Issues
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  Triage and resolve validation findings
                </p>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center p-4 bg-[var(--surface-canvas)] rounded-xl border border-[var(--border-default)] shadow-xs relative">
                <div className="w-12 h-12 rounded-full bg-white border border-[var(--border-default)] text-[#245B75] flex items-center justify-center shadow-xs mb-3.5">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  5. Submit Records
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  Send the verified batch for AICTE review
                </p>
              </div>

              {/* Step 6 */}
              <div className="flex flex-col items-center text-center p-4 bg-[var(--surface-canvas)] rounded-xl border border-[var(--border-default)] shadow-xs relative">
                <div className="w-12 h-12 rounded-full bg-white border border-[var(--border-default)] text-[#245B75] flex items-center justify-center shadow-xs mb-3.5">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  6. Track Status
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  Monitor review and verification progress
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. "WHY USE AIRE?" VALUE PROPOSITION SECTION
            ========================================================================= */}
        <section
          id="why-aire"
          className="py-14 md:py-18 bg-[var(--surface-canvas)] border-b border-[var(--border-default)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-[var(--border-default)] shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Heading / Summary */}
                <div className="lg:col-span-4 space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                    Why use AIRE?
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    A secure, consistent and auditable platform for
                    institutional student record management.
                  </p>
                </div>

                {/* 5 Distinct Feature Items */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Pillar 1 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[#0F766E]">
                      <ShieldCheck className="w-5 h-5 shrink-0" />
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        Accurate & Compliant
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Validates records against statutory AICTE intake and
                      approval norms.
                    </p>
                  </div>

                  {/* Pillar 2 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[#245B75]">
                      <Layers className="w-5 h-5 shrink-0" />
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        Detects Data Issues
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Identifies duplicates, invalid roll numbers, and anomalies
                      early.
                    </p>
                  </div>

                  {/* Pillar 3 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[#245B75]">
                      <SlidersHorizontal className="w-5 h-5 shrink-0" />
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        Streamlined Workflow
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      From upload to verification in a structured, transparent
                      linear flow.
                    </p>
                  </div>

                  {/* Pillar 4 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[#245B75]">
                      <History className="w-5 h-5 shrink-0" />
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        Transparency & Traceability
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Cryptographic digests and complete immutable audit trails.
                    </p>
                  </div>

                  {/* Pillar 5 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[#245B75]">
                      <Lock className="w-5 h-5 shrink-0" />
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        Role-based Access
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Strict PostgreSQL RLS and purpose-bound access controls.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. PRE-FOOTER CALL TO ACTION BANNER
            ========================================================================= */}
        <section className="py-12 md:py-16 bg-[var(--surface-canvas)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl bg-gradient-to-r from-[#183B56] via-[#1E4A6D] to-[#245B75] text-white p-8 md:p-12 shadow-lg overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Background architectural watermark */}
              <div
                className="absolute right-0 bottom-0 opacity-10 pointer-events-none w-96 h-96 -mr-16 -mb-16"
                aria-hidden="true"
              >
                <Building2 className="w-full h-full text-white" />
              </div>

              {/* Text content */}
              <div className="space-y-2 max-w-2xl relative z-10 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
                  Get started with AIRE
                </h2>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                  Sign in with your institutional or authorized account to
                  manage, verify, and track student records.
                </p>
              </div>

              {/* Call to action button */}
              <div className="relative z-10 shrink-0 w-full md:w-auto">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="w-full md:w-auto bg-white hover:bg-white/90 text-[#183B56] font-bold px-7 py-3 rounded shadow-md text-sm inline-flex items-center justify-center gap-2"
                  >
                    <span>Sign in to AIRE</span>
                    <ArrowRight className="w-4 h-4 text-[#183B56]" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Public Statutory Footer */}
      <PublicFooter />
    </div>
  );
};
