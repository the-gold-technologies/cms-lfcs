"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";

export interface MilestoneItem {
  year: string;
  title: string;
  desc: string;
  image: string;
}

export function OurGrowthSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "TIMELINE OF EXCELLENCE");
      setHeadline(initialData.headline ?? "Milestones in Our Journey");
      setSubtitle(
        initialData.subtitle ??
          "Key historical moments that shaped our growth and expansion across Eastern Uttar Pradesh.",
      );

      if (Array.isArray(initialData.milestones) && initialData.milestones.length > 0) {
        setMilestones(
          initialData.milestones.map((m: any) => ({
            year: m.year ?? "",
            title: m.title ?? "",
            desc: m.desc ?? m.description ?? "",
            image: m.image ?? "",
          })),
        );
      } else {
        setMilestones([
          {
            year: initialData.m1Year ?? "1993",
            title: initialData.m1Title ?? "The Beginning",
            desc:
              initialData.m1Desc ??
              "Founded by Late Shri Vijay Shankar Yadav in Mau with just 30 students and a vision for holistic schooling.",
            image:
              initialData.m1Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170045/lfcs-school/logo1_1793170045264.webp",
          },
          {
            year: initialData.m2Year ?? "2012",
            title: initialData.m2Title ?? "LFCS Kiriharapur, Ballia",
            desc:
              initialData.m2Desc ??
              "Flagship expansion into Ballia district with modern laboratories and lush sports grounds.",
            image:
              initialData.m2Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170004/lfcs-school/Khalispur-Balia_1793170003677.webp",
          },
          {
            year: initialData.m3Year ?? "2014",
            title: initialData.m3Title ?? "LFIS Khalishpur, Mau",
            desc:
              initialData.m3Desc ??
              "International-standard campus with Olympic-grade swimming pool, amphitheater, and smart classrooms.",
            image:
              initialData.m3Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170014/lfcs-school/journey-lfis-mau_1793170014137.webp",
          },
          {
            year: initialData.m4Year ?? "2024",
            title: initialData.m4Title ?? "School Associate Program",
            desc:
              initialData.m4Desc ??
              "Nationwide expansion model inaugurated by Anand Kumar and Sharman Joshi to scale quality education.",
            image:
              initialData.m4Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170008/lfcs-school/school-associate-launch_1793170008299.webp",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      {
        year: "",
        title: "",
        desc: "",
        image: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, milestones.length]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateMilestone = (index: number, field: keyof MilestoneItem, value: string) => {
    setMilestones((prev) => {
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
        section: "OurGrowthSection",
        content: {
          tagline,
          headline,
          subtitle,
          milestones,
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
        toast.success("Our Growth timeline section saved successfully!");
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
        title="7. Our Growth & Journey Milestones"
        description="Historical timeline showcasing expansion milestones from founding in 1993 to modern campuses and Associate School initiatives."
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
              placeholder="e.g. Eyebrow badge (e.g. TIMELINE OF EXCELLENCE)"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Section title (e.g. Milestones in Our Journey)"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Introductory summary of organizational expansion..."
          />

          {/* DYNAMIC MILESTONES ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Historical Milestones ({milestones.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Timeline milestones marking key years and achievements. Can add more than 4 milestones.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openIndices.length === milestones.length) {
                      setOpenIndices([]);
                    } else {
                      setOpenIndices(milestones.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {openIndices.length === milestones.length ? "Collapse All" : "Expand All"}
                </button>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>
            </div>

            {milestones.length === 0 ? (
              <div
                onClick={handleAddMilestone}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No milestones added yet. Click to add your first milestone.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {milestones.map((m, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Milestone ${idx + 1}: ${m.title || "Untitled Milestone"}`}
                    badge={m.year || undefined}
                    thumbnail={m.image}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveMilestone(idx)}
                    deleteTitle="Delete Milestone"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <InputField
                          label="Year"
                          value={m.year}
                          onChange={(e) => handleUpdateMilestone(idx, "year", e.target.value)}
                          placeholder="e.g. 1993"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <InputField
                          label="Milestone Title"
                          value={m.title}
                          onChange={(e) => handleUpdateMilestone(idx, "title", e.target.value)}
                          placeholder="e.g. The Beginning"
                        />
                      </div>
                    </div>

                    <TextAreaField
                      label="Description"
                      value={m.desc}
                      onChange={(e) => handleUpdateMilestone(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Brief history..."
                    />

                    <ImagePickerField
                      label="Milestone Photo"
                      value={m.image}
                      onChange={(url) => handleUpdateMilestone(idx, "image", url)}
                      placeholder="e.g. Cloudinary photo URL"
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
