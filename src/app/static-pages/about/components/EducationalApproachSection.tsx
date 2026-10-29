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

interface ApproachPillar {
  title: string;
  desc: string;
  image: string;
}

export function EducationalApproachSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");

  const [pillars, setPillars] = useState<ApproachPillar[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "OUR PHILOSOPHY");
      setHeadline(initialData.headline ?? "A Thoughtful Educational Approach");
      setDescription(
        initialData.description ??
          "Our academic paradigm integrates modern cognitive science with time-tested values.",
      );

      if (Array.isArray(initialData.pillars) && initialData.pillars.length > 0) {
        setPillars(
          initialData.pillars.map((p: any) => ({
            title: p.title ?? "",
            desc: p.desc ?? "",
            image: p.image ?? "",
          })),
        );
      } else {
        setPillars([
          {
            title: initialData.app1Title ?? "Child-Centered Learning",
            desc:
              initialData.app1Desc ??
              "We focus on nurturing curiosity and encouraging exploration tailored to each learner.",
            image:
              initialData.app1Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170030/lfcs-school/independent_1793170030545.webp",
          },
          {
            title: initialData.app2Title ?? "Experiential Learning",
            desc:
              initialData.app2Desc ??
              "Hands-on experiences that make learning meaningful, relevant, and lasting.",
            image:
              initialData.app2Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170028/lfcs-school/practical_1793170027731.webp",
          },
          {
            title: initialData.app3Title ?? "Holistic Development",
            desc:
              initialData.app3Desc ??
              "We nurture academics, creativity, athletics, and life skills equally.",
            image:
              initialData.app3Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170034/lfcs-school/activity_1793170034132.webp",
          },
          {
            title: initialData.app4Title ?? "Values & Character",
            desc:
              initialData.app4Desc ??
              "Building strong moral compass, empathy, and respect for a better tomorrow.",
            image:
              initialData.app4Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170022/lfcs-school/collabrative_1793170021825.webp",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddPillar = () => {
    setPillars((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
        image: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, pillars.length]);
  };

  const handleRemovePillar = (index: number) => {
    setPillars((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdatePillar = (index: number, field: keyof ApproachPillar, val: string) => {
    setPillars((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "EducationalApproachSection",
        content: {
          tagline,
          headline,
          description,
          pillars,
        },
      };

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Educational Approach section saved successfully!");
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
        title="4. Educational Approach Pillars"
        description="Foundational learning principles: Child-Centered, Experiential, Holistic Development, and Values & Character."
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
              placeholder="e.g. Eyebrow badge (e.g. OUR PHILOSOPHY)"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Section title (e.g. A Thoughtful Educational Approach)"
            />
          </div>

          <TextAreaField
            label="Section Overview"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. Overview introducing the multi-faceted pedagogy..."
          />

          {/* DYNAMIC APPROACH PILLARS */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Approach Pillars ({pillars.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Core instructional philosophies. Can add more than 4 pillars.
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
                    thumbnail={pillar.image}
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
                      placeholder="e.g. Child-Centered Learning"
                    />

                    <TextAreaField
                      label="Pillar Description"
                      value={pillar.desc}
                      onChange={(e) => handleUpdatePillar(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Detail on personalized learning..."
                    />

                    <ImagePickerField
                      label="Pillar Photo"
                      value={pillar.image}
                      onChange={(url) => handleUpdatePillar(idx, "image", url)}
                      placeholder="e.g. Cloudinary image URL"
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
