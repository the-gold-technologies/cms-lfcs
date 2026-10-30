"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FormIntroSection } from "@/components/FormIntroSection";
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
        description="Manage the 10 live sections of the LFCS Associate School partnership page: Hero banner, Why Partner benefits, Operating model pillars, 3-stage support lifecycle, eligibility requirements, 8-step setup roadmap, resource allocation, FAQs, partnership proposal CTA, and the enquiry pop-up form."
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
      <FormIntroSection
        initialData={pageData?.EnquiryFormSection}
        sectionType="EnquiryFormSection"
        apiPath="/api/start-school"
        title="10. Start a School Enquiry Pop-up Form"
        description="Heading, intro text and thank-you message of the partnership enquiry pop-up form."
        inboxLabel="Start a School Submissions Inbox"
        inboxHref="/submissions/start-school"
      />
    </section>
  );
}
