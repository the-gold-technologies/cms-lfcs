"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Image as ImageIcon, ArrowRight, Plus } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { ImagePickerField } from "@/components/ImagePickerField";
import { StringListEditor } from "@/components/StringListEditor";

interface EventPhoto {
  category: string;
  image: string;
}

export function GallerySection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [footerNote, setFooterNote] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle(initialData.subtitle ?? "");
      setFilters(Array.isArray(initialData.filters) ? initialData.filters : []);
      setPhotos(
        Array.isArray(initialData.photos)
          ? initialData.photos.map((p: any) => ({
              category: p.category ?? "",
              image: p.image ?? "",
            }))
          : [],
      );
      setCtaText(initialData.ctaText ?? "");
      setCtaLink(initialData.ctaLink ?? "");
      setFooterNote(initialData.footerNote ?? "");
    }
  }, [initialData]);

  const handleAddPhoto = () => {
    setPhotos((prev) => [...prev, { category: "", image: "" }]);
    setOpenIndices((prev) => [...prev, photos.length]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
  };

  const handleUpdatePhoto = (index: number, field: keyof EventPhoto, val: string) => {
    setPhotos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "GallerySection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          filters,
          photos,
          ctaText,
          ctaLink,
          footerNote,
        },
      };

      const res = await fetch("/api/experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Gallery header saved successfully!");
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
        title="6. Photo Gallery Showcase"
        description="Header and narrative for the live experience photo gallery. Photos and category albums are managed in the Photo Gallery module."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#842b46] text-white">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Dynamic Cloudinary Photo Gallery</p>
                <p className="text-[11px] text-gray-500">
                  Individual campus photos, event albums, and categories (Sports, Annual Days,
                  Workshops) are managed in the Photo Gallery module.
                </p>
              </div>
            </div>
            <Link
              href="/gallery"
              className="px-4 py-2 bg-white text-[#842b46] text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-50 transition-all flex items-center gap-1.5"
            >
              Manage Gallery <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Pre-Heading Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Events, Trips & Celebrations"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Experiences that Become Part of a"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Student Life"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. A glimpse into everyday life, celebrations, scientific discovery, and sporting triumphs across Little Flower schools..."
          />

          <StringListEditor
            label="Event Filter Tabs"
            items={filters}
            onChange={setFilters}
            placeholder="e.g. Annual Functions"
            helperText="Category tabs shown above the collage. Each photo below should use one of these categories."
          />

          {/* DYNAMIC EVENT PHOTOS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Event Collage Photos ({photos.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Photos shown in the filterable events collage.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openIndices.length === photos.length) {
                      setOpenIndices([]);
                    } else {
                      setOpenIndices(photos.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {openIndices.length === photos.length ? "Collapse All" : "Expand All"}
                </button>
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#842b46] hover:text-[#0a192f] bg-[#842b46]/10 hover:bg-[#842b46]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo</span>
                </button>
              </div>
            </div>

            {photos.length === 0 ? (
              <div
                onClick={handleAddPhoto}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No photos added yet. Click to add your first event photo.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {photos.map((item, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Photo ${idx + 1}: ${item.category || "Uncategorised"}`}
                    thumbnail={item.image}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemovePhoto(idx)}
                    deleteTitle="Delete Photo"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        Event Category
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) => handleUpdatePhoto(idx, "category", e.target.value)}
                        className="w-full text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#842b46] focus:ring-1 focus:ring-[#842b46]"
                      >
                        <option value="">Select a category...</option>
                        {filters
                          .filter((f) => f !== "All Events")
                          .map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                      </select>
                    </div>

                    <ImagePickerField
                      label="Event Photo"
                      value={item.image}
                      onChange={(url) => handleUpdatePhoto(idx, "image", url)}
                      placeholder="e.g. Cloudinary photo URL"
                    />
                  </CollapsibleCard>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Label"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. See More Photos"
            />
            <InputField
              label="CTA Button Link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. /gallery"
            />
          </div>

          <TextAreaField
            label="Closing Note (below button)"
            value={footerNote}
            onChange={(e) => setFooterNote(e.target.value)}
            rows={2}
            placeholder="e.g. A short note encouraging visitors to browse the full gallery..."
          />

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
