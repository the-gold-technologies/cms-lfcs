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

export interface ConsiderationCard {
  title: string;
  desc: string;
  image: string;
  color?: string;
  bg?: string;
}

export function InvestmentSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");

  const [considerations, setConsiderations] = useState<ConsiderationCard[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");

      const list = Array.isArray(initialData.considerations)
        ? initialData.considerations
        : Array.isArray(initialData.items)
          ? initialData.items
          : null;

      if (list) {
        setConsiderations(
          list.map((c: any) => ({
            title: c.title ?? "",
            desc: c.desc ?? c.description ?? "",
            image: c.image ?? "",
            color: c.color ?? "",
            bg: c.bg ?? "",
          })),
        );
      } else {
        setConsiderations([]);
      }
    }
  }, [initialData]);

  const handleAddConsideration = () => {
    setConsiderations((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
        image: "",
        color: "",
        bg: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, considerations.length]);
  };

  const handleRemoveConsideration = (index: number) => {
    setConsiderations((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateConsideration = (
    index: number,
    field: keyof ConsiderationCard,
    value: string,
  ) => {
    setConsiderations((prev) => {
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
        section: "InvestmentSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          considerations,
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
        toast.success("Investment & Infrastructure section saved successfully!");
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
        title="7. Investment & Infrastructure Planning"
        description="Core capital resource areas: Land & Location, Building, Labs, Sports Grounds, Equipment, and Operations."
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
              placeholder="e.g. Investment & Infrastructure"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Planning the"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Resources for Your School"
            />
          </div>

          <TextAreaField
            label="Section Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. The investment and infrastructure requirements for an LFCS school will depend on location, size..."
          />

          {/* DYNAMIC CONSIDERATIONS */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Resource Considerations ({considerations.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Capital planning categories shown on the investment grid.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddConsideration}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#842b46] bg-[#842b46]/10 hover:bg-[#842b46]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Consideration</span>
              </button>
            </div>

            {considerations.length === 0 ? (
              <div
                onClick={handleAddConsideration}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#842b46] hover:text-[#842b46] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No considerations added yet. Click to add your first resource card.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {considerations.map((item, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Consideration ${idx + 1}: ${item.title || "Untitled Resource"}`}
                    thumbnail={item.image}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveConsideration(idx)}
                    deleteTitle="Delete Consideration"
                  >
                    <InputField
                      label="Resource Title"
                      value={item.title}
                      onChange={(e) => handleUpdateConsideration(idx, "title", e.target.value)}
                      placeholder="e.g. Land & Location"
                    />

                    <TextAreaField
                      label="Description"
                      value={item.desc}
                      onChange={(e) => handleUpdateConsideration(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Identification of suitable land and location based on the school's proposed size..."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InputField
                        label="Accent Color Hex (Optional)"
                        value={item.color ?? ""}
                        onChange={(e) => handleUpdateConsideration(idx, "color", e.target.value)}
                        placeholder="e.g. #dfae19"
                      />
                      <InputField
                        label="Badge Background Hex (Optional)"
                        value={item.bg ?? ""}
                        onChange={(e) => handleUpdateConsideration(idx, "bg", e.target.value)}
                        placeholder="e.g. #fcf5de"
                      />
                    </div>

                    <ImagePickerField
                      label="Photo Illustration"
                      value={item.image}
                      onChange={(url) => handleUpdateConsideration(idx, "image", url)}
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
