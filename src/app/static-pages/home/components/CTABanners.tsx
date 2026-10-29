"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface BannerItem {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export function CTABanners({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      if (Array.isArray(initialData.banners) && initialData.banners.length > 0) {
        setBanners(
          initialData.banners.map((b: any) => ({
            title: b.title ?? "",
            subtitle: b.subtitle ?? "",
            ctaText: b.ctaText ?? "",
            ctaLink: b.ctaLink ?? "",
            image: b.image ?? "",
          })),
        );
      } else {
        setBanners([
          {
            title: initialData.banner1Title ?? initialData.admissionsCtaTitle ?? "Admissions Open",
            subtitle:
              initialData.banner1Subtitle ??
              initialData.admissionsCtaSubtitle ??
              "Begin your child's journey of excellence and endless possibilities across our 8 campuses.",
            ctaText: initialData.banner1CtaText ?? "Learn About Admissions",
            ctaLink: initialData.banner1CtaLink ?? "/admissions",
            image:
              initialData.banner1Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170041/lfcs-school/life2_1793170041503.webp",
          },
          {
            title: initialData.banner2Title ?? initialData.partnerCtaTitle ?? "Start a School",
            subtitle:
              initialData.banner2Subtitle ??
              initialData.partnerCtaSubtitle ??
              "Partner with our 40-year legacy to bring quality, values-based CBSE education to your city.",
            ctaText: initialData.banner2CtaText ?? "Partner With Us",
            ctaLink: initialData.banner2CtaLink ?? "/start-school",
            image:
              initialData.banner2Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170008/lfcs-school/school-associate-launch_1793170008299.webp",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddBanner = () => {
    setBanners((prev) => [
      ...prev,
      {
        title: "",
        subtitle: "",
        ctaText: "",
        ctaLink: "",
        image: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, banners.length]);
  };

  const handleRemoveBanner = (index: number) => {
    setBanners((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateBanner = (index: number, field: keyof BannerItem, val: string) => {
    setBanners((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "CTABanners",
        content: {
          banners,
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
        toast.success("Call to Action banners saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save banners");
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
        title="8. Action Promotional Banners"
        description="High-conversion promo banners directing prospective parents to admissions and entrepreneurs to partnership."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          {/* DYNAMIC BANNERS ARRAY */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Call to Action Banners ({banners.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Promotional banners for key conversions. Can add more banners.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openIndices.length === banners.length) {
                      setOpenIndices([]);
                    } else {
                      setOpenIndices(banners.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {openIndices.length === banners.length ? "Collapse All" : "Expand All"}
                </button>
                <button
                  type="button"
                  onClick={handleAddBanner}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Banner</span>
                </button>
              </div>
            </div>

            {banners.length === 0 ? (
              <div
                onClick={handleAddBanner}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No banners added yet. Click to add your first promo banner.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {banners.map((b, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Banner ${idx + 1}: ${b.title || "Untitled Banner"}`}
                    subtitle={b.ctaText ? `CTA: ${b.ctaText}` : undefined}
                    thumbnail={b.image}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveBanner(idx)}
                    deleteTitle="Delete Banner"
                  >
                    {/* Row 1: Title and Subtitle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Banner Title"
                        value={b.title}
                        onChange={(e) => handleUpdateBanner(idx, "title", e.target.value)}
                        placeholder="e.g. Admissions Open"
                      />
                      <InputField
                        label="Banner Subtitle"
                        value={b.subtitle}
                        onChange={(e) => handleUpdateBanner(idx, "subtitle", e.target.value)}
                        placeholder="e.g. Begin your child's journey of excellence..."
                      />
                    </div>

                    {/* Row 2: CTA Text and CTA Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="CTA Button Label"
                        value={b.ctaText}
                        onChange={(e) => handleUpdateBanner(idx, "ctaText", e.target.value)}
                        placeholder="e.g. Learn About Admissions"
                      />
                      <InputField
                        label="CTA Target Route / Link"
                        value={b.ctaLink}
                        onChange={(e) => handleUpdateBanner(idx, "ctaLink", e.target.value)}
                        placeholder="e.g. /admissions"
                      />
                    </div>

                    {/* Row 3: Banner Image (full width) */}
                    <ImagePickerField
                      label="Banner Background Photo"
                      value={b.image}
                      onChange={(url) => handleUpdateBanner(idx, "image", url)}
                      placeholder="e.g. Cloudinary background image URL"
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
