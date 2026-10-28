"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  ExperienceHeroSection,
  LifeAtLFCSSection,
  SportsFitnessSection,
  ArtsCultureSection,
  ClubsActivitiesSection,
  GallerySection,
  ExperienceCTASection,
} from "./components";

export default function ExperiencePageEditor() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function loadExperienceData() {
      try {
        const res = await fetch("/api/experience");
        const json = await res.json();
        if (json.success && json.data) {
          setPageData(json.data);
        }
      } catch (err) {
        console.error("Failed to load experience page data:", err);
      }
    }
    loadExperienceData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Experience & Campus Life Page Sections"
        description="Manage the 7 live sections of the Student Life page: Hero banner, Daily campus routine, Sports & Athletics, Arts & Culture, Clubs & Societies, Photo Gallery, and Community CTA."
        badge="Student Life Page"
      />

      <ExperienceHeroSection initialData={pageData?.ExperienceHeroSection} />
      <LifeAtLFCSSection initialData={pageData?.LifeAtLFCSSection} />
      <SportsFitnessSection initialData={pageData?.SportsFitnessSection} />
      <ArtsCultureSection initialData={pageData?.ArtsCultureSection} />
      <ClubsActivitiesSection initialData={pageData?.ClubsActivitiesSection} />
      <GallerySection initialData={pageData?.GallerySection} />
      <ExperienceCTASection initialData={pageData?.ExperienceCTASection} />
    </section>
  );
}
