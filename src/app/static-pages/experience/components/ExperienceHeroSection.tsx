"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function ExperienceHeroSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "Life at LFCS");
      setHeadline(initialData.headline ?? "More than Just a");
      setScriptAccent(initialData.scriptAccent ?? "School Day.");
      setSubtitle(
        initialData.subtitle ??
          "Life at LFCS is beyond textbooks and classrooms. We cultivate character, teamwork, sportsmanship, and creative expression.",
      );
      setCtaText(initialData.ctaText ?? "Explore Life at LFCS");
      setCtaLink(initialData.ctaLink ?? "#life-at-lfcs");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "ExperienceHeroSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          ctaText,
          ctaLink,
        },
      };

      const res = await fetch("/api/experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Experience Hero section saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save Hero section");
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
        title="1. Experience & Campus Life Hero"
        description="Top header highlighting the holistic student experience beyond academics."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Eyebrow Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Life at LFCS"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. More than Just a"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. School Day."
            />
          </div>

          <TextAreaField
            label="Hero Narrative Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Holistic student growth narrative..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Label"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Explore Life at LFCS"
            />
            <InputField
              label="CTA Target Anchor"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. #life-at-lfcs"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
