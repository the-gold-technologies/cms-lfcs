"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function WorkCultureSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [valuesList, setValuesList] = useState("");
  const [cultureImage, setCultureImage] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "OUR WORK CULTURE");
      setHeadline(initialData.headline ?? "Growing Together Through Learning &");
      setScriptAccent(initialData.scriptAccent ?? "Collaboration");
      setDescription(
        initialData.description ??
          "At Little Flower Group of Schools, we recognise that educators and staff play a defining role in shaping the student experience. We maintain an open, merit-driven environment where ideas are encouraged and achievements celebrated.",
      );
      setValuesList(
        initialData.valuesList ??
          "Professionalism, Integrity, Mutual Respect, Responsibility, Willingness to Learn, Child Centricity",
      );
      setCultureImage(
        initialData.cultureImage ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170022/lfcs-school/collabrative_1793170021825.webp",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "WorkCultureSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          valuesList,
          cultureImage,
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
        toast.success("Work Culture section saved successfully!");
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
        title="3. Workplace Culture & Staff Ethos"
        description="Highlights peer collaboration, professional values, and staff photographs."
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
              placeholder="e.g. OUR WORK CULTURE"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Growing Together Through Learning &"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Collaboration"
            />
          </div>

          <TextAreaField
            label="Culture Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Staff ethos and workplace values..."
          />

          <TextAreaField
            label="Core Workplace Values (Comma Separated)"
            value={valuesList}
            onChange={(e) => setValuesList(e.target.value)}
            rows={2}
            placeholder="e.g. Professionalism, Integrity, Mutual Respect..."
          />

          <ImagePickerField
            label="Staff Photo / Workplace Visual"
            value={cultureImage}
            onChange={(url) => setCultureImage(url)}
            placeholder="e.g. Cloudinary staff photo URL"
          />

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
