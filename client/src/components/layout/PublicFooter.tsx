import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ExternalLink } from "lucide-react";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#0D1D2B] text-white/80 border-t border-white/10 select-none">
      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Platform Branding & Council Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded bg-[#183B56] flex items-center justify-center text-white ring-1 ring-white/20">
                <svg
                  className="w-5 h-5 text-[#14B8A6]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 20 9-16 9 16" />
                  <path d="M6.5 14h11" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                AIRE
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              AICTE Institutional Records & Verification Engine — Statutory
              platform for admission reconciliation, normative quota
              verification, and verifiable audit evidence.
            </p>
            <div className="pt-2">
              <p className="text-xs text-white/50">
                All India Council for Technical Education (AICTE)
                <br />
                Nelson Mandela Marg, Vasant Kunj, New Delhi-110070
              </p>
            </div>
          </div>

          {/* Column 2: About Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/95">
              About
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#about"
                  className="hover:text-white transition-colors"
                >
                  About AIRE
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
                  href="#why-aire"
                  className="hover:text-white transition-colors"
                >
                  Why AIRE
                </a>
              </li>
              <li>
                <a
                  href="https://www.aicte-india.org"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  AICTE Official Portal
                  <ExternalLink className="w-3 h-3 text-white/40" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Guidelines */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/95">
              Resources
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#resources"
                  className="hover:text-white transition-colors"
                >
                  User Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#templates"
                  className="hover:text-white transition-colors"
                >
                  Download CSV Templates
                </a>
              </li>
              <li>
                <a
                  href="#norms"
                  className="hover:text-white transition-colors"
                >
                  AICTE Approval Norms
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-white transition-colors"
                >
                  Institutional Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies & Regulatory */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/95">
              Policies & Support
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="#accessibility"
                  className="hover:text-white transition-colors"
                >
                  Accessibility Statement
                </a>
              </li>
              <li>
                <a
                  href="#support"
                  className="hover:text-white transition-colors"
                >
                  Help & FAQs
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Initiative Badge & Indian Tricolor Motif */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs text-white/70">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              An initiative to support AICTE-approved institutions in student
              record management.
            </span>
          </div>

          {/* National Tricolor accent strip */}
          <div className="flex h-1.5 w-24 rounded-full overflow-hidden" aria-hidden="true">
            <div className="bg-[#FF9933] w-1/3 h-full" />
            <div className="bg-[#FFFFFF] w-1/3 h-full" />
            <div className="bg-[#128807] w-1/3 h-full" />
          </div>
        </div>
      </div>

      {/* Sub-Footer: UX4G & Legal Attribution */}
      <div className="bg-[#08121B] py-4 px-4 sm:px-6 lg:px-8 border-t border-white/5 text-[11px] text-white/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <p>
            © 2026 All India Council for Technical Education (AICTE), Ministry
            of Education, Government of India. All rights reserved.
          </p>
          <p className="flex items-center gap-1 justify-center">
            Designed adhering to UX4G, NN/g cognitive heuristics & WCAG 2.2 AA
            standards.
          </p>
        </div>
      </div>
    </footer>
  );
};
