import React from "react";
import { Container } from "./Container";

export const AireFooter: React.FC = () => {
  return (
    <footer
      id="footer"
      className="bg-[#0B1120] text-white pt-16 pb-12 border-t border-[#1E293B]"
    >
      <Container>
        {/* Top Section: Institutional Identity & Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#1E293B]">
          {/* Identity Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1E293B] border border-[#334155] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                AIRE
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white block">
                  AIRE Platform
                </span>
                <span className="text-xs text-[#94A3B8]">
                  Admission Reconciliation & Evidence
                </span>
              </div>
            </div>

            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm">
              Standardized digital evidence infrastructure supporting admission
              record integrity, deterministic quota verification, and
              transparent governance across technical educational institutions.
            </p>

            <div className="pt-2">
              <div className="text-xs text-[#64748B]">
                All India Council for Technical Education (AICTE) &bull;
                Government of India
              </div>
            </div>
          </div>

          {/* Column 1: Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About AIRE
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  Platform Services
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#governance"
                  className="hover:text-white transition-colors"
                >
                  Governance & Security
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Help & Guidance
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Institutional Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Institutional Services
            </h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li>
                <a href="/login" className="hover:text-white transition-colors">
                  Institution Portal Login
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  Batch Intake Specifications
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  Quota Verification Diagnostic
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  Quarantine Triage Workflow
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Audit Export Formats
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Accessibility & Governance */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Accessibility & Standards
            </h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li>
                <span className="block text-[#64748B]">
                  Accessibility Mandate:
                </span>
                <span className="font-semibold text-[#CBD5E1]">
                  WCAG 2.2 AA / GIGW 3.0
                </span>
              </li>
              <li>
                <span className="block text-[#64748B]">Design Authority:</span>
                <span className="font-semibold text-[#CBD5E1]">
                  UX4G Design System v3.0
                </span>
              </li>
              <li>
                <span className="block text-[#64748B]">Data Architecture:</span>
                <span className="font-semibold text-[#CBD5E1]">
                  PostgreSQL RLS Tenant Isolation
                </span>
              </li>
              <li>
                <span className="block text-[#64748B]">
                  Verification Guarantee:
                </span>
                <span className="font-semibold text-[#CBD5E1]">
                  Deterministic SHA-256 Hashes
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Legal, Disclaimer, and Rights */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="text-center md:text-left space-y-0.5">
            <p>
              &copy; {new Date().getFullYear()} AIRE &mdash; Admission
              Reconciliation & Evidence Platform.
            </p>
            <p className="text-[11px] text-[#475569]">
              Designed according to UX4G guidelines for national technical
              education governance.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#94A3B8]">
            <a
              href="#governance"
              className="hover:text-white transition-colors"
            >
              Privacy Statement
            </a>
            <span className="text-[#334155]" aria-hidden="true">
              &bull;
            </span>
            <a
              href="#governance"
              className="hover:text-white transition-colors"
            >
              Terms of Use
            </a>
            <span className="text-[#334155]" aria-hidden="true">
              &bull;
            </span>
            <a
              href="#main-content"
              className="hover:text-white transition-colors"
            >
              Back to Top &uarr;
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
