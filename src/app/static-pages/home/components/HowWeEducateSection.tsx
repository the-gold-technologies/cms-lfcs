"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { Plus } from "lucide-react";

export interface EducationPillar {
  title: string;
  desc: string;
}

export function HowWeEducateSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [mainImage, setMainImage] = useState("");

  const [pillars, setPillars] = useState<EducationPillar[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle(initialData.subtitle ?? "");
      setMainImage(initialData.mainImage ?? "");

      if (Array.isArray(initialData.pillars)) {
        setPillars(
          initialData.pillars.map((p: any) => ({
            title: p.title ?? "",
            desc: p.desc ?? p.description ?? "",
          })),
        );
      } else {
        setPillars([]);
      }
    }
  }, [initialData]);

  const handleAddPillar = () => {
    setPillars((prev) => [...prev, { title: "", desc: "" }]);
    setOpenIndices((prev) => [...prev, pillars.length]);
  };

  const handleRemovePillar = (index: number) => {
    setPillars((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdatePillar = (index: number, field: keyof EducationPillar, value: string) => {
    setPillars((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "HowWeEducateSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          mainImage,
          pillars,
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
        description="Highlights the school's teaching philosophy, illustrated composite graphic, and dynamic pedagogical pillars."
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

          {/* DYNAMIC PILLARS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Educational Pillars ({pillars.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Core teaching philosophies and student-development anchors. Can add more than 4 pillars.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openIndices.length === pillars.length) {
                      setOpenIndices([]);
                    } else {
                      setOpenIndices(pillars.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {openIndices.length === pillars.length ? "Collapse All" : "Expand All"}
                </button>
                <button
                  type="button"
                  onClick={handleAddPillar}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Pillar</span>
                </button>
              </div>
            </div>

            {pillars.length === 0 ? (
              <div
                onClick={handleAddPillar}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No pillars added yet. Click to add your first pillar.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {pillars.map((pillar, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Pillar ${idx + 1}: ${pillar.title || "Untitled Pillar"}`}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemovePillar(idx)}
                    deleteTitle="Delete Pillar"
                  >
                    <InputField
                      label="Pillar Title"
                      value={pillar.title}
                      onChange={(e) => handleUpdatePillar(idx, "title", e.target.value)}
                      placeholder="e.g. Experiential Learning"
                    />

                    <TextAreaField
                      label="Pillar Subtext"
                      value={pillar.desc}
                      onChange={(e) => handleUpdatePillar(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Hands-on learning that builds curiosity."
                    />
                  </CollapsibleCard>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
