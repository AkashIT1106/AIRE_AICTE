import React from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";

export const AireInstitutionalInfo: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-b border-[#E2E8F0]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Authoritative Editorial Presentation */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              badge="Statutory Context"
              title="About the AIRE Platform"
              subtitle="The Admission Reconciliation & Evidence Platform establishes a standardized, reproducible evidence layer for technical education governance in India."
              align="left"
              className="mb-4"
            />

            <div className="space-y-4 text-sm sm:text-base text-[#334155] leading-relaxed">
              <p>
                Historically, admission verification across technical institutions
                relied on fragmented spreadsheets, physical registers, and labor-intensive
                manual audits. This caused unintentional reporting delays, reconciliation
                backlogs, and administrative overhead for institutions and regulatory bodies alike.
              </p>
              <p>
                <strong>AIRE</strong> modernizes this process by providing a deterministic digital
                evidence infrastructure. Institutions upload batch rosters, instantly validate
                compliance against sanctioned seat ceilings, and resolve discrepancies within a
                structured administrative triage framework prior to statutory deadlines.
              </p>
              <p>
                Crucially, the platform operates under the principle of <strong>Human Governance</strong>:
                computational algorithms provide objective mathematical calculations, while all
                policy judgments, exemption grants, and final regulatory determinations remain
                strictly with designated institutional authorities.
              </p>
            </div>

            {/* Institutional Mission & Standards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#CBD5E1]">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]" aria-hidden="true" />
                  Institutional Mission
                </h4>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Empowering AICTE-approved institutions with self-service diagnostics to reconcile
                  enrollments cleanly ahead of regulatory cutoff dates.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#CBD5E1]">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#059669]" aria-hidden="true" />
                  Evidence Standards
                </h4>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Generating tamper-evident cryptographic proofs to protect legitimate student
                  enrollments and simplify accreditation audits.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Institutional Objectives Dossier */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAFBFD] border border-[#CBD5E1] rounded-2xl p-7 shadow-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0] mb-5">
                <div className="w-10 h-10 rounded-lg bg-[#1E293B] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  AICTE
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    Key Regulatory Objectives
                  </h3>
                  <span className="text-xs text-[#64748B]">
                    Approval Process Framework
                  </span>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-[#334155]">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    <strong>Eliminate Manual Bottlenecks:</strong> Replace unstructured
                    spreadsheets with verified schema-based batch ingestion.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    <strong>Sanctioned Seat Compliance:</strong> Mathematically enforce
                    seat caps and statutory reservation quotas.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    <strong>De-duplicate Multi-Program Registrations:</strong> Flag
                    concurrent enrollment conflicts across participating institutions.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <span>
                    <strong>Verifiable Audit Packages:</strong> Provide one-click,
                    tamper-evident evidence packages for accreditation bodies.
                  </span>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                <span>Technical Education Governance</span>
                <span className="font-semibold text-[#0F172A]">AIRE 2026</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
