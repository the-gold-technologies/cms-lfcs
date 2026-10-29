"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { Plus, Trash2 } from "lucide-react";

export interface StoryStat {
  value: string;
  label: string;
}

export function OurStorySection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [story, setStory] = useState("");
  const [storyImage1, setStoryImage1] = useState("");
  const [storyImage2, setStoryImage2] = useState("");

  const [stats, setStats] = useState<StoryStat[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setStory(initialData.story ?? "");
      setStoryImage1(initialData.storyImage1 ?? "");
      setStoryImage2(initialData.storyImage2 ?? "");

      if (Array.isArray(initialData.stats)) {
        setStats(
          initialData.stats.map((s: any) => ({
            value: s.value ?? "",
            label: s.label ?? "",
          })),
        );
      } else {
        setStats([]);
      }
    }
  }, [initialData]);

  const handleAddStat = () => {
    setStats((prev) => [...prev, { value: "", label: "" }]);
  };

  const handleRemoveStat = (index: number) => {
    setStats((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateStat = (index: number, field: keyof StoryStat, value: string) => {
    setStats((prev) => {
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
        section: "OurStorySection",
        content: {
          tagline,
          headline,
          scriptAccent,
          story,
          storyImage1,
          storyImage2,
          stats,
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
        toast.success("Our Story section saved successfully!");
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
        title="2. Our Story (Foundational Legacy)"
        description="The story of how Late Shri Vijay Shankar Yadav established Little Flower in 1993 and grew it into a premier educational institution."
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
              placeholder="e.g. Our Story"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. A Journey of"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Dedication"
            />
          </div>

          {/* SINGLE STORY NARRATIVE TEXTAREA WITH WHITE LINE SPACE */}
          <TextAreaField
            label="Story Narrative"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={6}
            tooltip="Separate paragraphs with a blank line (hit Enter twice)."
            helperText="Hit Enter twice between paragraphs to create clean white line spaces just like on the live website."
            placeholder="Write the founding narrative here. Separate multiple paragraphs by hitting Enter twice..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImagePickerField
              label="Story Primary Photo"
              value={storyImage1}
              onChange={setStoryImage1}
              folder="lfcs-school/about"
            />
            <ImagePickerField
              label="Story Secondary Photo"
              value={storyImage2}
              onChange={setStoryImage2}
              folder="lfcs-school/about"
            />
          </div>

          {/* DYNAMIC HISTORICAL METRICS */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Historical Milestones ({stats.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Milestone numbers and foundational stats.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddStat}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Metric</span>
              </button>
            </div>

            {stats.length === 0 ? (
              <div
                onClick={handleAddStat}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No metrics added yet. Click to add your first metric.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-1.5">
                      <span className="text-[11px] font-bold text-[#0E5A60]">
                        Milestone #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStat(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <InputField
                      label="Value"
                      value={st.value}
                      onChange={(e) => handleUpdateStat(idx, "value", e.target.value)}
                      placeholder="e.g. 1993"
                    />

                    <InputField
                      label="Label"
                      value={st.label}
                      onChange={(e) => handleUpdateStat(idx, "label", e.target.value)}
                      placeholder="e.g. Year Founded"
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
