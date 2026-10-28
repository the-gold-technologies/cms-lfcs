"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface ModelArea {
  title: string;
  desc: string;
}

export function SchoolModelSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [areas, setAreas] = useState<ModelArea[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "LFCS SCHOOL MODEL");
      setHeadline(initialData.headline ?? "A Partnership Built Around");
      setScriptAccent(initialData.scriptAccent ?? "Education");
      setSubtitle(
        initialData.subtitle ??
          "A transparent institutional framework designed to align academic excellence, school administration, and sustainable local community impact.",
      );

      if (Array.isArray(initialData.areas) && initialData.areas.length > 0) {
        setAreas(
          initialData.areas.map((a: any) => ({
            title: a.title ?? "",
            desc: a.desc ?? "",
          })),
        );
      } else {
        setAreas([
          {
            title: initialData.area1Title ?? "Educational Framework",
            desc:
              initialData.area1Desc ??
              "Full alignment with the LFCS pedagogical approach, student evaluations, and school values.",
          },
          {
            title: initialData.area2Title ?? "School Management System",
            desc:
              initialData.area2Desc ??
              "Clear delineation of operational responsibilities, ERP deployment, and administration.",
          },
          {
            title: initialData.area3Title ?? "Academic Structure",
            desc:
              initialData.area3Desc ??
              "Continuous guidance on CBSE curriculum rollout, teacher training, and timetable management.",
          },
          {
            title: initialData.area4Title ?? "Brand Identity Standards",
            desc:
              initialData.area4Desc ??
              "Authorized usage of LFCS logos, school uniforms, signage, and marketing collaterals.",
          },
          {
            title: initialData.area5Title ?? "Campus Development Coordination",
            desc:
              initialData.area5Desc ??
              "Architectural blueprints, laboratory layouts, safety clearances, and sports ground setup.",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddArea = () => {
    setAreas((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
      },
    ]);
  };

  const handleRemoveArea = (index: number) => {
    setAreas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateArea = (index: number, field: keyof ModelArea, val: string) => {
    setAreas((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "SchoolModelSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          areas,
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
        toast.success("School Model section saved successfully!");
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
        title="3. LFCS School Operating Model Pillars"
        description="Core operational framework: Educational, Management, Academic Structure, Brand Identity, and Development."
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
              placeholder="e.g. LFCS SCHOOL MODEL"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. A Partnership Built Around"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Education"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Operating model summary..."
          />

          {/* DYNAMIC MODEL AREAS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Model Focus Pillars ({areas.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Core operational pillars. Can add more than 5 pillars.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddArea}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pillar</span>
              </button>
            </div>

            {areas.length === 0 ? (
              <div
                onClick={handleAddArea}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No model pillars added yet. Click to add your first pillar.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {areas.map((area, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Pillar #{idx + 1}: {area.title || "Untitled"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Pillar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <InputField
                      label="Pillar Title"
                      value={area.title}
                      onChange={(e) => handleUpdateArea(idx, "title", e.target.value)}
                      placeholder="e.g. Educational Framework"
                    />

                    <TextAreaField
                      label="Description"
                      value={area.desc}
                      onChange={(e) => handleUpdateArea(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Learning approach, evaluation standards..."
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
