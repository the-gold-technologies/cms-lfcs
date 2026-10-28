"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  HeroSection,
  WelcomeSection,
  NoteOfSupportSection,
  HowWeEducateSection,
  OurApproachSection,
  ExperienceSection,
  OurSchoolsSection,
  CTABanners,
} from "./components";

export default function HomePageEditor() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const res = await fetch("/api/home");
        const json = await res.json();
        if (json.success && json.data) {
          setPageData(json.data);
        }
      } catch (err) {
        console.error("Failed to load home page data:", err);
      }
    }
    loadHomeData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Home Page Sections"
        description="Manage the live sections of your homepage: Hero banner, Welcome narrative, Notes of Support, How We Educate, Our Approach, Campus Experience, School Directory, and Dual CTA Banners."
        badge="Main Landing Page"
      />

      <HeroSection initialData={pageData?.HeroSection} />
      <WelcomeSection initialData={pageData?.WelcomeSection} />
      <NoteOfSupportSection initialData={pageData?.NoteOfSupportSection} />
      <HowWeEducateSection initialData={pageData?.HowWeEducateSection} />
      <OurApproachSection initialData={pageData?.OurApproachSection} />
      <ExperienceSection initialData={pageData?.ExperienceSection} />
      <OurSchoolsSection initialData={pageData?.OurSchoolsSection} />
      <CTABanners initialData={pageData?.CTABanners} />
    </section>
  );
}
