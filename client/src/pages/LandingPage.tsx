import React from "react";
import { AireUtilityHeader } from "../components/aire/AireUtilityHeader";
import { AireNavbar } from "../components/aire/AireNavbar";
import { AireHero } from "../components/aire/AireHero";
import { AireServices } from "../components/aire/AireServices";
import { AireWorkflow } from "../components/aire/AireWorkflow";
import { AireResponsibleManagement } from "../components/aire/AireResponsibleManagement";
import { AireInstitutionalInfo } from "../components/aire/AireInstitutionalInfo";
import { AireFaq } from "../components/aire/AireFaq";
import { AirePreFooterCta } from "../components/aire/AirePreFooterCta";
import { AireFooter } from "../components/aire/AireFooter";

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A] font-sans antialiased selection:bg-[#DBEAFE] selection:text-[#1E3A8A]">
      {/* 1. Institutional Utility Header (National context, Accessibility, Language, Contrast) */}
      <AireUtilityHeader />

      {/* 2. Main Institutional Navbar (Brand mark, Primary Navigation, Portal CTA) */}
      <AireNavbar />

      {/* 3. Main Content Landmark */}
      <main
        id="main-content"
        className="flex-grow focus:outline-none"
        tabIndex={-1}
      >
        {/* A. Editorial Hero with custom high-craft SVG vector illustration */}
        <AireHero />

        {/* B. Core AIRE Services in Aadhaar-inspired Institutional Dossier */}
        <AireServices />

        {/* C. How AIRE Works (iGOT Karmayogi Connected Stepper Pipeline) */}
        <AireWorkflow />

        {/* D. Responsible Record Management (Editorial split with custom Security Architecture SVG) */}
        <AireResponsibleManagement />

        {/* E. Institutional Information & Statutory Context */}
        <AireInstitutionalInfo />

        {/* F. Accessible FAQ Accordion */}
        <AireFaq />

        {/* G. Pre-Footer Callout Banner on Deep Institutional Midnight Canvas */}
        <AirePreFooterCta />
      </main>

      {/* 4. Institutional Statutory Footer */}
      <AireFooter />
    </div>
  );
};
