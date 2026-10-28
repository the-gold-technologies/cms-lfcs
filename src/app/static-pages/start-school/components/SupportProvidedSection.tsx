"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface SupportStage {
  title: string;
  items: string;
}

export function SupportProvidedSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [stages, setStages] = useState<SupportStage[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "PARTNERSHIP LIFECYCLE");
      setHeadline(initialData.headline ?? "Comprehensive Support Across All Setup Stages");
      setSubtitle(
        initialData.subtitle ??
          "From initial land layout through grand opening and ongoing annual academic audits, LFCS supports your school at every step.",
      );

      if (Array.isArray(initialData.stages) && initialData.stages.length > 0) {
        setStages(
          initialData.stages.map((s: any) => ({
            title: s.title ?? "",
            items: s.items ?? "",
          })),
        );
      } else {
        setStages([
          {
            title: initialData.stage1Title ?? "Stage 1: Pre-Launch Support",
            items:
              initialData.stage1Items ??
              "School Planning & Architectural Layouts, Academic Structure & Timetable Blueprint, Brand Identity Guidelines, Faculty Recruitment & Induction Workshops",
          },
          {
            title: initialData.stage2Title ?? "Stage 2: Launch Support",
            items:
              initialData.stage2Items ??
              "Admissions Planning & Outreach Strategy, School Readiness Inspection, Marketing Campaigns & Launch Collaterals, Press Announcements",
          },
          {
            title: initialData.stage3Title ?? "Stage 3: Post-Launch & Ongoing Support",
            items:
              initialData.stage3Items ??
              "Annual Academic Quality Audits, Regular Teacher Training Programs, Curriculum Updates, Inter-School Sports & Cultural Leagues Participation",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddStage = () => {
    setStages((prev) => [
      ...prev,
      {
        title: "",
        items: "",
      },
    ]);
  };

  const handleRemoveStage = (index: number) => {
    setStages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateStage = (index: number, field: keyof SupportStage, val: string) => {
    setStages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "SupportProvidedSection",
        content: {
          tagline,
          headline,
          subtitle,
          stages,
        },
      };

      const res = await fetch("/api/start-school", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Support Provided section saved successfully!");
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
        title="4. Partnership Support Stages"
        description="Deliverables provided during Pre-Launch setup, School Inauguration, and Ongoing operations."
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
              placeholder="e.g. PARTNERSHIP LIFECYCLE"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Comprehensive Support Across All Setup Stages"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Support lifecycle narrative..."
          />

          {/* DYNAMIC STAGES ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Support Lifecycle Stages ({stages.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Phased support deliverables. Can add more than 3 stages.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddStage}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stage</span>
              </button>
            </div>

            {stages.length === 0 ? (
              <div
                onClick={handleAddStage}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No support stages added yet. Click to add your first stage.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {stages.map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3.5 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Stage #{idx + 1}: {stage.title || "Untitled Stage"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStage(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Stage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <InputField
                      label="Stage Title"
                      value={stage.title}
                      onChange={(e) => handleUpdateStage(idx, "title", e.target.value)}
                      placeholder="e.g. Stage 1: Pre-Launch Support"
                    />

                    <TextAreaField
                      label="Stage Deliverables (Comma-separated items)"
                      value={stage.items}
                      onChange={(e) => handleUpdateStage(idx, "items", e.target.value)}
                      rows={2}
                      placeholder="e.g. Architectural layouts, curriculum planning, teacher recruitment..."
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
