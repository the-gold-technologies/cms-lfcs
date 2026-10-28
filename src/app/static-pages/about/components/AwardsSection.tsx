"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface AwardItem {
  title: string;
  desc: string;
  image: string;
}

export function AwardsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [awards, setAwards] = useState<AwardItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "HONOURS & RECOGNITION");
      setHeadline(initialData.headline ?? "Awards That Inspire Us");
      setSubtitle(
        initialData.subtitle ??
          "Celebrating excellence recognized at state, national, and international summits.",
      );

      if (Array.isArray(initialData.awards) && initialData.awards.length > 0) {
        setAwards(
          initialData.awards.map((a: any) => ({
            title: a.title ?? "",
            desc: a.desc ?? "",
            image: a.image ?? "",
          })),
        );
      } else {
        setAwards([
          {
            title: initialData.award1Title ?? "International Academic Recognition",
            desc:
              initialData.award1Desc ??
              "Representation at the 1st International & 31st Annual Conference of Sahodaya School Complexes in Dubai, UAE.",
            image:
              initialData.award1Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170013/lfcs-school/logo-unveiling_1793170013232.webp",
          },
          {
            title: initialData.award2Title ?? "National Leadership Award",
            desc:
              initialData.award2Desc ??
              "Honoured with the Award for Leading School Chain of Uttar Pradesh at the Education Summit in Lucknow.",
            image:
              initialData.award2Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170009/lfcs-school/anand-kumar-toi-profile_1793170009223.webp",
          },
          {
            title: initialData.award3Title ?? "Prestigious Media Recognition",
            desc:
              initialData.award3Desc ??
              "Recipient of the Dainik Jagran Award for being one of the Most Credible Educational Brands in UP.",
            image:
              initialData.award3Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170010/lfcs-school/anand-kumar-felicitation_1793170010248.webp",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddAward = () => {
    setAwards((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
        image: "",
      },
    ]);
  };

  const handleRemoveAward = (index: number) => {
    setAwards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateAward = (index: number, field: keyof AwardItem, val: string) => {
    setAwards((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "AwardsSection",
        content: {
          tagline,
          headline,
          subtitle,
          awards,
        },
      };

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Awards & Honours section saved successfully!");
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
        title="8. Awards & Honours (State & International Recognition)"
        description="Showcase awards from CBSE Sahodaya Dubai, Lucknow Education Summit, and Dainik Jagran Brand Awards."
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
              placeholder="e.g. Eyebrow badge (e.g. HONOURS & RECOGNITION)"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Section title (e.g. Awards That Inspire Us)"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Introduction to school accolades..."
          />

          {/* DYNAMIC AWARDS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Featured Honours & Awards ({awards.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  State, national and international recognitions. Can add more than 3 awards.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddAward}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Award</span>
              </button>
            </div>

            {awards.length === 0 ? (
              <div
                onClick={handleAddAward}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No awards added yet. Click to add your first honour.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {awards.map((award, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3.5 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Award #{idx + 1}: {award.title || "Untitled Award"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAward(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Award"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Row 1: Title */}
                    <InputField
                      label="Award Title"
                      value={award.title}
                      onChange={(e) => handleUpdateAward(idx, "title", e.target.value)}
                      placeholder="e.g. Sahodaya Dubai Recognition"
                    />

                    {/* Row 2: Description */}
                    <TextAreaField
                      label="Award Description"
                      value={award.desc}
                      onChange={(e) => handleUpdateAward(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Citation details, presenting body..."
                    />

                    {/* Row 3: Image (full width) */}
                    <ImagePickerField
                      label="Award Photo"
                      value={award.image}
                      onChange={(url) => handleUpdateAward(idx, "image", url)}
                      placeholder="e.g. Cloudinary trophy/award photo URL"
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
