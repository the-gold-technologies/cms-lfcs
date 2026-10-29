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

interface AwardItem {
  title: string;
  desc: string;
  image?: string;
  images?: string[];
}

export function AwardsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [quote, setQuote] = useState("");

  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setQuote(initialData.quote ?? "");

      if (Array.isArray(initialData.awards)) {
        setAwards(
          initialData.awards.map((a: any) => ({
            title: a.title ?? "",
            desc: a.desc ?? "",
            image: a.image ?? (Array.isArray(a.images) && a.images.length > 0 ? a.images[0] : ""),
            images: Array.isArray(a.images) ? a.images : a.image ? [a.image] : [],
          })),
        );
      } else {
        setAwards([]);
      }
    }
  }, [initialData]);

  const handleAddAward = () => {
    setAwards((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
        image: "",
        images: [],
      },
    ]);
    setOpenIndices((prev) => [...prev, awards.length]);
  };

  const handleRemoveAward = (index: number) => {
    setAwards((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
  };

  const handleUpdateAward = (index: number, field: keyof AwardItem, val: any) => {
    setAwards((prev) => {
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
        section: "AwardsSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          quote,
          awards: awards.map((a) => ({
            title: a.title,
            desc: a.desc,
            image: a.image,
            images: a.images && a.images.length > 0 ? a.images : a.image ? [a.image] : [],
          })),
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
        toast.success("Awards section saved successfully!");
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
        title="8. Recognition & Achievements (Awards)"
        description="Major national and international institutional accolades, educational summit awards, and media honours."
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
              placeholder="e.g. Recognition & Achievements"
            />
            <InputField
              label="Main Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. A Legacy of"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Excellence"
            />
          </div>

          <InputField
            label="Pull Quote / Motto"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="e.g. Nationally Honoured, Internationally Recognised"
          />

          {/* DYNAMIC AWARDS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Awards & Honours ({awards.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Dynamic institutional accolades with ceremony photos.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddAward}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#842b46] hover:text-[#0a192f] bg-[#842b46]/10 hover:bg-[#842b46]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Award</span>
              </button>
            </div>

            {awards.length === 0 ? (
              <div
                onClick={handleAddAward}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No awards added yet. Click to add your first award.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {awards.map((award, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={award.title || `Award ${idx + 1}`}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveAward(idx)}
                  >
                    <InputField
                      label="Award Title"
                      value={award.title}
                      onChange={(e) => handleUpdateAward(idx, "title", e.target.value)}
                      placeholder="e.g. International Academic Recognition"
                    />

                    <TextAreaField
                      label="Award Narrative"
                      value={award.desc}
                      onChange={(e) => handleUpdateAward(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Representation at the 1st International & 31st Annual Conference..."
                    />

                    <ImagePickerField
                      label="Ceremony Photo / Plaque"
                      value={award.image || ""}
                      onChange={(url) => {
                        handleUpdateAward(idx, "image", url);
                        handleUpdateAward(idx, "images", [url]);
                      }}
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
