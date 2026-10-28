"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function GalleryHeroSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "Photo Gallery");
      setHeadline(initialData.headline ?? "Moments from");
      setScriptAccent(initialData.scriptAccent ?? "Our Campuses.");
      setDescription(
        initialData.description ??
          "A look inside Little Flower schools: our classrooms, labs, early years, sports, culture and the events that make school life memorable.",
      );
    } else {
      setTagline("Photo Gallery");
      setHeadline("Moments from");
      setScriptAccent("Our Campuses.");
      setDescription(
        "A look inside Little Flower schools: our classrooms, labs, early years, sports, culture and the events that make school life memorable.",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/gallery-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "GalleryHeroSection",
          content: {
            tagline,
            headline,
            scriptAccent,
            description,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Gallery Hero section saved!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save");
      }
    } catch {
      toast.error("Network error saving section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100">
      <SectionHeader
        title="1. Gallery Hero Header"
        description="The opening banner for the Photo Gallery page with gold pill tag, bold headline, script cursive accent, and descriptive subtitle."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-5 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Eyebrow Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Photo Gallery"
            />
            <InputField
              label="Main Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Moments from"
            />
            <InputField
              label="Script Cursive Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Our Campuses."
            />
          </div>

          <TextAreaField
            label="Hero Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. A look inside Little Flower schools: our classrooms, labs, early years, sports, culture..."
          />

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}

