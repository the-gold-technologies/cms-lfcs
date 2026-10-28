"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
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
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
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
              <button
                type="button"
                onClick={handleAddRequirement}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Criterion</span>
              </button>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Criterion #{idx + 1}: {req.title || "Untitled"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Criterion"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

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
