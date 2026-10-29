"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface RequirementItem {
  title: string;
  desc: string;
}

export function PartnerRequirementsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [requirements, setRequirements] = useState<RequirementItem[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "PARTNER PROFILE & ELIGIBILITY");
      setHeadline(initialData.headline ?? "Who Can Explore an");
      setScriptAccent(initialData.scriptAccent ?? "LFCS Partnership?");
      setSubtitle(
        initialData.subtitle ??
          "We welcome visionary individuals, trusts, corporate CSR bodies, and educational societies dedicated to uplifting local educational standards.",
      );

      if (Array.isArray(initialData.requirements) && initialData.requirements.length > 0) {
        setRequirements(
          initialData.requirements.map((r: any) => ({
            title: r.title ?? "",
            desc: r.desc ?? "",
          })),
        );
      } else {
        setRequirements([
          {
            title: initialData.req1Title ?? "Commitment to Education",
            desc:
              initialData.req1Desc ??
              "A sincere interest in contributing to children's character, academic growth, and regional development.",
          },
          {
            title: initialData.req2Title ?? "Management & Leadership Capability",
            desc:
              initialData.req2Desc ??
              "Capacity to organize, recruit, and supervise daily administrative and operational personnel.",
          },
          {
            title: initialData.req3Title ?? "Infrastructure & Land Readiness",
            desc:
              initialData.req3Desc ??
              "Access to 1.5 to 3+ acres of suitable land or constructed school premises adhering to CBSE affiliation norms.",
          },
          {
            title: initialData.req4Title ?? "Financial Preparedness",
            desc:
              initialData.req4Desc ??
              "Adequate investment capability for phase-wise campus construction, lab setup, and working capital.",
          },
          {
            title: initialData.req5Title ?? "Long-Term Vision",
            desc:
              initialData.req5Desc ??
              "A multi-year commitment to maintaining high educational integrity, discipline, and community standing.",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddRequirement = () => {
    setRequirements((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, requirements.length]);
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateRequirement = (index: number, field: keyof RequirementItem, val: string) => {
    setRequirements((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "PartnerRequirementsSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          requirements,
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
        toast.success("Partner Requirements saved successfully!");
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
        title="5. Partner Eligibility & Requirements"
        description="Defines criteria for prospective partners: Commitment to Education, Management, Land, Financials, and Long-Term Vision."
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
              placeholder="e.g. PARTNER PROFILE"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Who Can Explore an"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. LFCS Partnership?"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Overview of partner eligibility..."
          />

          {/* DYNAMIC REQUIREMENTS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Partner Eligibility Criteria ({requirements.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Core qualifications for potential franchise/school partners. Can add more than 5 criteria.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openIndices.length === requirements.length) {
                      setOpenIndices([]);
                    } else {
                      setOpenIndices(requirements.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {openIndices.length === requirements.length ? "Collapse All" : "Expand All"}
                </button>
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Criterion</span>
                </button>
              </div>
            </div>

            {requirements.length === 0 ? (
              <div
                onClick={handleAddRequirement}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No criteria added yet. Click to add your first requirement.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {requirements.map((req, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={req.title || `Criterion #${idx + 1}`}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveRequirement(idx)}
                    deleteTitle="Delete Criterion"
                  >
                    <InputField
                      label="Criterion Title"
                      value={req.title}
                      onChange={(e) => handleUpdateRequirement(idx, "title", e.target.value)}
                      placeholder="e.g. Commitment to Education"
                    />

                    <TextAreaField
                      label="Description"
                      value={req.desc}
                      onChange={(e) => handleUpdateRequirement(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Passion for educational development, character..."
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
