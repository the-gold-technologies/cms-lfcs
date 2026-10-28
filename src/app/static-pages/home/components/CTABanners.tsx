"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function CTABanners({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [banner1Title, setBanner1Title] = useState("");
  const [banner1Subtitle, setBanner1Subtitle] = useState("");
  const [banner1CtaText, setBanner1CtaText] = useState("");
  const [banner1CtaLink, setBanner1CtaLink] = useState("");
  const [banner1Image, setBanner1Image] = useState("");

  const [banner2Title, setBanner2Title] = useState("");
  const [banner2Subtitle, setBanner2Subtitle] = useState("");
  const [banner2CtaText, setBanner2CtaText] = useState("");
  const [banner2CtaLink, setBanner2CtaLink] = useState("");
  const [banner2Image, setBanner2Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setBanner1Title(
        initialData.banner1Title ?? initialData.admissionsCtaTitle ?? "Admissions Open",
      );
      setBanner1Subtitle(
        initialData.banner1Subtitle ??
          initialData.admissionsCtaSubtitle ??
          "Begin your child's journey of excellence and endless possibilities across our 8 campuses.",
      );
      setBanner1CtaText(initialData.banner1CtaText ?? "Learn About Admissions");
      setBanner1CtaLink(initialData.banner1CtaLink ?? "/admissions");
      setBanner1Image(
        initialData.banner1Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170041/lfcs-school/life2_1793170041503.webp",
      );

      setBanner2Title(initialData.banner2Title ?? initialData.partnerCtaTitle ?? "Start a School");
      setBanner2Subtitle(
        initialData.banner2Subtitle ??
          initialData.partnerCtaSubtitle ??
          "Partner with our 40-year legacy to bring quality, values-based CBSE education to your city.",
      );
      setBanner2CtaText(initialData.banner2CtaText ?? "Partner With Us");
      setBanner2CtaLink(initialData.banner2CtaLink ?? "/start-school");
      setBanner2Image(
        initialData.banner2Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170008/lfcs-school/school-associate-launch_1793170008299.webp",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "CTABanners",
        content: {
          banner1Title,
          banner1Subtitle,
          banner1CtaText,
          banner1CtaLink,
          banner1Image,
          banner2Title,
          banner2Subtitle,
          banner2CtaText,
          banner2CtaLink,
          banner2Image,
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
        title="8. Dual Action Banners (Admissions & School Associate)"
        description="Two side-by-side high-conversion promo banners directing prospective parents to admissions and entrepreneurs to partnership."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          {/* Banner 1 */}
          <div className="p-5 bg-red-50/40 rounded-2xl border border-red-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6a2238] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6a2238]" />
              Left Banner: Admissions Open
            </h4>
            <div className="space-y-3.5">
              <InputField
                label="Banner Title"
                value={banner1Title}
                onChange={(e) => setBanner1Title(e.target.value)}
                placeholder="e.g. Admissions Open for Session 2026-27"
              />
              <TextAreaField
                label="Banner Subtitle"
                value={banner1Subtitle}
                onChange={(e) => setBanner1Subtitle(e.target.value)}
                rows={2}
                placeholder="e.g. Invite parents to enroll their children..."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Button Text"
                  value={banner1CtaText}
                  onChange={(e) => setBanner1CtaText(e.target.value)}
                  placeholder="e.g. Learn About Admissions"
                />
                <InputField
                  label="Button Link"
                  value={banner1CtaLink}
                  onChange={(e) => setBanner1CtaLink(e.target.value)}
                  placeholder="e.g. /admissions"
                />
              </div>
              <ImagePickerField
                label="Banner Background Image"
                value={banner1Image}
                onChange={(url) => setBanner1Image(url)}
                placeholder="e.g. Cloudinary student banner image"
              />
            </div>
          </div>

          {/* Banner 2 */}
          <div className="p-5 bg-amber-50/40 rounded-2xl border border-amber-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              Right Banner: Start a School (Associate Program)
            </h4>
            <div className="space-y-3.5">
              <InputField
                label="Banner Title"
                value={banner2Title}
                onChange={(e) => setBanner2Title(e.target.value)}
                placeholder="e.g. Start an LFCS Associate School"
              />
              <TextAreaField
                label="Banner Subtitle"
                value={banner2Subtitle}
                onChange={(e) => setBanner2Subtitle(e.target.value)}
                rows={2}
                placeholder="e.g. Invite partners to bring quality education to their city..."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Button Text"
                  value={banner2CtaText}
                  onChange={(e) => setBanner2CtaText(e.target.value)}
                  placeholder="e.g. Partner With Us"
                />
                <InputField
                  label="Button Link"
                  value={banner2CtaLink}
                  onChange={(e) => setBanner2CtaLink(e.target.value)}
                  placeholder="e.g. /start-school"
                />
              </div>
              <ImagePickerField
                label="Banner Background Image"
                value={banner2Image}
                onChange={(url) => setBanner2Image(url)}
                placeholder="e.g. Cloudinary school building image"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
