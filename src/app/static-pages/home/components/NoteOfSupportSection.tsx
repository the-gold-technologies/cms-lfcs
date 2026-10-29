"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { Plus } from "lucide-react";

interface EndorsementItem {
  name: string;
  role: string;
  headline: string;
  quote: string;
  image: string;
}

export function NoteOfSupportSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");

  const [endorsements, setEndorsements] = useState<EndorsementItem[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");

      if (Array.isArray(initialData.endorsements)) {
        setEndorsements(
          initialData.endorsements.map((e: any) => ({
            name: e.name ?? "",
            role: e.role ?? "",
            headline: e.headline ?? "",
            quote: e.quote ?? "",
            image: e.image ?? "",
          })),
        );
      } else {
        setEndorsements([]);
      }
    }
  }, [initialData]);

  const handleAddEndorsement = () => {
    setEndorsements((prev) => [
      ...prev,
      {
        name: "",
        role: "",
        headline: "",
        quote: "",
        image: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, endorsements.length]);
  };

  const handleRemoveEndorsement = (index: number) => {
    setEndorsements((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateEndorsement = (
    index: number,
    field: keyof EndorsementItem,
    val: string,
  ) => {
    setEndorsements((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "NoteOfSupportSection",
        content: {
          tagline,
          headline,
          endorsements,
        },
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Notes of Support section saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save Notes of Support");
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
        title="3. Notes of Support (Celebrity & Academic Endorsements)"
        description="Public endorsements from notable figures: Sharman Joshi and Super 30's Anand Kumar."
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
              placeholder="e.g. Notes of Support"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Voices That Believe in Our Journey"
            />
          </div>

          {/* DYNAMIC ENDORSEMENTS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Endorsement Profiles ({endorsements.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Public figures, educators, and supporters. Can add more endorsements.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openIndices.length === endorsements.length) {
                      setOpenIndices([]);
                    } else {
                      setOpenIndices(endorsements.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {openIndices.length === endorsements.length ? "Collapse All" : "Expand All"}
                </button>
                <button
                  type="button"
                  onClick={handleAddEndorsement}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Endorsement</span>
                </button>
              </div>
            </div>

            {endorsements.length === 0 ? (
              <div
                onClick={handleAddEndorsement}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No endorsements added yet. Click to add your first note of support.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {endorsements.map((item, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Endorsement ${idx + 1}: ${item.name || "Untitled Profile"}`}
                    subtitle={item.role}
                    thumbnail={item.image}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveEndorsement(idx)}
                    deleteTitle="Delete Profile"
                  >
                    {/* Row 1: Name and Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Supporter Name"
                        value={item.name}
                        onChange={(e) => handleUpdateEndorsement(idx, "name", e.target.value)}
                        placeholder="e.g. Sharman Joshi"
                      />
                      <InputField
                        label="Title / Designation"
                        value={item.role}
                        onChange={(e) => handleUpdateEndorsement(idx, "role", e.target.value)}
                        placeholder="e.g. Actor & LFCS Supporter"
                      />
                    </div>

                    {/* Row 2: Headline */}
                    <InputField
                      label="Highlighted Headline Quote"
                      value={item.headline}
                      onChange={(e) => handleUpdateEndorsement(idx, "headline", e.target.value)}
                      placeholder="e.g. Some journeys are worth supporting..."
                    />

                    {/* Row 3: Full Quote */}
                    <TextAreaField
                      label="Full Testimonial Quote"
                      value={item.quote}
                      onChange={(e) => handleUpdateEndorsement(idx, "quote", e.target.value)}
                      rows={3}
                      placeholder="e.g. I am happy to extend my support to Little Flower..."
                    />

                    {/* Row 4: Image (full width) */}
                    <ImagePickerField
                      label="Supporter Portrait Photo"
                      value={item.image}
                      onChange={(url) => handleUpdateEndorsement(idx, "image", url)}
                      placeholder="e.g. Cloudinary portrait photo URL"
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
