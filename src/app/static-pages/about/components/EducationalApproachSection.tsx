"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

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
  };

  const handleRemovePillar = (index: number) => {
    setPillars((prev) => prev.filter((_, i) => i !== index));
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
          pillars, // dynamic array object!
          // Backward compatibility:
          app1Title: pillars[0]?.title ?? "",
          app1Desc: pillars[0]?.desc ?? "",
          app1Image: pillars[0]?.image ?? "",
          app2Title: pillars[1]?.title ?? "",
          app2Desc: pillars[1]?.desc ?? "",
          app2Image: pillars[1]?.image ?? "",
          app3Title: pillars[2]?.title ?? "",
          app3Desc: pillars[2]?.desc ?? "",
          app3Image: pillars[2]?.image ?? "",
          app4Title: pillars[3]?.title ?? "",
          app4Desc: pillars[3]?.desc ?? "",
          app4Image: pillars[3]?.image ?? "",
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
              <button
                type="button"
                onClick={handleAddPillar}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pillar</span>
              </button>
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
              <div className="space-y-4">
                {pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3.5 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Pillar #{idx + 1}: {pillar.title || "Untitled Pillar"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePillar(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Pillar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Row 1: Title */}
                    <InputField
                      label="Pillar Title"
                      value={pillar.title}
                      onChange={(e) => handleUpdatePillar(idx, "title", e.target.value)}
                      placeholder="e.g. Child-Centered Learning"
                    />

                    {/* Row 2: Description */}
                    <TextAreaField
                      label="Pillar Description"
                      value={pillar.desc}
                      onChange={(e) => handleUpdatePillar(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Detail on personalized learning..."
                    />

                    {/* Row 3: Image (full width) */}
                    <ImagePickerField
                      label="Pillar Photo"
                      value={pillar.image}
                      onChange={(url) => handleUpdatePillar(idx, "image", url)}
                      placeholder="e.g. Cloudinary image URL"
                    />
                  </div>
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
