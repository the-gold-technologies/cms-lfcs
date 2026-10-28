"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
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

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "Careers at Little Flower Group of Schools");
      setHeadline(initialData.headline ?? "Build Your Career. Shape Young");
      setScriptAccent(initialData.scriptAccent ?? "Futures.");
      setDescription(initialData.description ?? "At Little Flower, we believe meaningful education begins with passionate educators and professionals. We welcome individuals who want to empower the next generation.");
      setCtaText(initialData.ctaText ?? "Explore Open Positions");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "CareersHeroSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          ctaText,
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
    } catch (err: any) {
      toast.error(err?.message || "Network error while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6">
      <SectionHeader
        title="1. Careers Hero Banner"
        description="Top recruitment header inviting educators and administrative leaders with script accent."
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
            placeholder="e.g. Professional recruitment philosophy..."
          />

          <InputField
            label="CTA Button Label"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder="e.g. Explore Open Positions"
          />

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
