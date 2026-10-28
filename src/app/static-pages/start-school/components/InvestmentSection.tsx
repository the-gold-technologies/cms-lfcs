"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function InvestmentSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [inv1Title, setInv1Title] = useState("");
  const [inv1Desc, setInv1Desc] = useState("");
  const [inv1Image, setInv1Image] = useState("");

  const [inv2Title, setInv2Title] = useState("");
  const [inv2Desc, setInv2Desc] = useState("");
  const [inv2Image, setInv2Image] = useState("");

  const [inv3Title, setInv3Title] = useState("");
  const [inv3Desc, setInv3Desc] = useState("");
  const [inv3Image, setInv3Image] = useState("");

  const [inv4Title, setInv4Title] = useState("");
  const [inv4Desc, setInv4Desc] = useState("");
  const [inv4Image, setInv4Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "INFRASTRUCTURE & CAPITAL PLANNING");
      setHeadline(initialData.headline ?? "Planning the Resources for Your School");
      setSubtitle(
        initialData.subtitle ??
          "Capital allocation is phased to ensure fiscal sustainability, aligned with CBSE minimum campus norms and student intake velocity.",
      );

      setInv1Title(initialData.inv1Title ?? "Land & Site Acquisition");
      setInv1Desc(
        initialData.inv1Desc ??
          "1.5 to 3+ acres with safe, accessible road connectivity, clear non-agricultural title, and playground space.",
      );
      setInv1Image(
        initialData.inv1Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170001/lfcs-school/Nizamuddinpura-Mau_1793169999785.webp",
      );

      setInv2Title(initialData.inv2Title ?? "Academic Building & Classrooms");
      setInv2Desc(
        initialData.inv2Desc ??
          "Spacious, well-ventilated 500 sq.ft classrooms, administrative wing, staff rooms, and infirmary.",
      );
      setInv2Image(
        initialData.inv2Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170002/lfcs-school/Sikatia-Mau_1793170001648.webp",
      );

      setInv3Title(initialData.inv3Title ?? "Laboratories & Technology Integration");
      setInv3Desc(
        initialData.inv3Desc ??
          "Physics, Chemistry, Biology, Mathematics, and Computer labs with digital interactive flat panels.",
      );
      setInv3Image(
        initialData.inv3Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170016/lfcs-school/computer-lab_1793170016129.webp",
      );

      setInv4Title(initialData.inv4Title ?? "Sports Complexes & Working Capital");
      setInv4Desc(
        initialData.inv4Desc ??
          "Outdoor athletic field, basketball court, indoor games room, school buses, and preliminary operating reserve.",
      );
      setInv4Image(
        initialData.inv4Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170017/lfcs-school/sports1_1793170017007.webp",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "InvestmentSection",
        content: {
          tagline,
          headline,
          subtitle,
          inv1Title,
          inv1Desc,
          inv1Image,
          inv2Title,
          inv2Desc,
          inv2Image,
          inv3Title,
          inv3Desc,
          inv3Image,
          inv4Title,
          inv4Desc,
          inv4Image,
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
        toast.success("Investment & Resource Planning saved successfully!");
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
        title="7. Investment & Resource Planning (4 Key Heads)"
        description="Outlines infrastructure requirements: Land acquisition, Civil construction, Laboratories, and Sports/Working capital."
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
              placeholder="e.g. INFRASTRUCTURE & CAPITAL PLANNING"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Planning the Resources for Your School"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Overview of phased capital outlay..."
          />

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              4 Capital Allocation Heads
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Head 1 Title"
                  value={inv1Title}
                  onChange={(e) => setInv1Title(e.target.value)}
                  placeholder="e.g. Land & Site Acquisition"
                />
                <TextAreaField
                  label="Description"
                  value={inv1Desc}
                  onChange={(e) => setInv1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Acreage and title requirements..."
                />
                <ImagePickerField
                  label="Site Photo"
                  value={inv1Image}
                  onChange={(url) => setInv1Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Head 2 Title"
                  value={inv2Title}
                  onChange={(e) => setInv2Title(e.target.value)}
                  placeholder="e.g. Academic Building & Classrooms"
                />
                <TextAreaField
                  label="Description"
                  value={inv2Desc}
                  onChange={(e) => setInv2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Classroom dimensions and architecture..."
                />
                <ImagePickerField
                  label="Building Photo"
                  value={inv2Image}
                  onChange={(url) => setInv2Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Head 3 Title"
                  value={inv3Title}
                  onChange={(e) => setInv3Title(e.target.value)}
                  placeholder="e.g. Laboratories & Tech"
                />
                <TextAreaField
                  label="Description"
                  value={inv3Desc}
                  onChange={(e) => setInv3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Lab equipment and IFP panels..."
                />
                <ImagePickerField
                  label="Lab Photo"
                  value={inv3Image}
                  onChange={(url) => setInv3Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Head 4 Title"
                  value={inv4Title}
                  onChange={(e) => setInv4Title(e.target.value)}
                  placeholder="e.g. Sports & Operating Capital"
                />
                <TextAreaField
                  label="Description"
                  value={inv4Desc}
                  onChange={(e) => setInv4Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Sports grounds and reserve capital..."
                />
                <ImagePickerField
                  label="Sports Photo"
                  value={inv4Image}
                  onChange={(url) => setInv4Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>
            </div>
          </div>

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
