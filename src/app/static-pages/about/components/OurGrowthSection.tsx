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
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle(initialData.subtitle ?? "");

      if (Array.isArray(initialData.milestones)) {
        setMilestones(
          initialData.milestones.map((m: any) => ({
            year: m.year ?? "",
            title: m.title ?? "",
            desc: m.desc ?? m.description ?? "",
            image: m.image ?? "",
          })),
        );
      } else {
        setMilestones([]);
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

  const handleUpdateMilestone = (
    index: number,
    field: keyof MilestoneItem,
    val: string,
  ) => {
    setMilestones((prev) => {
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
        section: "OurGrowthSection",
        content: {
          tagline,
          headline,
          scriptAccent,
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
        toast.success("Our Growth timeline saved successfully!");
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
        title="7. Our Growth Timeline (Milestones)"
        description="Historical journey of Little Flower Group from 1993 inception through multi-district campus expansion and modern milestones."
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
              placeholder="e.g. Our Journey"
            />
            <InputField
              label="Primary Heading"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Growing with"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Purpose"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. From 30 students in a temporary space to a network of CBSE schools..."
          />

          {/* DYNAMIC MILESTONES ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Timeline Milestones ({milestones.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Chronological landmark events with photographs and narrative milestones.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#842b46] hover:text-[#0a192f] bg-[#842b46]/10 hover:bg-[#842b46]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
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
                {milestones.map((milestone, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={
                      milestone.year && milestone.title
                        ? `${milestone.year} - ${milestone.title}`
                        : `Milestone ${idx + 1}`
                    }
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveMilestone(idx)}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <InputField
                        label="Year / Period"
                        value={milestone.year}
                        onChange={(e) => handleUpdateMilestone(idx, "year", e.target.value)}
                        placeholder="e.g. 1993"
                      />
                      <div className="sm:col-span-2">
                        <InputField
                          label="Milestone Title"
                          value={milestone.title}
                          onChange={(e) => handleUpdateMilestone(idx, "title", e.target.value)}
                          placeholder="e.g. The Beginning"
                        />
                      </div>
                    </div>

                    <TextAreaField
                      label="Milestone Description"
                      value={milestone.desc}
                      onChange={(e) => handleUpdateMilestone(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Founded by Late Shri Vijay Shankar Yadav in a temporary space..."
                    />

                    <ImagePickerField
                      label="Milestone Photo / Landmark"
                      value={milestone.image}
                      onChange={(url) => handleUpdateMilestone(idx, "image", url)}
                      folder="lfcs-school/about"
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
