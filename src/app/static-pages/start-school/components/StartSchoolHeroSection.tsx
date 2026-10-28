"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function StartSchoolHeroSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "Start a School");
      setHeadline(initialData.headline ?? "Start a School. Shape a");
      setScriptAccent(initialData.scriptAccent ?? "Future.");
      setDescription(
        initialData.description ??
          "Become an LFCS Associate Partner and bring premier CBSE education to your city, in collaboration with educational entrepreneurs who share our 40-year legacy.",
      );
      setButtonText(initialData.buttonText ?? "Start Your Enquiry");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "StartSchoolHeroSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          buttonText,
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
        toast.success("Start School Hero saved successfully!");
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
        title="1. Start a School Hero Banner"
        description="Top partnership banner with script accent and proposal initiation trigger."
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
              placeholder="e.g. Start a School"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Start a School. Shape a"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Future."
            />
          </div>

          <TextAreaField
            label="Hero Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Partnership proposition summary..."
          />

          <InputField
            label="Enquiry CTA Button Label"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            placeholder="e.g. Start Your Enquiry"
          />

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
