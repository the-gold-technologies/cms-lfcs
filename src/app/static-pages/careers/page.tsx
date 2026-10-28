"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  CareersHeroSection,
  WhyWorkWithUsSection,
  WorkCultureSection,
  OpportunitiesSection,
  CareersFinalCTASection,
} from "./components";

export default function CareersPageEditor() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function loadCareersData() {
      try {
        const res = await fetch("/api/careers");
        const json = await res.json();
        if (json.success && json.data) {
          setPageData(json.data);
        }
      } catch (err) {
        console.error("Failed to load careers page data:", err);
      }
    }
    loadCareersData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Careers Page Sections"
        description="Manage the 5 live sections of the Careers recruitment page: Hero banner, Why Work with Us advantages, Workplace culture, Teaching & administrative roles, and Profile submission CTA."
        badge="Recruitment Page"
      />

      <CareersHeroSection initialData={pageData?.CareersHeroSection} />
      <WhyWorkWithUsSection initialData={pageData?.WhyWorkWithUsSection} />
      <WorkCultureSection initialData={pageData?.WorkCultureSection} />
      <OpportunitiesSection initialData={pageData?.OpportunitiesSection} />
      <CareersFinalCTASection initialData={pageData?.CareersFinalCTASection} />
    </section>
  );
}
