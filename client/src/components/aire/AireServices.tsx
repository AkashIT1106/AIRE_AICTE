import React, { useState } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { Button } from "./Button";

interface ServiceItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  regulatoryRole: string;
  inputs: string[];
  outputs: string[];
  actionLabel: string;
  actionHref: string;
  badge: string;
}

export const AireServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState("intake");

  const services: ServiceItem[] = [
    {
      id: "intake",
      category: "Module 01",
      title: "Batch Roster Ingestion & Schema Staging",
      subtitle:
        "Secure institutional workspace for multi-batch admission dataset staging",
      description:
        "Authorized institutional officers upload structured admission records (CSV or XLSX) into a sandboxed, tenant-isolated staging environment. Every uploaded file undergoes cryptographic checksum generation and strict schema header verification before ingestion.",
      regulatoryRole:
        "Prevents malformed data entry and preserves file provenance under AICTE reporting norms.",
      inputs: [
        "Standard CSV / XLSX student rosters",
        "Institutional AICTE approval code",
        "Designated nodal officer authentication credentials",
      ],
      outputs: [
        "Cryptographic SHA-256 batch checksum",
        "Pre-flight schema diagnostic log",
        "Tenant-scoped staging workspace ledger",
      ],
      actionLabel: "Access Batch Intake Portal",
      actionHref: "/login",
      badge: "Institutional Workspace",
    },
    {
      id: "quota",
      category: "Module 02",
      title: "Deterministic Quota & Seat Ceiling Engine",
      subtitle:
        "Computational verification against approved institutional intake limits",
      description:
        "An automated deterministic rule engine evaluates admission rosters directly against sanctioned seat capacities, program codes, and statutory quotas (General, Reserved, Supernumerary). Evaluations are mathematically pure and reproducible.",
      regulatoryRole:
        "Guarantees that no institution exceeds sanctioned capacity or misallocates statutory reservations.",
      inputs: [
        "Sanctioned program intake thresholds (Approval Process Handbook)",
        "Parsed student cohort enrollment attributes",
        "Category & quota allotment classifications",
      ],
      outputs: [
        "Deterministic seat tally reports",
        "Cross-institution duplicate enrollment flags",
        "Deterministic quota pass/fail matrices",
      ],
      actionLabel: "Review Quota Engine Rules",
      actionHref: "#how-it-works",
      badge: "Deterministic Engine",
    },
    {
      id: "quarantine",
      category: "Module 03",
      title: "Discrepancy Quarantine & Triage Queue",
      subtitle:
        "Isolated administrative holding area for non-punitive discrepancy resolution",
      description:
        "Student records flagged with potential eligibility ambiguities or quota anomalies are isolated in a private quarantine queue. Institutions are granted a designated procedural window to submit supporting documentation without facing premature rejection.",
      regulatoryRole:
        "Protects legitimate student admissions through structured procedural fairness and nodal review.",
      inputs: [
        "Quarantined student record references",
        "Specific diagnostic violation codes",
        "Institutional clarifying evidence & affidavits",
      ],
      outputs: [
        "Time-stamped audit clarification trace",
        "Resolved record restoration or referral docket",
        "Nodal officer review sign-off",
      ],
      actionLabel: "Explore Triage Workflow",
      actionHref: "#governance",
      badge: "Procedural Fairness",
    },
    {
      id: "evidence",
      category: "Module 04",
      title: "Tamper-Evident Evidence & Audit Certification",
      subtitle:
        "Cryptographic ledger seals and compliance packages for accreditation bodies",
      description:
        "Once admission rosters pass all deterministic checks and nodal officer sign-offs, the system generates an immutable verification seal. The batch ledger includes full provenance, nodal officer attribution, and downloadable audit evidence packages.",
      regulatoryRole:
        "Provides official, tamper-evident proof for AICTE scrutiny, NBA/NAAC accreditation, and state councils.",
      inputs: [
        "Reconciled admission roster dataset",
        "Multi-factor nodal authorization token",
        "Institutional affirmation declaration",
      ],
      outputs: [
        "Deterministic SHA-256 batch verification certificate",
        "Immutable append-only ledger event stream",
        "Accreditation-ready compliance export package",
      ],
      actionLabel: "Inspect Verification Standards",
      actionHref: "#faq",
      badge: "Cryptographic Integrity",
    },
  ];

  const currentService =
    services.find((s) => s.id === activeTab) || services[0];

  return (
    <section
      id="services"
      className="py-16 sm:py-24 bg-white border-b border-[#E2E8F0]"
    >
      <Container>
        <SectionHeading
          badge="Platform Architecture"
          title="Institutional Service Directory"
          subtitle="Explore the core operational capabilities provided by AIRE to technical institutions and regulatory reviewers."
        />

        {/* Aadhaar-Style Category Navigation Switcher */}
        <div
          role="tablist"
          aria-label="AIRE Institutional Services"
          className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-xl bg-[#F1F5F9] border border-[#CBD5E1] max-w-3xl mx-auto mb-10"
        >
          {services.map((service) => {
            const isActive = service.id === activeTab;
            return (
              <button
                key={service.id}
                role="tab"
                id={`tab-${service.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${service.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(service.id)}
                className={`flex-1 min-w-[140px] sm:min-w-[160px] py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#1E293B] text-white shadow-sm"
                    : "text-[#475569] hover:text-[#0F172A] hover:bg-white/60"
                }`}
              >
                {service.title.split("&")[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Detailed Service Dossier (Asymmetric Institutional Layout) */}
        <div
          role="tabpanel"
          id={`panel-${currentService.id}`}
          aria-labelledby={`tab-${currentService.id}`}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Main Left Panel: Selected Service Dossier */}
          <div className="lg:col-span-8 bg-[#FAFBFD] border border-[#CBD5E1] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded border border-[#BFDBFE]">
                  {currentService.category}
                </span>
                <span className="text-xs font-semibold text-[#64748B]">
                  {currentService.badge}
                </span>
              </div>
              <span className="text-xs text-[#059669] font-semibold flex items-center gap-1.5 bg-[#ECFDF5] px-2.5 py-1 rounded border border-[#A7F3D0]">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
                  aria-hidden="true"
                />
                Statutory Specification
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <h3 className="text-2xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                {currentService.title}
              </h3>

              <p className="text-sm font-medium text-[#2563EB]">
                {currentService.subtitle}
              </p>

              <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
                {currentService.description}
              </p>

              {/* Regulatory Role Callout Box */}
              <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E3A8A]">
                <span className="font-bold block mb-1">
                  Regulatory Mandate & Purpose:
                </span>
                <span>{currentService.regulatoryRole}</span>
              </div>

              {/* Input / Output Data Contracts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full bg-[#2563EB]"
                      aria-hidden="true"
                    />
                    Required Inputs
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#475569]">
                    {currentService.inputs.map((inp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span
                          className="text-[#2563EB] font-bold"
                          aria-hidden="true"
                        >
                          &bull;
                        </span>
                        <span>{inp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full bg-[#059669]"
                      aria-hidden="true"
                    />
                    Verifiable Outputs
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#475569]">
                    {currentService.outputs.map((outp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span
                          className="text-[#059669] font-bold"
                          aria-hidden="true"
                        >
                          &bull;
                        </span>
                        <span>{outp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex items-center gap-4">
                <Button
                  asAnchor
                  href={currentService.actionHref}
                  variant="primary"
                  size="md"
                  className="font-bold text-sm px-6"
                >
                  {currentService.actionLabel}
                </Button>
                <span className="text-xs text-[#64748B]">
                  Role-protected access enforced via server authorization.
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: Institutional Directory Navigation */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#FAFBFD] border border-[#CBD5E1] rounded-2xl p-6">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4 pb-3 border-b border-[#E2E8F0]">
                Operational Modules
              </h4>

              <div className="space-y-2.5">
                {services.map((item) => {
                  const isSelected = item.id === activeTab;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? "bg-white border-[#2563EB] shadow-sm ring-1 ring-[#2563EB]"
                          : "bg-white/60 border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1]"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-0.5">
                          {item.badge}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold shrink-0 mt-0.5 ${
                          isSelected ? "text-[#2563EB]" : "text-[#94A3B8]"
                        }`}
                      >
                        {isSelected ? "Active →" : "View"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Statutory Compliance Notice */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569] space-y-1.5">
              <span className="font-bold text-[#0F172A] block">
                Statutory Rule Authority
              </span>
              <p>
                Rule sets are governed by the AICTE Approval Process Handbook
                (APH) and approved state quota allocation guidelines.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
