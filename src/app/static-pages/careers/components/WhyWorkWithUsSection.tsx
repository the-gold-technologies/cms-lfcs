"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface WorkBenefit {
  title: string;
  text: string;
}

export function WhyWorkWithUsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [paragraph, setParagraph] = useState("");

  const [benefits, setBenefits] = useState<WorkBenefit[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "WHY WORK WITH LFCS");
      setHeadline(initialData.headline ?? "Be Part of Something");
      setScriptAccent(initialData.scriptAccent ?? "Meaningful");
      setParagraph(
        initialData.paragraph ??
          "Working in education is an opportunity to make a difference that extends far beyond the classroom. At LFCS, every role contributes to creating a supportive learning environment.",
      );

      if (Array.isArray(initialData.benefits) && initialData.benefits.length > 0) {
        setBenefits(
          initialData.benefits.map((b: any) => ({
            title: b.title ?? "",
            text: b.text ?? "",
          })),
        );
      } else {
        setBenefits([
          {
            title: initialData.b1Title ?? "Purpose-Driven Work",
            text:
              initialData.b1Text ??
              "Directly shape the character and future trajectories of over 15,000 students.",
          },
          {
            title: initialData.b2Title ?? "Collaborative Environment",
            text:
              initialData.b2Text ??
              "Work alongside supportive peer educators and seasoned mentors.",
          },
          {
            title: initialData.b3Title ?? "Continuous Learning",
            text:
              initialData.b3Text ??
              "Regular pedagogical workshops, digital tool training, and CBSE seminars.",
          },
          {
            title: initialData.b4Title ?? "Fair Compensation & Stability",
            text:
              initialData.b4Text ??
              "Competitive compensation packages, performance recognition, and provident fund security.",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddBenefit = () => {
    setBenefits((prev) => [
      ...prev,
      {
        title: "",
        text: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, benefits.length]);
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateBenefit = (index: number, field: keyof WorkBenefit, val: string) => {
    setBenefits((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "WhyWorkWithUsSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          paragraph,
          benefits,
        },
      };

      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Why Work With Us section saved successfully!");
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
        title="2. Why Work With LFCS (Professional Advantages)"
        description="Highlights workplace benefits: Purpose-Driven Work, Collaborative Culture, Professional Development, and Stability."
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
              placeholder="e.g. WHY WORK WITH LFCS"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Be Part of Something"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Meaningful"
            />
          </div>

          <TextAreaField
            label="Section Narrative"
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            rows={3}
            placeholder="e.g. Workplace philosophy and impact overview..."
          />

          {/* DYNAMIC BENEFITS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Workplace Benefits ({benefits.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Professional development and cultural perks. Can add more perks.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openIndices.length === benefits.length) {
                      setOpenIndices([]);
                    } else {
                      setOpenIndices(benefits.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {openIndices.length === benefits.length ? "Collapse All" : "Expand All"}
                </button>
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Benefit</span>
                </button>
              </div>
            </div>

            {benefits.length === 0 ? (
              <div
                onClick={handleAddBenefit}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No perks added yet. Click to add your first advantage.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {benefits.map((b, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Advantage ${idx + 1}: ${b.title || "Untitled Advantage"}`}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveBenefit(idx)}
                    deleteTitle="Delete Advantage"
                  >
                    <InputField
                      label="Benefit Title"
                      value={b.title}
                      onChange={(e) => handleUpdateBenefit(idx, "title", e.target.value)}
                      placeholder="e.g. Purpose-Driven Work"
                    />

                    <TextAreaField
                      label="Benefit Description"
                      value={b.text}
                      onChange={(e) => handleUpdateBenefit(idx, "text", e.target.value)}
                      rows={2}
                      placeholder="e.g. Directly shape character and learning outcomes..."
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
