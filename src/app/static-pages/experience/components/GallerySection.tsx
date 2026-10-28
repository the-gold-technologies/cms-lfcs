"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Image as ImageIcon, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function GallerySection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "CAMPUS GALLERY");
      setHeadline(initialData.headline ?? "Moments Captured Across Our Campuses");
      setSubtitle(initialData.subtitle ?? "A glimpse into everyday life, celebrations, scientific discovery, and sporting triumphs across Little Flower schools.");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "GallerySection",
        content: {
          tagline,
          headline,
          subtitle,
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
        description="Header and narrative for the live experience photo gallery. Photos and category tags are managed in the Photo Gallery module."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0E5A60] text-white">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Dynamic Cloudinary Photo Gallery</p>
                <p className="text-[11px] text-gray-500">
                  Individual campus photos, captions, and category filters (Sports, Events, Labs, Arts) are managed in the Photo Gallery module.
                </p>
              </div>
            </div>
            <Link
              href="/gallery"
              className="px-4 py-2 bg-white text-[#0E5A60] text-xs font-bold rounded-xl border border-teal-200 hover:bg-teal-50 transition-all flex items-center gap-1.5"
            >
              Manage Gallery <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Eyebrow Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. CAMPUS GALLERY"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Moments Captured Across Our Campuses"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Narrative introducing the photographic record..."
          />

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <div className="w-full sm:w-64">
              <SaveButton onClick={handleSave} loading={loading} saved={saved} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
