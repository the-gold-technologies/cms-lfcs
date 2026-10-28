"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  StartSchoolHeroSection,
  WhyPartnerSection,
  SchoolModelSection,
  SupportProvidedSection,
  PartnerRequirementsSection,
  SetupProcessSection,
  InvestmentSection,
  StartSchoolFaqSection,
  StartSchoolFinalCTASection,
} from "./components";

export default function StartSchoolPageEditor() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function loadStartSchoolData() {
      try {
        const res = await fetch("/api/start-school");
        const json = await res.json();
        if (json.success && json.data) {
          setPageData(json.data);
        }
      } catch (err) {
        console.error("Failed to load start-school page data:", err);
      }
    }
    loadStartSchoolData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Start a School Page Sections"
        description="Manage the 9 live sections of the LFCS Associate School partnership page: Hero banner, Why Partner benefits, Operating model pillars, 3-stage support lifecycle, eligibility requirements, 8-step setup roadmap, resource allocation, FAQs, and partnership proposal CTA."
        badge="Franchise & Partner Page"
      />

      <StartSchoolHeroSection initialData={pageData?.StartSchoolHeroSection} />
      <WhyPartnerSection initialData={pageData?.WhyPartnerSection} />
      <SchoolModelSection initialData={pageData?.SchoolModelSection} />
      <SupportProvidedSection initialData={pageData?.SupportProvidedSection} />
      <PartnerRequirementsSection initialData={pageData?.PartnerRequirementsSection} />
      <SetupProcessSection initialData={pageData?.SetupProcessSection} />
      <InvestmentSection initialData={pageData?.InvestmentSection} />
      <StartSchoolFaqSection initialData={pageData?.StartSchoolFaqSection} />
      <StartSchoolFinalCTASection initialData={pageData?.StartSchoolFinalCTASection} />
    </section>
  );
}
