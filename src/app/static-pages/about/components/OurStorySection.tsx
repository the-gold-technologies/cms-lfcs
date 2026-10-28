"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
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

  const [stats, setStats] = useState<StoryStat[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "Our Story");
      setHeadline(initialData.headline ?? "A Journey of");
      setScriptAccent(initialData.scriptAccent ?? "Dedication");

      if (initialData.story) {
        setStory(initialData.story);
      } else if (initialData.paragraph1 || initialData.paragraph2) {
        setStory([initialData.paragraph1, initialData.paragraph2].filter(Boolean).join("\n\n"));
      } else {
        setStory(
          "Founded in 1993 by Late Shri Vijay Shankar Yadav in a temporary space with just 30 students and a big dream, Little Flower School began its journey with a simple mission: to provide quality, value-based education that goes beyond textbooks.\n\nOver the past three decades, we have grown from a modest neighborhood school into a network of CBSE-affiliated schools across Uttar Pradesh. What hasn't changed is our commitment to fostering a nurturing environment where every child feels valued, encouraged, and challenged.",
        );
      }

      if (Array.isArray(initialData.stats) && initialData.stats.length > 0) {
        setStats(
          initialData.stats.map((s: any) => ({
            value: s.value ?? "",
            label: s.label ?? "",
          })),
        );
      } else {
        setStats([
          {
            value: initialData.stat1Number ?? "1993",
            label: initialData.stat1Text ?? "Year Founded with 30 Students",
          },
          {
            value: initialData.stat2Number ?? "30+",
            label: initialData.stat2Text ?? "Years of Transformative Growth",
          },
        ]);
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
      const paragraphs = story.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

      const payload = {
        section: "OurStorySection",
        content: {
          tagline,
          headline,
          scriptAccent,
          story, // Single narrative with white line space between paragraphs!
          // Backward compatibility:
          paragraph1: paragraphs[0] ?? "",
          paragraph2: paragraphs[1] ?? "",
          stats,
          stat1Number: stats[0]?.value ?? "",
          stat1Text: stats[0]?.label ?? "",
          stat2Number: stats[1]?.value ?? "",
          stat2Text: stats[1]?.label ?? "",
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
              placeholder="e.g. Section category tag (e.g. Our Story)"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Title lead (e.g. A Journey of)"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Cursive word (e.g. Dedication)"
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
                      placeholder="e.g. Year Founded with 30 Students"
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
