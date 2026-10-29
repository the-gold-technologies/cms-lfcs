"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
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
        description="Manage the 3 live sections of the Our Schools directory page: Network Hero banner, Campuses Directory, and Admissions Open Call to Action."
        badge="Campuses Directory Page"
      />

      <OurSchoolHeroSection initialData={pageData?.OurSchoolHeroSection} />
      <AllSchoolsListSection initialData={pageData?.AllSchoolsListSection} />
      <OurSchoolCTASection initialData={pageData?.OurSchoolCTASection} />
    </section>
  );
}
