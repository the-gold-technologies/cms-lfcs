"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  ContactHeroSection,
  ContactFormSection,
  ContactCampusesSection,
} from "./components";

export default function ContactPageEditor() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function loadContactData() {
      try {
        const res = await fetch("/api/contact");
        const json = await res.json();
        if (json.success && json.data) {
          setPageData(json.data);
        }
      } catch (err) {
        console.error("Failed to load contact page data:", err);
      }
    }
    loadContactData();
  }, []);

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Contact Us Page Sections"
        description="Manage the 3 live sections of the Contact Us page: Hero banner, Head Office contact numbers & operating hours, and Campus branch directory map links."
        badge="Contact Page"
      />

      <ContactHeroSection initialData={pageData?.ContactHeroSection} />
      <ContactFormSection initialData={pageData?.ContactFormSection} />
      <ContactCampusesSection initialData={pageData?.ContactCampusesSection} />
    </section>
  );
}
