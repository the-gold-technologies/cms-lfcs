"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function AboutHeroSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "About Us");
      setHeadline(initialData.headline ?? "Empowering Minds, Nurturing");
      setScriptAccent(initialData.scriptAccent ?? "Futures.");
      setDescription(initialData.description ?? "Discover the heart of Little Flower Group of Schools. A legacy of excellence, rooted in values, and dedicated to shaping the leaders of tomorrow.");
      setCtaText(initialData.ctaText ?? "Explore Our Story");
      setCtaLink(initialData.ctaLink ?? "#our-story");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "AboutHeroSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          ctaText,
          ctaLink,
        },
      };

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("About Hero section saved successfully!");
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
        title="1. About Us Hero Banner"
        description="Above-the-fold welcoming statement on the About Us page with script accent typography and scroll prompt."
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
              placeholder="e.g. Eyebrow badge (e.g. About Us)"
            />
            <InputField
              label="Primary Heading"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Primary headline (e.g. Empowering Minds, Nurturing)"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Script word flourish (e.g. Futures.)"
            />
          </div>

          <TextAreaField
            label="Hero Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Describe the heritage and vision of Little Flower..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Label"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Button label (e.g. Explore Our Story)"
            />
            <InputField
              label="CTA Target Link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. Target anchor (e.g. #our-story)"
            />
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
