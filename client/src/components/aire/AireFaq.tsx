import React from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { Accordion } from "./Accordion";

export const AireFaq: React.FC = () => {
  const faqItems = [
    {
      id: "faq-what-is-aire",
      question: "What is the AIRE platform and what role does it serve for institutions?",
      answer:
        "AIRE (Admission Reconciliation & Evidence Platform) is an authoritative digital service developed under the All India Council for Technical Education (AICTE). It provides technical institutions with a deterministic, self-service environment to reconcile student admission rosters against statutory rules, program codes, and sanctioned seat caps ahead of regulatory deadlines.",
    },
    {
      id: "faq-who-can-access",
      question: "Who is authorized to access the Institution Portal?",
      answer:
        "Access is strictly restricted to designated institutional authorities (Nodal Officers, Registrars, and Admissions Heads) of AICTE-approved institutions. Authentication requires institutional credentials backed by tenant-scoped access control.",
    },
    {
      id: "faq-file-formats",
      question: "What file formats and batch schemas are supported?",
      answer:
        "AIRE accepts structured CSV and XLSX spreadsheets formatted to the AICTE Student Record Data Specification. The portal features instant client-side header checks and server-side schema validation to identify formatting anomalies before data ingestion.",
    },
    {
      id: "faq-discrepancies",
      question: "How does the platform handle records with anomalies or discrepancies?",
      answer:
        "Records flagged with potential quota or eligibility discrepancies are never automatically rejected or cancelled. Instead, they are routed to an isolated Quarantine Triage queue within the institution's private workspace, allowing nodal officers a structured opportunity to clarify data with supporting documentation.",
    },
    {
      id: "faq-privacy",
      question: "How is student personal data and confidentiality protected?",
      answer:
        "AIRE adheres strictly to DPDP Act 2023 principles and privacy-by-design. Student PII is isolated in a secure Identity Vault, masked across non-administrative interfaces, and excluded from system logs. Database queries enforce PostgreSQL Row-Level Security (RLS) to ensure absolute tenant isolation.",
    },
    {
      id: "faq-decisions",
      question: "Does AIRE make automated policy determinations or student cancellations?",
      answer:
        "No. AIRE provides deterministic mathematical calculations and diagnostic evidence. All regulatory policy interpretations, quota exemptions, and final admission verdicts remain exclusively with authorized institutional and regulatory officials.",
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#FAFBFD] border-b border-[#E2E8F0]">
      <Container>
        <SectionHeading
          badge="Frequently Asked Questions"
          title="Help & Institutional Guidance"
          subtitle="Clear answers to common questions regarding batch submissions, verification rules, and data governance."
        />

        <div className="max-w-3xl mx-auto">
          <Accordion items={faqItems} />

          {/* Need Additional Help Callout */}
          <div className="mt-10 p-6 rounded-xl bg-white border border-[#CBD5E1] text-center shadow-xs">
            <h4 className="text-base font-bold text-[#0F172A] mb-1">
              Have additional technical or regulatory questions?
            </h4>
            <p className="text-sm text-[#475569] mb-4">
              Institutional nodal officers can reach out to the AICTE technical guidance desk for batch preparation assistance.
            </p>
            <a
              href="#footer"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            >
              <span>Contact the Institutional Helpdesk</span>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};
