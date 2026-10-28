"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function HowWeEducateSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [mainImage, setMainImage] = useState("");

  const [pillar1Title, setPillar1Title] = useState("");
  const [pillar1Desc, setPillar1Desc] = useState("");
  const [pillar2Title, setPillar2Title] = useState("");
  const [pillar2Desc, setPillar2Desc] = useState("");
  const [pillar3Title, setPillar3Title] = useState("");
  const [pillar3Desc, setPillar3Desc] = useState("");
  const [pillar4Title, setPillar4Title] = useState("");
  const [pillar4Desc, setPillar4Desc] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "HOW WE EDUCATE");
      setHeadline(initialData.headline ?? "Learning Beyond");
      setScriptAccent(initialData.scriptAccent ?? "Classrooms");
      setSubtitle(
        initialData.subtitle ??
          "We blend strong academics with innovation and creativity to nurture curious minds and confident hearts.",
      );
      setMainImage(
        initialData.mainImage ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170022/lfcs-school/collabrative_1793170021825.webp",
      );

      setPillar1Title(initialData.pillar1Title ?? "Experiential Learning");
      setPillar1Desc(initialData.pillar1Desc ?? "Hands-on learning that builds curiosity.");
      setPillar2Title(initialData.pillar2Title ?? "Academic Excellence");
      setPillar2Desc(initialData.pillar2Desc ?? "Strong foundation with personalized support.");
      setPillar3Title(initialData.pillar3Title ?? "Technology & Innovation");
      setPillar3Desc(initialData.pillar3Desc ?? "Smart classrooms and digital integration.");
      setPillar4Title(initialData.pillar4Title ?? "Holistic Growth");
      setPillar4Desc(
        initialData.pillar4Desc ?? "Sports, arts and life skills for total development.",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "HowWeEducateSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          mainImage,
          pillar1Title,
          pillar1Desc,
          pillar2Title,
          pillar2Desc,
          pillar3Title,
          pillar3Desc,
          pillar4Title,
          pillar4Desc,
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
        toast.success("How We Educate section saved successfully!");
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
        title="4. How We Educate (Learning Methodology)"
        description="Highlights the school's teaching philosophy, illustrated composite graphic, and 4 pedagogical pillars."
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
              placeholder="e.g. Section category (e.g. HOW WE EDUCATE)"
            />
            <InputField
              label="Heading Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Primary title (e.g. Learning Beyond)"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Cursive word flourish (e.g. Classrooms)"
            />
          </div>

          <TextAreaField
            label="Methodology Overview"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Describe the student-centric pedagogical balance..."
          />

          <ImagePickerField
            label="Section Feature Graphic"
            value={mainImage}
            onChange={(url) => setMainImage(url)}
            placeholder="e.g. Select Cloudinary classroom illustration / photo"
          />

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              4 Educational Pillars
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Pillar 1 Title"
                  value={pillar1Title}
                  onChange={(e) => setPillar1Title(e.target.value)}
                  placeholder="e.g. Experiential Learning"
                />
                <TextAreaField
                  label="Pillar 1 Subtext"
                  value={pillar1Desc}
                  onChange={(e) => setPillar1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Hands-on learning that builds curiosity."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Pillar 2 Title"
                  value={pillar2Title}
                  onChange={(e) => setPillar2Title(e.target.value)}
                  placeholder="e.g. Academic Excellence"
                />
                <TextAreaField
                  label="Pillar 2 Subtext"
                  value={pillar2Desc}
                  onChange={(e) => setPillar2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Strong foundation with personalized support."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Pillar 3 Title"
                  value={pillar3Title}
                  onChange={(e) => setPillar3Title(e.target.value)}
                  placeholder="e.g. Technology & Innovation"
                />
                <TextAreaField
                  label="Pillar 3 Subtext"
                  value={pillar3Desc}
                  onChange={(e) => setPillar3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Smart classrooms and digital integration."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Pillar 4 Title"
                  value={pillar4Title}
                  onChange={(e) => setPillar4Title(e.target.value)}
                  placeholder="e.g. Holistic Growth"
                />
                <TextAreaField
                  label="Pillar 4 Subtext"
                  value={pillar4Desc}
                  onChange={(e) => setPillar4Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Sports, arts and life skills for total development."
                />
              </div>
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
