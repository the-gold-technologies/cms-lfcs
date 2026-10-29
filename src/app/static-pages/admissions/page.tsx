"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  AdmissionsHeroSection,
  AdmissionOverviewSection,
  AdmissionClassesSection,
  AdmissionEnquiryFormSection,
} from "./components";

export default function AdmissionsPageEditor() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function loadAdmissionsData() {
      try {
        const res = await fetch("/api/admissions");
        const json = await res.json();
        if (json.success && json.data) {
          setPageData(json.data);
        }
      } catch (err) {
        console.error("Failed to load admissions page data:", err);
      }
    }
    loadAdmissionsData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Admissions Page Sections"
        description="Manage the 4 live sections of the Admissions page: Hero banner, Admission overview with selection pillars, Learning stage grade bands, and Parent enquiry form guidance."
        badge="Enrollment Page"
      />

      <AdmissionsHeroSection initialData={pageData?.AdmissionsHeroSection} />
      <AdmissionOverviewSection initialData={pageData?.AdmissionOverviewSection} />
      <AdmissionClassesSection initialData={pageData?.AdmissionClassesSection} />
      <AdmissionEnquiryFormSection initialData={pageData?.AdmissionEnquiryFormSection} />
    </section>
  );
}
