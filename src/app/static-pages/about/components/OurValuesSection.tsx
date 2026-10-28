"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface ValueItem {
  title: string;
  desc: string;
}

export function OurValuesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");

  const [values, setValues] = useState<ValueItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "OUR VALUES");
      setHeadline(initialData.headline ?? "Principles That Define Little Flower");

      if (Array.isArray(initialData.values) && initialData.values.length > 0) {
        setValues(
          initialData.values.map((v: any) => ({
            title: v.title ?? "",
            desc: v.desc ?? "",
          })),
        );
      } else {
        setValues([
          {
            title: initialData.val1Title ?? "Integrity",
            desc:
              initialData.val1Desc ??
              "We do the right thing at all times, even when no one is watching.",
          },
          {
            title: initialData.val2Title ?? "Respect",
            desc:
              initialData.val2Desc ??
              "We value every single individual and treat everyone with empathy and kindness.",
          },
          {
            title: initialData.val3Title ?? "Excellence",
            desc:
              initialData.val3Desc ??
              "We consistently strive for the highest academic and moral standards in all that we do.",
          },
          {
            title: initialData.val4Title ?? "Innovation",
            desc:
              initialData.val4Desc ??
              "We embrace modern ideas, critical thinking, and creativity to solve real-world challenges.",
          },
          {
            title: initialData.val5Title ?? "Compassion",
            desc:
              initialData.val5Desc ??
              "We foster empathy, active community service, and sincere care for all living things.",
          },
          {
            title: initialData.val6Title ?? "Perseverance",
            desc:
              initialData.val6Desc ??
              "We build grit, resilience, and quiet determination to overcome challenges.",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddValue = () => {
    setValues((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
      },
    ]);
  };

  const handleRemoveValue = (index: number) => {
    setValues((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateValue = (index: number, field: keyof ValueItem, val: string) => {
    setValues((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "OurValuesSection",
        content: {
          tagline,
          headline,
          values,
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
        toast.success("Core Values section saved successfully!");
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
        title="5. Core Values (Institutional Tenets)"
        description="Moral compass tenets: Integrity, Respect, Excellence, Innovation, Compassion, and Perseverance."
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
              placeholder="e.g. Eyebrow badge (e.g. OUR VALUES)"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Section title (e.g. Principles That Define Little Flower)"
            />
          </div>

          {/* DYNAMIC CORE VALUES ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Institutional Tenets ({values.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Core values instilled across campuses. Can add more than 6 values.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddValue}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Value</span>
              </button>
            </div>

            {values.length === 0 ? (
              <div
                onClick={handleAddValue}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No values added yet. Click to add your first core value.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {values.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Value #{idx + 1}: {v.title || "Untitled"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveValue(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Value"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <InputField
                      label="Value Title"
                      value={v.title}
                      onChange={(e) => handleUpdateValue(idx, "title", e.target.value)}
                      placeholder="e.g. Integrity"
                    />

                    <TextAreaField
                      label="Description"
                      value={v.desc}
                      onChange={(e) => handleUpdateValue(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Ethical character explanation..."
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
