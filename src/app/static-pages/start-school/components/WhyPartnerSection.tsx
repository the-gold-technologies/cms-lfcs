"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";

export interface ReasonCard {
  title: string;
  desc: string;
  image: string;
  color?: string;
  bg?: string;
}

export function WhyPartnerSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");

  const [reasons, setReasons] = useState<ReasonCard[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");

      const list = Array.isArray(initialData.reasons)
        ? initialData.reasons
        : Array.isArray(initialData.advantages)
          ? initialData.advantages
          : null;

      if (list) {
        setReasons(
          list.map((r: any) => ({
            title: r.title ?? "",
            desc: r.desc ?? r.description ?? "",
            image: r.image ?? "",
            color: r.color ?? "",
            bg: r.bg ?? "",
          })),
        );
      } else {
        setReasons([]);
      }
    }
  }, [initialData]);

  const handleAddReason = () => {
    setReasons((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
        image: "",
        color: "",
        bg: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, reasons.length]);
  };

  const handleRemoveReason = (index: number) => {
    setReasons((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateReason = (
    index: number,
    field: keyof ReasonCard,
    value: string,
  ) => {
    setReasons((prev) => {
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
        section: "WhyPartnerSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          reasons,
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
        toast.success("Why Partner section saved successfully!");
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
        title="2. Why Partner with LFCS (Key Advantages)"
        description="Highlights brand trust, academic foundation, operational assistance, and vision."
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
              placeholder="e.g. Why Start an LFCS School?"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Build an Educational Institution"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. With Purpose"
            />
          </div>

          {/* DYNAMIC REASONS */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Partnership Reasons ({reasons.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Core advantages displayed to prospective school partners.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddReason}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0E5A60] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Reason</span>
              </button>
            </div>

            {reasons.length === 0 ? (
              <div
                onClick={handleAddReason}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#0E5A60] hover:text-[#0E5A60] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No reasons added yet. Click to add your first reason card.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {reasons.map((item, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Reason ${idx + 1}: ${item.title || "Untitled Reason"}`}
                    thumbnail={item.image}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveReason(idx)}
                    deleteTitle="Delete Reason"
                  >
                    <InputField
                      label="Reason Title"
                      value={item.title}
                      onChange={(e) => handleUpdateReason(idx, "title", e.target.value)}
                      placeholder="e.g. An Established Educational Identity"
                    />

                    <TextAreaField
                      label="Description"
                      value={item.desc}
                      onChange={(e) => handleUpdateReason(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Built around the Little Flower identity and values-led philosophy."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InputField
                        label="Accent Color Hex (Optional)"
                        value={item.color ?? ""}
                        onChange={(e) => handleUpdateReason(idx, "color", e.target.value)}
                        placeholder="e.g. #dfae19"
                      />
                      <InputField
                        label="Card Background Tint Hex (Optional)"
                        value={item.bg ?? ""}
                        onChange={(e) => handleUpdateReason(idx, "bg", e.target.value)}
                        placeholder="e.g. #fcf5de"
                      />
                    </div>

                    <ImagePickerField
                      label="Card Image Photo"
                      value={item.image}
                      onChange={(url) => handleUpdateReason(idx, "image", url)}
                      placeholder="e.g. Cloudinary image URL"
                      folder="lfcs-school/start-school"
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
