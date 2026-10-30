"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { FormIntroSection } from "@/components/FormIntroSection";
import { OurSchoolHeroSection, AllSchoolsListSection, OurSchoolCTASection } from "./components";

export default function OurSchoolPageEditor() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function loadOurSchoolData() {
      try {
        const res = await fetch("/api/our-school");
        const json = await res.json();
        if (json.success && json.data) {
          setPageData(json.data);
        }
      } catch (err) {
        console.error("Failed to load our-school page data:", err);
      }
    }
    loadOurSchoolData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Our Schools Page Sections"
        description="Manage the live sections of the Our Schools directory page: Network Hero banner, Campuses Directory, Admissions Open Call to Action, and the Admission Enquiry pop-up form."
        badge="Campuses Directory Page"
      />

      <OurSchoolHeroSection initialData={pageData?.OurSchoolHeroSection} />
      <AllSchoolsListSection initialData={pageData?.AllSchoolsListSection} />
      <OurSchoolCTASection initialData={pageData?.OurSchoolCTASection} />
      <FormIntroSection
        initialData={pageData?.AdmissionEnquiryModalSection}
        sectionType="AdmissionEnquiryModalSection"
        apiPath="/api/our-school"
        title="4. Admission Enquiry Pop-up Form"
        description="Heading, intro text and thank-you message of the pop-up form opened by the Enquire for Admission button."
        inboxLabel="Admission Submissions Inbox"
        inboxHref="/submissions/admissions"
      />
    </section>
  );
}
