"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function SupportProvidedSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [stage1Title, setStage1Title] = useState("");
  const [stage1Items, setStage1Items] = useState("");

  const [stage2Title, setStage2Title] = useState("");
  const [stage2Items, setStage2Items] = useState("");

  const [stage3Title, setStage3Title] = useState("");
  const [stage3Items, setStage3Items] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "PARTNERSHIP LIFECYCLE");
      setHeadline(initialData.headline ?? "Comprehensive Support Across All Setup Stages");
      setSubtitle(
        initialData.subtitle ??
          "From initial land layout through grand opening and ongoing annual academic audits, LFCS supports your school at every step.",
      );

      setStage1Title(initialData.stage1Title ?? "Stage 1: Pre-Launch Support");
      setStage1Items(
        initialData.stage1Items ??
          "School Planning & Architectural Layouts, Academic Structure & Timetable Blueprint, Brand Identity Guidelines, Faculty Recruitment & Induction Workshops",
      );

      setStage2Title(initialData.stage2Title ?? "Stage 2: Launch Support");
      setStage2Items(
        initialData.stage2Items ??
          "Admissions Planning & Outreach Strategy, School Readiness Inspection, Marketing Campaigns & Launch Collaterals, Press Announcements",
      );

      setStage3Title(initialData.stage3Title ?? "Stage 3: Post-Launch & Ongoing Support");
      setStage3Items(
        initialData.stage3Items ??
          "Annual Academic Quality Audits, Regular Teacher Training Programs, Curriculum Updates, Inter-School Sports & Cultural Leagues Participation",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "SupportProvidedSection",
        content: {
          tagline,
          headline,
          subtitle,
          stage1Title,
          stage1Items,
          stage2Title,
          stage2Items,
          stage3Title,
          stage3Items,
        },
      };

      const res = await fetch("/api/start-school", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Support Provided section saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save section");
      }
    } catch (err: any) {
      toast.error(err?.message || "Network error while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6">
      <SectionHeader
        title="4. Three-Stage Partnership Support (Pre-Launch, Launch, Ongoing)"
        description="Outlines specific deliverables provided during Pre-Launch setup, School Inauguration, and Ongoing operations."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Eyebrow Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. PARTNERSHIP LIFECYCLE"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Comprehensive Support Across All Setup Stages"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Support lifecycle narrative..."
          />

          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-3">
              <InputField
                label="Stage 1 Title"
                value={stage1Title}
                onChange={(e) => setStage1Title(e.target.value)}
                placeholder="e.g. Stage 1: Pre-Launch Support"
              />
              <TextAreaField
                label="Stage 1 Deliverables (Comma-separated items)"
                value={stage1Items}
                onChange={(e) => setStage1Items(e.target.value)}
                rows={2}
                placeholder="e.g. Architectural layouts, curriculum planning..."
              />
            </div>

            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-3">
              <InputField
                label="Stage 2 Title"
                value={stage2Title}
                onChange={(e) => setStage2Title(e.target.value)}
                placeholder="e.g. Stage 2: Launch Support"
              />
              <TextAreaField
                label="Stage 2 Deliverables (Comma-separated items)"
                value={stage2Items}
                onChange={(e) => setStage2Items(e.target.value)}
                rows={2}
                placeholder="e.g. Admissions campaign, marketing collaterals..."
              />
            </div>

            <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-3">
              <InputField
                label="Stage 3 Title"
                value={stage3Title}
                onChange={(e) => setStage3Title(e.target.value)}
                placeholder="e.g. Stage 3: Ongoing Operations"
              />
              <TextAreaField
                label="Stage 3 Deliverables (Comma-separated items)"
                value={stage3Items}
                onChange={(e) => setStage3Items(e.target.value)}
                rows={2}
                placeholder="e.g. Teacher training, quality audits, sports leagues..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <div className="w-full sm:w-64">
              <SaveButton onClick={handleSave} loading={loading} saved={saved} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
