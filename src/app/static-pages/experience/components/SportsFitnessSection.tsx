"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function SportsFitnessSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [calloutText, setCalloutText] = useState("");

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "SPORTS & ATHLETICS");
      setHeadline(initialData.headline ?? "Building Physical Resilience &");
      setScriptAccent(initialData.scriptAccent ?? "Team Spirit");
      setDescription(initialData.description ?? "Physical activity and sportsmanship are integral to life at Little Flower. From cricket pitches, basketball courts, and athletics tracks to Olympic-standard swimming facilities at LFIS, students find ample space to excel.");
      setCalloutText(initialData.calloutText ?? "Teamwork, discipline, and fair play on every field.");
      setImage1(initialData.image1 ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170017/lfcs-school/sports1_1793170017007.webp");
      setImage2(initialData.image2 ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170037/lfcs-school/sports2_1793170037412.webp");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "SportsFitnessSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          calloutText,
          image1,
          image2,
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
        toast.success("Sports & Fitness section saved successfully!");
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
        title="3. Sports, Athletics & Fitness"
        description="Showcase outdoor sports complexes, swimming pools, athletic meets, and physical education."
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
              placeholder="e.g. SPORTS & ATHLETICS"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Building Physical Resilience &"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Team Spirit"
            />
          </div>

          <TextAreaField
            label="Section Narrative"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Sports facilities and tournaments narrative..."
          />

          <InputField
            label="Highlight Callout Box Text"
            value={calloutText}
            onChange={(e) => setCalloutText(e.target.value)}
            placeholder="e.g. Teamwork, discipline, and fair play on every field."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImagePickerField
              label="Sports Photo 1"
              value={image1}
              onChange={(url) => setImage1(url)}
              placeholder="e.g. Cloudinary sports photo URL"
            />
            <ImagePickerField
              label="Sports Photo 2"
              value={image2}
              onChange={(url) => setImage2(url)}
              placeholder="e.g. Cloudinary sports photo URL"
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
