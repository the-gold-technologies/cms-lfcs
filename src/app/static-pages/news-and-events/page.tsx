"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { NewsHeroSection, NewsListSection } from "./components";

export default function NewsAndEventsPageEditor() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function loadNewsData() {
      try {
        const res = await fetch("/api/news-and-events");
        const json = await res.json();
        if (json.success && json.data) {
          setPageData(json.data);
        }
      } catch (err) {
        console.error("Failed to load news page data:", err);
      }
    }
    loadNewsData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="News & Events Page Sections"
        description="Manage the live sections of the News & Events portal: Top hero headline & introduction, and press marquee coverage outlets ticker."
        badge="Media Page"
      />

      <NewsHeroSection initialData={pageData?.NewsHeroSection} />
      <NewsListSection initialData={pageData?.NewsListSection} />
    </section>
  );
}

