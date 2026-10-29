"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface JourneyStage {
  title: string;
  grades: string;
  desc: string;
  image: string;
}

export function AcademicJourneySection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");

  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle(initialData.subtitle ?? "");
      setCtaText(initialData.ctaText ?? "");
      setCtaLink(initialData.ctaLink ?? "");

      if (Array.isArray(initialData.stages)) {
        setStages(
          initialData.stages.map((s: any) => ({
            title: s.title ?? "",
            grades: s.grades ?? "",
            desc: s.desc ?? s.description ?? "",
            image: s.image ?? "",
          })),
        );
      } else {
        setStages([]);
      }
    }
  }, [initialData]);

  const handleAddStage = () => {
    setStages((prev) => [
      ...prev,
      {
        title: "",
        grades: "",
        desc: "",
        image: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, stages.length]);
  };

  const handleRemoveStage = (index: number) => {
    setStages((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateStage = (index: number, field: keyof JourneyStage, val: string) => {
    setStages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "AcademicJourneySection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          ctaText,
          ctaLink,
          stages,
        },
      };

      const res = await fetch("/api/academics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Academic Journey saved successfully!");
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
        title="3. Academic Journey Stages (Nursery to XII)"
        description="The 5 pedagogical milestones from Early Years through Primary, Middle, Secondary, and Senior Secondary."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Pre-Heading Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Academic Journey"
            />
            <InputField
              label="Main Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Academic Journey That"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Progresses"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Headline Suffix / Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. with Every Stage"
            />
            <InputField
              label="CTA Button Label"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Explore Admissions"
            />
            <InputField
              label="CTA Button Link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. /contact#contact-form"
            />
          </div>

          {/* DYNAMIC JOURNEY STAGES ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Learning Stages ({stages.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Chronological grade stages from Nursery through Class XII.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddStage}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#842b46] hover:text-[#0a192f] bg-[#842b46]/10 hover:bg-[#842b46]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stage</span>
              </button>
            </div>

            {stages.length === 0 ? (
              <div
                onClick={handleAddStage}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No stages added yet. Click to add your first stage.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {stages.map((stage, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={
                      stage.title && stage.grades
                        ? `${stage.title} ${stage.grades}`
                        : stage.title || `Stage ${idx + 1}`
                    }
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveStage(idx)}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Stage Title"
                        value={stage.title}
                        onChange={(e) => handleUpdateStage(idx, "title", e.target.value)}
                        placeholder="e.g. Early Years"
                      />
                      <InputField
                        label="Grades Badge"
                        value={stage.grades}
                        onChange={(e) => handleUpdateStage(idx, "grades", e.target.value)}
                        placeholder="e.g. [Nursery – UKG]"
                      />
                    </div>

                    <TextAreaField
                      label="Stage Description"
                      value={stage.desc}
                      onChange={(e) => handleUpdateStage(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Focus on developing foundational skills through play-based learning..."
                    />

                    <ImagePickerField
                      label="Stage Photo"
                      value={stage.image}
                      onChange={(url) => handleUpdateStage(idx, "image", url)}
                      folder="lfcs-school/academics"
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
