"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { Plus } from "lucide-react";
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

  const [pillars, setPillars] = useState<AdmissionPillar[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "ADMISSION OVERVIEW");
      setHeadline(initialData.headline ?? "Begin Your Child's Learning");
      setScriptAccent(initialData.scriptAccent ?? "Journey with LFCS");

      if (initialData.overview) {
        setOverview(initialData.overview);
      } else if (initialData.paragraph1 || initialData.paragraph2) {
        setOverview([initialData.paragraph1, initialData.paragraph2].filter(Boolean).join("\n\n"));
      } else {
        setOverview(
          "Choosing the right school is an important decision for every family. At Little Flower Group of Schools, we believe that education should prepare children not only for academic success but also for the opportunities and responsibilities ahead.\n\nOur approach combines structured learning, value-based education and opportunities for students to discover their abilities, develop confidence and grow into responsible individuals across our 8 campuses.",
        );
      }

      if (Array.isArray(initialData.pillars) && initialData.pillars.length > 0) {
        setPillars(
          initialData.pillars.map((p: any) => ({
            title: p.title ?? "",
            desc: p.desc ?? p.description ?? p.text ?? "",
          })),
        );
      } else {
        setPillars([
          {
            title: initialData.p1Title ?? "Structured Learning",
            desc: initialData.p1Text ?? "A strong academic base built step by step.",
          },
          {
            title: initialData.p2Title ?? "Value-Based Education",
            desc:
              initialData.p2Text ??
              "Character, ethics, and civic responsibility alongside academics.",
          },
          {
            title: initialData.p3Title ?? "Room to Discover",
            desc:
              initialData.p3Text ??
              "Opportunities to find passions and build genuine self-confidence.",
          },
          {
            title: initialData.p4Title ?? "8 Premier Campuses",
            desc:
              initialData.p4Text ??
              "Quality education accessible for more families and communities.",
          },
        ]);
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
      const paragraphs = overview.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

      const payload = {
        section: "AdmissionOverviewSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          overview,
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
              label="Eyebrow Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. ADMISSION OVERVIEW"
            />
            <InputField
              label="Heading Lead"
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

          {/* SINGLE OVERVIEW NARRATIVE TEXTAREA WITH WHITE LINE SPACE */}
          <TextAreaField
            label="Overview Narrative"
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            rows={6}
            tooltip="Separate paragraphs with a blank line (hit Enter twice)."
            helperText="Hit Enter twice between paragraphs to create clean white line spaces just like on the live website."
            placeholder="Write the admission overview narrative here. Separate multiple paragraphs by hitting Enter twice..."
          />

          {/* DYNAMIC PILLARS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Pillars of Admission ({pillars.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Key reasons families choose Little Flower. Can add more than 4 pillars.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openIndices.length === pillars.length) {
                      setOpenIndices([]);
                    } else {
                      setOpenIndices(pillars.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {openIndices.length === pillars.length ? "Collapse All" : "Expand All"}
                </button>
                <button
                  type="button"
                  onClick={handleAddPillar}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Pillar</span>
                </button>
              </div>
            </div>

            {pillars.length === 0 ? (
              <div
                onClick={handleAddPillar}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No pillars added yet. Click to add your first admission pillar.</span>
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
                      label="Pillar Subtext"
                      value={pillar.desc}
                      onChange={(e) => handleUpdatePillar(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Step by step academic growth..."
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
