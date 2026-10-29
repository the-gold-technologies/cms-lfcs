"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";

export interface SupportStageItem {
  title: string;
  desc: string;
}

export interface SupportStage {
  label: string;
  color?: string;
  bg?: string;
  items: SupportStageItem[];
}

export function SupportProvidedSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");

  const [stages, setStages] = useState<SupportStage[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");

      if (Array.isArray(initialData.stages)) {
        setStages(
          initialData.stages.map((s: any) => ({
            label: s.label ?? "",
            color: s.color ?? "",
            bg: s.bg ?? "",
            items: Array.isArray(s.items)
              ? s.items.map((it: any) => ({
                  title: it.title ?? "",
                  desc: it.desc ?? it.description ?? "",
                }))
              : [],
          })),
        );
      } else {
        setStages([]);
      }
    }
  }, [initialData]);

  const handleAddStage = () => {
    setStages((prev) => [
      ...prev,
      {
        label: "",
        color: "",
        bg: "",
        items: [{ title: "", desc: "" }],
      },
    ]);
    setOpenIndices((prev) => [...prev, stages.length]);
  };

  const handleRemoveStage = (index: number) => {
    setStages((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateStage = (
    index: number,
    field: keyof SupportStage,
    value: any,
  ) => {
    setStages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddItemToStage = (stageIdx: number) => {
    setStages((prev) => {
      const copy = [...prev];
      copy[stageIdx].items = [...copy[stageIdx].items, { title: "", desc: "" }];
      return copy;
    });
  };

  const handleRemoveItemFromStage = (stageIdx: number, itemIdx: number) => {
    setStages((prev) => {
      const copy = [...prev];
      copy[stageIdx].items = copy[stageIdx].items.filter((_, i) => i !== itemIdx);
      return copy;
    });
  };

  const handleUpdateStageItem = (
    stageIdx: number,
    itemIdx: number,
    field: keyof SupportStageItem,
    value: string,
  ) => {
    setStages((prev) => {
      const copy = [...prev];
      const items = [...copy[stageIdx].items];
      items[itemIdx] = { ...items[itemIdx], [field]: value };
      copy[stageIdx].items = items;
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "SupportProvidedSection",
        content: {
          tagline,
          headline,
          scriptAccent,
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
        title="4. Support Provided Across the Development Lifecycle"
        description="Comprehensive 3-stage roadmap: Pre-Launch, Launch Support, and Post-Launch Operations."
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
              placeholder="e.g. What LFCS Provides"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Support Across the School"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Development Journey"
            />
          </div>

          {/* DYNAMIC SUPPORT STAGES */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Lifecycle Support Stages ({stages.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Stages delivered by LFCS (e.g. Pre-Launch, Launch, Post-Launch).
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddStage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0E5A60] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stage</span>
              </button>
            </div>

            {stages.length === 0 ? (
              <div
                onClick={handleAddStage}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#0E5A60] hover:text-[#0E5A60] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No support stages added yet. Click to add your first stage.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {stages.map((stage, sIdx) => (
                  <CollapsibleCard
                    key={sIdx}
                    index={sIdx}
                    title={`Stage ${sIdx + 1}: ${stage.label || "Untitled Stage"}`}
                    isOpen={openIndices.includes(sIdx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(sIdx) ? prev.filter((i) => i !== sIdx) : [...prev, sIdx],
                      )
                    }
                    onDelete={() => handleRemoveStage(sIdx)}
                    deleteTitle="Delete Stage"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <InputField
                        label="Stage Label"
                        value={stage.label}
                        onChange={(e) => handleUpdateStage(sIdx, "label", e.target.value)}
                        placeholder="e.g. Pre-Launch Support"
                      />
                      <InputField
                        label="Accent Color Hex (Optional)"
                        value={stage.color ?? ""}
                        onChange={(e) => handleUpdateStage(sIdx, "color", e.target.value)}
                        placeholder="e.g. #dfae19"
                      />
                      <InputField
                        label="Background Tint Hex (Optional)"
                        value={stage.bg ?? ""}
                        onChange={(e) => handleUpdateStage(sIdx, "bg", e.target.value)}
                        placeholder="e.g. #fcf5de"
                      />
                    </div>

                    <div className="pt-3 border-t border-gray-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700">
                          Deliverables & Support Items ({stage.items.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddItemToStage(sIdx)}
                          className="text-[11px] font-semibold text-[#0E5A60] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      </div>

                      <div className="space-y-2">
                        {stage.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="p-3 bg-gray-50/70 rounded-xl border border-gray-100 space-y-2 relative"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-gray-500">
                                Item #{iIdx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveItemFromStage(sIdx, iIdx)}
                                className="text-[11px] text-red-500 hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                            <InputField
                              label="Item Title"
                              value={item.title}
                              onChange={(e) =>
                                handleUpdateStageItem(sIdx, iIdx, "title", e.target.value)
                              }
                              placeholder="e.g. Academic Planning"
                            />
                            <TextAreaField
                              label="Item Details"
                              value={item.desc}
                              onChange={(e) =>
                                handleUpdateStageItem(sIdx, iIdx, "desc", e.target.value)
                              }
                              rows={2}
                              placeholder="e.g. Support with academic structure, curriculum implementation..."
                            />
                          </div>
                        ))}
                      </div>
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
