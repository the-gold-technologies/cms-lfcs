"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  AcademicsHeroSection,
  CurriculumSection,
  AcademicJourneySection,
  TeachingAndLearningSection,
  FacultySection,
  AcademicResultsSection,
  AcademicFacilitiesSection,
  AcademicsCTASection,
} from "./components";

export default function AcademicsPageEditor() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function loadAcademicsData() {
      try {
        const res = await fetch("/api/academics");
        const json = await res.json();
        if (json.success && json.data) {
          setPageData(json.data);
        }
      } catch (err) {
        console.error("Failed to load academics page data:", err);
      }
    }
    loadAcademicsData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Academics Page Sections"
        description="Manage the 8 live sections of the Academics page: Hero banner, CBSE curriculum subjects, Nursery-XII journey stages, pedagogy methodologies, leadership faculty, board toppers showcase, modern facilities, and enrollment CTA."
        badge="Curriculum Page"
      />

      <AcademicsHeroSection initialData={pageData?.AcademicsHeroSection} />
      <CurriculumSection initialData={pageData?.CurriculumSection} />
      <AcademicJourneySection initialData={pageData?.AcademicJourneySection} />
      <TeachingAndLearningSection initialData={pageData?.TeachingAndLearningSection} />
      <FacultySection initialData={pageData?.FacultySection} />
      <AcademicResultsSection initialData={pageData?.AcademicResultsSection} />
      <AcademicFacilitiesSection initialData={pageData?.AcademicFacilitiesSection} />
      <AcademicsCTASection initialData={pageData?.AcademicsCTASection} />
    </section>
  );
}
