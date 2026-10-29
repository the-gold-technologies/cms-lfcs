"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function CareersHeroSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [statsNumber, setStatsNumber] = useState("");
  const [statsLabel, setStatsLabel] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");
      setCtaText(initialData.ctaText ?? "");
      setCtaLink(initialData.ctaLink ?? "");
      setImage1(initialData.image1 ?? "");
      setImage2(initialData.image2 ?? "");
      setStatsNumber(initialData.statsNumber ?? "");
      setStatsLabel(initialData.statsLabel ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "CareersHeroSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          ctaText,
          ctaLink,
          image1,
          image2,
          statsNumber,
          statsLabel,
        },
      };

      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Careers Hero saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save Hero section");
      }
    } catch {
      toast.error("Network error while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6">
      <SectionHeader
        title="1. Careers Hero Banner"
        description="Top recruitment header inviting educators and administrative leaders with collage photography."
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
              placeholder="e.g. Careers at Little Flower Group of Schools"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Build Your Career. Shape Young"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Futures."
            />
          </div>

          <TextAreaField
            label="Hero Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. At Little Flower, we believe meaningful education begins with passionate educators..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Label"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Explore Opportunities"
            />
            <InputField
              label="CTA Target Link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. #opportunities"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <ImagePickerField
              label="Collage Primary Image (Left Large)"
              value={image1}
              onChange={setImage1}
              folder="lfcs-school/about"
              helperText="Large main photo showing teacher with students."
            />
            <ImagePickerField
              label="Collage Secondary Image (Right Small)"
              value={image2}
              onChange={setImage2}
              folder="lfcs-school/about"
              helperText="Inset photo showing classroom guidance."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <InputField
              label="Stats Badge Number"
              value={statsNumber}
              onChange={(e) => setStatsNumber(e.target.value)}
              placeholder="e.g. 8"
            />
            <InputField
              label="Stats Badge Label"
              value={statsLabel}
              onChange={(e) => setStatsLabel(e.target.value)}
              placeholder="e.g. Institutions"
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
