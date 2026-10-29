"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";

export interface ModelArea {
  title: string;
  desc: string;
  color?: string;
  bg?: string;
}

export function SchoolModelSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");

  const [areas, setAreas] = useState<ModelArea[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");

      const list = Array.isArray(initialData.areas)
        ? initialData.areas
        : Array.isArray(initialData.pillars)
          ? initialData.pillars
          : null;

      if (list) {
        setAreas(
          list.map((a: any) => ({
            title: a.title ?? "",
            desc: a.desc ?? a.description ?? "",
            color: a.color ?? "",
            bg: a.bg ?? "",
          })),
        );
      } else {
        setAreas([]);
      }
    }
  }, [initialData]);

  const handleAddArea = () => {
    setAreas((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
        color: "",
        bg: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, areas.length]);
  };

  const handleRemoveArea = (index: number) => {
    setAreas((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateArea = (
    index: number,
    field: keyof ModelArea,
    value: string,
  ) => {
    setAreas((prev) => {
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
        section: "SchoolModelSection",
        content: {
          tagline,
          headline,
          scriptAccent,
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
        description="Highlights key operational domains: Educational Framework, Management, Academic Structure, Brand Identity, and Development."
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
              placeholder="e.g. LFCS School Model"
            />
            <InputField
              label="Headline"
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

          {/* DYNAMIC AREAS */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Model Areas ({areas.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Core operational pillar columns shown on the model section.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddArea}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#842b46] bg-[#842b46]/10 hover:bg-[#842b46]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Area</span>
              </button>
            </div>

            {areas.length === 0 ? (
              <div
                onClick={handleAddArea}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#842b46] hover:text-[#842b46] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No areas added yet. Click to add your first pillar.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {areas.map((area, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Pillar ${idx + 1}: ${area.title || "Untitled Area"}`}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveArea(idx)}
                    deleteTitle="Delete Area"
                  >
                    <InputField
                      label="Area Title"
                      value={area.title}
                      onChange={(e) => handleUpdateArea(idx, "title", e.target.value)}
                      placeholder="e.g. Educational Framework"
                    />

                    <TextAreaField
                      label="Description"
                      value={area.desc}
                      onChange={(e) => handleUpdateArea(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Alignment with the LFCS approach to learning..."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InputField
                        label="Accent Color Hex (Optional)"
                        value={area.color ?? ""}
                        onChange={(e) => handleUpdateArea(idx, "color", e.target.value)}
                        placeholder="e.g. #dfae19"
                      />
                      <InputField
                        label="Background Color Hex (Optional)"
                        value={area.bg ?? ""}
                        onChange={(e) => handleUpdateArea(idx, "bg", e.target.value)}
                        placeholder="e.g. #fcf5de"
                      />
                    </div>
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
