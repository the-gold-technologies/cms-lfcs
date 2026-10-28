"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function AdmissionsHeroSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "Admissions at Little Flower Group of Schools");
      setHeadline(initialData.headline ?? "Take the First Step Towards a");
      setScriptAccent(initialData.scriptAccent ?? "Brighter Future.");
      setDescription(
        initialData.description ??
          "Every child deserves an environment where learning helps them build knowledge, confidence, and character. At LFCS, our aim is to provide students with a strong academic foundation leading to lifelong opportunities.",
      );
      setCtaText(initialData.ctaText ?? "Enquire About Admissions");
      setCtaLink(initialData.ctaLink ?? "#admission-enquiry");
      setImage(
        initialData.image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170040/lfcs-school/life1_1793170040339.webp",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "AdmissionsHeroSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          ctaText,
          ctaLink,
          image,
        },
      };

      const res = await fetch("/api/admissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Admissions Hero saved successfully!");
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
        title="1. Admissions Hero Banner"
        description="Top banner welcoming prospective parents with script accent, enrollment overview, and enquiry jump button."
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
              placeholder="e.g. Admissions at Little Flower Group of Schools"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Take the First Step Towards a"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Brighter Future."
            />
          </div>

          <TextAreaField
            label="Hero Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Admissions philosophy narrative..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Label"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Enquire About Admissions"
            />
            <InputField
              label="CTA Target Anchor"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. #admission-enquiry"
            />
          </div>

          <ImagePickerField
            label="Hero Photo / Illustration"
            value={image}
            onChange={(url) => setImage(url)}
            placeholder="e.g. Cloudinary student photo URL"
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
