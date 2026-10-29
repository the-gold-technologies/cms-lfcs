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

export interface AdvantageCard {
  title: string;
  desc: string;
  image: string;
}

export function WhyPartnerSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");

  const [advantages, setAdvantages] = useState<AdvantageCard[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "WHY PARTNER WITH US");
      setHeadline(initialData.headline ?? "A Partnership Built on Trust & Academic Prestige");

      if (Array.isArray(initialData.advantages) && initialData.advantages.length > 0) {
        setAdvantages(
          initialData.advantages.map((a: any) => ({
            title: a.title ?? "",
            desc: a.desc ?? a.description ?? "",
            image: a.image ?? "",
          })),
        );
      } else {
        setAdvantages([
          {
            title: initialData.r1Title ?? "Established Brand Heritage",
            desc:
              initialData.r1Desc ??
              "40+ years of parental trust, recognizable emblem, and alumni network.",
            image:
              initialData.r1Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170014/lfcs-school/journey-lfis-mau_1793170014137.webp",
          },
          {
            title: initialData.r2Title ?? "Turnkey Curriculum Framework",
            desc:
              initialData.r2Desc ??
              "NCERT/CBSE lesson plans, pedagogical handbooks, teacher guides, and assessment schemes.",
            image:
              initialData.r2Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170028/lfcs-school/practical_1793170027731.webp",
          },
          {
            title: initialData.r3Title ?? "Operational Guidance",
            desc:
              initialData.r3Desc ??
              "End-to-end guidance across school architecture, lab design, bus transport, and regulatory compliance.",
            image:
              initialData.r3Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170008/lfcs-school/school-associate-launch_1793170008299.webp",
          },
          {
            title: initialData.r4Title ?? "Marketing & Admissions Engine",
            desc:
              initialData.r4Desc ??
              "High-visibility launch PR campaigns, digital lead generation, and Anand Kumar endorsement collaterals.",
            image:
              initialData.r4Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170010/lfcs-school/anand-kumar-felicitation_1793170010248.webp",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddAdvantage = () => {
    setAdvantages((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
        image: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, advantages.length]);
  };

  const handleRemoveAdvantage = (index: number) => {
    setAdvantages((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateAdvantage = (index: number, field: keyof AdvantageCard, value: string) => {
    setAdvantages((prev) => {
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
          advantages,
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
        title="2. Why Partner with LFCS (Associate Advantages)"
        description="Four foundational competitive advantages: Established Brand, Turnkey Curriculum, Operational Support, and Launch Marketing."
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
              placeholder="e.g. WHY PARTNER WITH US"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. A Partnership Built on Trust & Academic Prestige"
            />
          </div>

          {/* DYNAMIC ADVANTAGES ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Partnership Advantages ({advantages.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Competitive advantages and institutional support for partners. Can add more than 4 advantages.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openIndices.length === advantages.length) {
                      setOpenIndices([]);
                    } else {
                      setOpenIndices(advantages.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {openIndices.length === advantages.length ? "Collapse All" : "Expand All"}
                </button>
                <button
                  type="button"
                  onClick={handleAddAdvantage}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Advantage</span>
                </button>
              </div>
            </div>

            {advantages.length === 0 ? (
              <div
                onClick={handleAddAdvantage}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No advantages added yet. Click to add your first advantage.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {advantages.map((adv, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Advantage ${idx + 1}: ${adv.title || "Untitled Advantage"}`}
                    thumbnail={adv.image}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveAdvantage(idx)}
                    deleteTitle="Delete Advantage"
                  >
                    <InputField
                      label="Advantage Title"
                      value={adv.title}
                      onChange={(e) => handleUpdateAdvantage(idx, "title", e.target.value)}
                      placeholder="e.g. Established Brand Heritage"
                    />

                    <TextAreaField
                      label="Description"
                      value={adv.desc}
                      onChange={(e) => handleUpdateAdvantage(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. 40+ years of parental trust, recognizable emblem..."
                    />

                    <ImagePickerField
                      label="Card Photo"
                      value={adv.image}
                      onChange={(url) => handleUpdateAdvantage(idx, "image", url)}
                      placeholder="e.g. Cloudinary photo URL"
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
