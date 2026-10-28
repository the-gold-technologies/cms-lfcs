"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface ExperiencePhoto {
  label: string;
  image: string;
}

export function ExperienceSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");

  const [photos, setPhotos] = useState<ExperiencePhoto[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "CAMPUS LIFE");
      setHeadline(initialData.headline ?? "An Environment Where");
      setScriptAccent(initialData.scriptAccent ?? "Every Child Thrives");
      setSubtitle(
        initialData.subtitle ??
          "Beyond classrooms, our campuses buzz with sporting tournaments, science fairs, performing arts, and joyful discovery.",
      );
      setCtaText(initialData.ctaText ?? "Explore Student Life");
      setCtaLink(initialData.ctaLink ?? "/experience");

      if (Array.isArray(initialData.photos) && initialData.photos.length > 0) {
        setPhotos(
          initialData.photos.map((p: any) => ({
            label: p.label ?? "",
            image: p.image ?? "",
          })),
        );
      } else {
        setPhotos([
          {
            label: "Sports & Outdoors",
            image:
              initialData.col1Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170031/lfcs-school/Experience1_1793170031351.webp",
          },
          {
            label: "Labs & Tech Integration",
            image:
              initialData.col2Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170032/lfcs-school/Experience4_1793170032205.webp",
          },
          {
            label: "Arts & Performing Culture",
            image:
              initialData.col3Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170033/lfcs-school/Experience7_1793170033133.webp",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddPhoto = () => {
    setPhotos((prev) => [
      ...prev,
      {
        label: "",
        image: "",
      },
    ]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdatePhoto = (index: number, field: keyof ExperiencePhoto, val: string) => {
    setPhotos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "ExperienceSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          ctaText,
          ctaLink,
          photos,
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
        toast.success("Experience section saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save Experience section");
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
        title="6. Experience Section (Dynamic School Life Grid)"
        description="Highlights campus vitality, energetic sports fields, science labs, and extracurriculars with animated photo columns."
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
              placeholder="e.g. CAMPUS LIFE"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. An Environment Where"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Every Child Thrives"
            />
          </div>

          <TextAreaField
            label="Section Narrative"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Describe campus co-curricular vitality and activities..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Label"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Explore Student Life"
            />
            <InputField
              label="CTA Button Link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. /experience"
            />
          </div>

          {/* DYNAMIC PHOTOS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Featured Gallery Column Photos ({photos.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Visual photo columns for campus life carousel. Can add more photos.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPhoto}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Column Photo</span>
              </button>
            </div>

            {photos.length === 0 ? (
              <div
                onClick={handleAddPhoto}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No photos added yet. Click to add your first column photo.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {photos.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3.5 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Photo #{idx + 1}: {item.label || "Untitled Photo"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <InputField
                      label="Photo Caption / Category"
                      value={item.label}
                      onChange={(e) => handleUpdatePhoto(idx, "label", e.target.value)}
                      placeholder="e.g. Sports & Outdoors"
                    />

                    <ImagePickerField
                      label="Column Photo"
                      value={item.image}
                      onChange={(url) => handleUpdatePhoto(idx, "image", url)}
                      placeholder="e.g. Cloudinary photo URL"
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
