"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function ArtsCultureSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "ARTS & CREATIVE EXPRESSION");
      setHeadline(initialData.headline ?? "A Space to Create &");
      setScriptAccent(initialData.scriptAccent ?? "Express");
      setDescription(
        initialData.description ??
          "At LFCS, we nurture creative instincts. Through painting, pottery, theatre, vocal music, instrumental bands, and cultural dance festivals, every child discovers their inner artist.",
      );
      setImage1(
        initialData.image1 ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170035/lfcs-school/art1_1793170035130.webp",
      );
      setImage2(
        initialData.image2 ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170039/lfcs-school/art2_1793170039436.webp",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "ArtsCultureSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
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
        toast.success("Arts & Culture section saved successfully!");
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
        title="4. Arts, Culture & Creativity"
        description="Showcase fine arts studios, music concerts, classical dance, and annual cultural celebrations."
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
              placeholder="e.g. ARTS & CREATIVE EXPRESSION"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. A Space to Create &"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Express"
            />
          </div>

          <TextAreaField
            label="Section Narrative"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Arts and culture curriculum narrative..."
          />

          <div className="space-y-4">
            <ImagePickerField
              label="Creative Arts Photo 1"
              value={image1}
              onChange={(url) => setImage1(url)}
              placeholder="e.g. Cloudinary art photo URL"
            />
            <ImagePickerField
              label="Cultural Performance Photo 2"
              value={image2}
              onChange={(url) => setImage2(url)}
              placeholder="e.g. Cloudinary cultural photo URL"
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
