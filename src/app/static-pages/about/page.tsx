"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  AboutHeroSection,
  OurStorySection,
  VisionMissionSection,
  EducationalApproachSection,
  OurValuesSection,
  LeadershipSection,
  OurGrowthSection,
  AwardsSection,
  AboutCTASection,
} from "./components";

export default function AboutPageEditor() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function loadAboutData() {
      try {
        const res = await fetch("/api/about");
        const json = await res.json();
        if (json.success && json.data) {
          setPageData(json.data);
        }
      } catch (err) {
        console.error("Failed to load about page data:", err);
      }
    }
    loadAboutData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="About Us Page Sections"
        description="Manage the 9 live sections of the About Us page: Hero banner, Founding Story, Vision & Mission, Educational Approach, Core Values, Leadership Profiles, Growth Timeline, Awards & Honours, and Enrollment CTA."
        badge="Institutional Page"
      />

      <AboutHeroSection initialData={pageData?.AboutHeroSection} />
      <OurStorySection initialData={pageData?.OurStorySection} />
      <VisionMissionSection initialData={pageData?.VisionMissionSection} />
      <EducationalApproachSection initialData={pageData?.EducationalApproachSection} />
      <OurValuesSection initialData={pageData?.OurValuesSection} />
      <LeadershipSection initialData={pageData?.LeadershipSection} />
      <OurGrowthSection initialData={pageData?.OurGrowthSection} />
      <AwardsSection initialData={pageData?.AwardsSection} />
      <AboutCTASection initialData={pageData?.AboutCTASection} />
    </section>
  );
}
