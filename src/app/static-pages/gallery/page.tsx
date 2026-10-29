"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GalleryHeroSection, GalleryCurateSection } from "./components";

export default function GalleryPageEditor() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function loadGalleryData() {
      try {
        const res = await fetch("/api/gallery-page");
        const json = await res.json();
        if (json.success && json.data) {
          setPageData(json.data);
        }
      } catch (err) {
        console.error("Failed to load gallery page data:", err);
      }
    }
    loadGalleryData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Photo Gallery Page Sections"
        description="Manage the live sections of the Photo Gallery page: Hero banner title & description, and the campus photography collection across all 7 departments."
        badge="Media Page"
      />

      <GalleryHeroSection initialData={pageData?.GalleryHeroSection} />
      <GalleryCurateSection />
    </section>
  );
}
