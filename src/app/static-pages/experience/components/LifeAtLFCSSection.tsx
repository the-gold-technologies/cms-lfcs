"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleCard } from "@/components/CollapsibleCard";

export interface ExperienceHighlight {
  title: string;
}

export function LifeAtLFCSSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [experiencesTitle, setExperiencesTitle] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");

  const [experiences, setExperiences] = useState<ExperienceHighlight[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");
      setExperiencesTitle(initialData.experiencesTitle ?? "");
      setImage1(initialData.image1 ?? "");
      setImage2(initialData.image2 ?? "");

      if (Array.isArray(initialData.experiences)) {
        setExperiences(
          initialData.experiences.map((e: any) => ({
            title: typeof e === "string" ? e : (e.title ?? e.name ?? ""),
          })),
        );
      } else {
        setExperiences([]);
      }
    }
  }, [initialData]);

  const handleAddExperience = () => {
    setExperiences((prev) => [...prev, { title: "" }]);
    setOpenIndices((prev) => [...prev, experiences.length]);
  };

  const handleRemoveExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
  };

  const handleUpdateExperience = (index: number, val: string) => {
    setExperiences((prev) => {
      const copy = [...prev];
      copy[index] = { title: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "LifeAtLFCSSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          experiencesTitle,
          experiences,
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
        toast.success("Life at LFCS section saved successfully!");
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
        title="2. Daily Campus Life & Routine Highlights"
        description="Highlights regular school day activities, extracurricular schedules, and student participation."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Pre-Heading Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Life at LFCS"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Upskilling, Participating & Growing"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. EveryDay"
            />
          </div>

          <TextAreaField
            label="Section Description (Paragraphs separated by blank lines)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="e.g. At LFCS, even though academics form the core for the student..."
          />

          <InputField
            label="Experience List Header"
            value={experiencesTitle}
            onChange={(e) => setExperiencesTitle(e.target.value)}
            placeholder="e.g. A typical LFCS experience brings together:"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImagePickerField
              label="Creative Activities Photo (Top Image)"
              value={image1}
              onChange={(url) => setImage1(url)}
              placeholder="e.g. Cloudinary image URL"
              folder="lfcs-school/experience"
            />
            <ImagePickerField
              label="Sports Activities Photo (Bottom Image)"
              value={image2}
              onChange={(url) => setImage2(url)}
              placeholder="e.g. Cloudinary image URL"
              folder="lfcs-school/experience"
            />
          </div>

          {/* DYNAMIC EXPERIENCE CHECKPOINTS */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Experience Checkpoints ({experiences.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Key daily elements featured in the checklist.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddExperience}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#842b46] bg-[#842b46]/10 hover:bg-[#842b46]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {experiences.length === 0 ? (
              <div
                onClick={handleAddExperience}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#842b46] hover:text-[#842b46] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No checkpoints added yet. Click to add your first item.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {experiences.map((exp, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Item ${idx + 1}: ${exp.title || "Untitled Item"}`}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveExperience(idx)}
                    deleteTitle="Delete Item"
                  >
                    <InputField
                      label="Checkpoint Name"
                      value={exp.title}
                      onChange={(e) => handleUpdateExperience(idx, e.target.value)}
                      placeholder="e.g. Sports and physical activities"
                    />
                  </CollapsibleCard>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <div className="w-full">
              <SaveButton onClick={handleSave} loading={loading} saved={saved} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
