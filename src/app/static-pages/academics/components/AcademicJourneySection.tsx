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

  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "LEARNING PATHWAYS");
      setHeadline(initialData.headline ?? "The Academic Journey at Little Flower");

      if (Array.isArray(initialData.stages) && initialData.stages.length > 0) {
        setStages(
          initialData.stages.map((s: any) => ({
            title: s.title ?? "",
            grades: s.grades ?? "",
            desc: s.desc ?? "",
            image: s.image ?? "",
          })),
        );
      } else {
        setStages([
          {
            title: initialData.s1Title ?? "Early Years",
            grades: initialData.s1Grades ?? "[Nursery – UKG]",
            desc:
              initialData.s1Desc ??
              "Play-based exploration, sensory development, phonics, and foundational social skills.",
            image:
              initialData.s1Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170030/lfcs-school/independent_1793170030545.webp",
          },
          {
            title: initialData.s2Title ?? "Primary School",
            grades: initialData.s2Grades ?? "[Classes I – V]",
            desc:
              initialData.s2Desc ??
              "Building conceptual numeracy, bilingual literacy, environmental science, and structured habits.",
            image:
              initialData.s2Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170034/lfcs-school/activity_1793170034132.webp",
          },
          {
            title: initialData.s3Title ?? "Middle School",
            grades: initialData.s3Grades ?? "[Classes VI – VIII]",
            desc:
              initialData.s3Desc ??
              "Transitioning into rigorous subject disciplines, computer science, and creative projects.",
            image:
              initialData.s3Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170020/lfcs-school/Experience6_1793170019770.webp",
          },
          {
            title: initialData.s4Title ?? "Secondary & Senior Secondary",
            grades: initialData.s4Grades ?? "[Classes IX – XII]",
            desc:
              initialData.s4Desc ??
              "Board examination mastery in Science, Commerce, and Humanities with IIT-JEE and NEET coaching support.",
            image:
              initialData.s4Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170019/lfcs-school/digital-classroom_1793170018820.webp",
          },
        ]);
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
    try {
      const payload = {
        section: "AcademicJourneySection",
        content: {
          tagline,
          headline,
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
        toast.success("Academic Journey stages saved successfully!");
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
        title="3. Academic Journey Stages (Nursery to Class XII)"
        description="Structured learning stages: Early Years (Nursery-UKG), Primary (I-V), Middle (VI-VIII), and Senior Secondary (IX-XII)."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Eyebrow Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Eyebrow badge (e.g. LEARNING PATHWAYS)"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Section title (e.g. The Academic Journey at Little Flower)"
            />
          </div>

          {/* DYNAMIC ACADEMIC STAGES ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Academic Stages ({stages.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Educational journey levels. Can add more than 4 stages.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openIndices.length === stages.length) {
                      setOpenIndices([]);
                    } else {
                      setOpenIndices(stages.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {openIndices.length === stages.length ? "Collapse All" : "Expand All"}
                </button>
                <button
                  type="button"
                  onClick={handleAddStage}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stage</span>
                </button>
              </div>
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
                    title={`Stage ${idx + 1}: ${stage.title || "Untitled Stage"}`}
                    badge={stage.grades || undefined}
                    thumbnail={stage.image}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveStage(idx)}
                    deleteTitle="Delete Stage"
                  >
                    {/* Row 1: Title and Grades */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Stage Title"
                        value={stage.title}
                        onChange={(e) => handleUpdateStage(idx, "title", e.target.value)}
                        placeholder="e.g. Early Years"
                      />
                      <InputField
                        label="Grades Included"
                        value={stage.grades}
                        onChange={(e) => handleUpdateStage(idx, "grades", e.target.value)}
                        placeholder="e.g. [Nursery – UKG]"
                      />
                    </div>

                    {/* Row 2: Description */}
                    <TextAreaField
                      label="Curricular Focus"
                      value={stage.desc}
                      onChange={(e) => handleUpdateStage(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Play-based learning details, curriculum outcomes..."
                    />

                    {/* Row 3: Image (full width) */}
                    <ImagePickerField
                      label="Stage Photo"
                      value={stage.image}
                      onChange={(url) => handleUpdateStage(idx, "image", url)}
                      placeholder="e.g. Cloudinary early years photo URL"
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
