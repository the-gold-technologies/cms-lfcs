"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function ExperienceSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");

  const [col1Image, setCol1Image] = useState("");
  const [col2Image, setCol2Image] = useState("");
  const [col3Image, setCol3Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "CAMPUS LIFE");
      setHeadline(initialData.headline ?? "An Environment Where");
      setScriptAccent(initialData.scriptAccent ?? "Every Child Thrives");
      setSubtitle(
        initialData.subtitle ??
          "Beyond classrooms, our campuses buzz with sporting tournaments, science fairs, performing arts, and joyful discovery.",
      );
      setCtaText(initialData.ctaText ?? "Explore Student Life");
      setCtaLink(initialData.ctaLink ?? "/experience");

      setCol1Image(
        initialData.col1Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170031/lfcs-school/Experience1_1793170031351.webp",
      );
      setCol2Image(
        initialData.col2Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170032/lfcs-school/Experience4_1793170032205.webp",
      );
      setCol3Image(
        initialData.col3Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170033/lfcs-school/Experience7_1793170033133.webp",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "ExperienceSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          ctaText,
          ctaLink,
          col1Image,
          col2Image,
          col3Image,
        },
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Experience section saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save Experience section");
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
        title="6. Experience Section (Dynamic School Life Grid)"
        description="Highlights campus vitality, energetic sports fields, science labs, and extracurriculars with animated photo columns."
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
              placeholder="e.g. Eyebrow badge (e.g. CAMPUS LIFE)"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Section title (e.g. An Environment Where)"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Golden cursive highlight (e.g. Every Child Thrives)"
            />
          </div>

          <TextAreaField
            label="Section Narrative"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Describe campus co-curricular vitality and activities..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Label"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Button label (e.g. Explore Student Life)"
            />
            <InputField
              label="CTA Button Link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. Target route (e.g. /experience)"
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Featured Gallery Column Photos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ImagePickerField
                label="Column 1 Photo (Sports & Outdoors)"
                value={col1Image}
                onChange={(url) => setCol1Image(url)}
                placeholder="e.g. Cloudinary sports photo URL"
              />
              <ImagePickerField
                label="Column 2 Photo (Labs & Tech)"
                value={col2Image}
                onChange={(url) => setCol2Image(url)}
                placeholder="e.g. Cloudinary lab/computer photo URL"
              />
              <ImagePickerField
                label="Column 3 Photo (Arts & Classroom)"
                value={col3Image}
                onChange={(url) => setCol3Image(url)}
                placeholder="e.g. Cloudinary art/cultural photo URL"
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
