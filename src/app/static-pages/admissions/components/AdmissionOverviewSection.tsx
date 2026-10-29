"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleCard } from "@/components/CollapsibleCard";

export interface AdmissionPillar {
  title: string;
  desc: string;
}

export function AdmissionOverviewSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [overview, setOverview] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");

  const [pillars, setPillars] = useState<AdmissionPillar[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setOverview(initialData.overview ?? "");
      setCtaText(initialData.ctaText ?? "");
      setCtaLink(initialData.ctaLink ?? "");

      if (Array.isArray(initialData.pillars)) {
        setPillars(
          initialData.pillars.map((p: any) => ({
            title: p.title ?? "",
            desc: p.desc ?? p.description ?? p.text ?? "",
          })),
        );
      } else {
        setPillars([]);
      }
    }
  }, [initialData]);

  const handleAddPillar = () => {
    setPillars((prev) => [...prev, { title: "", desc: "" }]);
    setOpenIndices((prev) => [...prev, pillars.length]);
  };

  const handleRemovePillar = (index: number) => {
    setPillars((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdatePillar = (index: number, field: keyof AdmissionPillar, value: string) => {
    setPillars((prev) => {
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
        section: "AdmissionOverviewSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          overview,
          ctaText,
          ctaLink,
          pillars,
        },
      };

      const res = await fetch("/api/admissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Admission Overview saved successfully!");
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
        title="2. Admission Overview & Selection Pillars"
        description="Comprehensive narrative on selecting Little Flower along with the pillars of parent consideration."
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
              placeholder="e.g. Admission Overview"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Begin Your Child's Learning"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Journey with LFCS"
            />
          </div>

          <TextAreaField
            label="Overview Narrative (Paragraphs separated by blank lines)"
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            rows={5}
            placeholder="e.g. Choosing the right school is an important decision for every family..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Button Text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Submit an Enquiry"
            />
            <InputField
              label="Button Link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. #admission-enquiry"
            />
          </div>

          {/* DYNAMIC PILLARS */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Pillars of Admission ({pillars.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Core value cards displayed beside the narrative (e.g. Structured Learning, Value-Based Education).
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPillar}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#842b46] bg-[#842b46]/10 hover:bg-[#842b46]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pillar</span>
              </button>
            </div>

            {pillars.length === 0 ? (
              <div
                onClick={handleAddPillar}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#842b46] hover:text-[#842b46] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No admission pillars added yet. Click to add your first pillar.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {pillars.map((pillar, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Pillar ${idx + 1}: ${pillar.title || "Untitled Pillar"}`}
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
                      placeholder="e.g. Structured Learning"
                    />

                    <TextAreaField
                      label="Pillar Description"
                      value={pillar.desc}
                      onChange={(e) => handleUpdatePillar(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. A strong academic base built step by step."
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
