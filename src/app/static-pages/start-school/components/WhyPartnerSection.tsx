"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function WhyPartnerSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");

  const [r1Title, setR1Title] = useState("");
  const [r1Desc, setR1Desc] = useState("");
  const [r1Image, setR1Image] = useState("");

  const [r2Title, setR2Title] = useState("");
  const [r2Desc, setR2Desc] = useState("");
  const [r2Image, setR2Image] = useState("");

  const [r3Title, setR3Title] = useState("");
  const [r3Desc, setR3Desc] = useState("");
  const [r3Image, setR3Image] = useState("");

  const [r4Title, setR4Title] = useState("");
  const [r4Desc, setR4Desc] = useState("");
  const [r4Image, setR4Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "WHY PARTNER WITH US");
      setHeadline(initialData.headline ?? "A Partnership Built on Trust & Academic Prestige");

      setR1Title(initialData.r1Title ?? "Established Brand Heritage");
      setR1Desc(initialData.r1Desc ?? "40+ years of parental trust, recognizable emblem, and alumni network.");
      setR1Image(initialData.r1Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170014/lfcs-school/journey-lfis-mau_1793170014137.webp");

      setR2Title(initialData.r2Title ?? "Turnkey Curriculum Framework");
      setR2Desc(initialData.r2Desc ?? "NCERT/CBSE lesson plans, pedagogical handbooks, teacher guides, and assessment schemes.");
      setR2Image(initialData.r2Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170028/lfcs-school/practical_1793170027731.webp");

      setR3Title(initialData.r3Title ?? "Operational Guidance");
      setR3Desc(initialData.r3Desc ?? "End-to-end guidance across school architecture, lab design, bus transport, and regulatory compliance.");
      setR3Image(initialData.r3Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170008/lfcs-school/school-associate-launch_1793170008299.webp");

      setR4Title(initialData.r4Title ?? "Marketing & Admissions Engine");
      setR4Desc(initialData.r4Desc ?? "High-visibility launch PR campaigns, digital lead generation, and Anand Kumar endorsement collaterals.");
      setR4Image(initialData.r4Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170010/lfcs-school/anand-kumar-felicitation_1793170010248.webp");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "WhyPartnerSection",
        content: {
          tagline,
          headline,
          r1Title,
          r1Desc,
          r1Image,
          r2Title,
          r2Desc,
          r2Image,
          r3Title,
          r3Desc,
          r3Image,
          r4Title,
          r4Desc,
          r4Image,
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
        title="2. Why Partner with LFCS (4 Associate Advantages)"
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
              placeholder="e.g. A Partnership Built on Trust & Prestige"
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              4 Partnership Advantages
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Advantage 1 Title"
                  value={r1Title}
                  onChange={(e) => setR1Title(e.target.value)}
                  placeholder="e.g. Established Brand Heritage"
                />
                <TextAreaField
                  label="Description"
                  value={r1Desc}
                  onChange={(e) => setR1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Brand legacy details..."
                />
                <ImagePickerField
                  label="Card Photo"
                  value={r1Image}
                  onChange={(url) => setR1Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Advantage 2 Title"
                  value={r2Title}
                  onChange={(e) => setR2Title(e.target.value)}
                  placeholder="e.g. Turnkey Curriculum"
                />
                <TextAreaField
                  label="Description"
                  value={r2Desc}
                  onChange={(e) => setR2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Curriculum support..."
                />
                <ImagePickerField
                  label="Card Photo"
                  value={r2Image}
                  onChange={(url) => setR2Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Advantage 3 Title"
                  value={r3Title}
                  onChange={(e) => setR3Title(e.target.value)}
                  placeholder="e.g. Operational Guidance"
                />
                <TextAreaField
                  label="Description"
                  value={r3Desc}
                  onChange={(e) => setR3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Architecture & operations..."
                />
                <ImagePickerField
                  label="Card Photo"
                  value={r3Image}
                  onChange={(url) => setR3Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Advantage 4 Title"
                  value={r4Title}
                  onChange={(e) => setR4Title(e.target.value)}
                  placeholder="e.g. Marketing Engine"
                />
                <TextAreaField
                  label="Description"
                  value={r4Desc}
                  onChange={(e) => setR4Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Launch marketing & endorsements..."
                />
                <ImagePickerField
                  label="Card Photo"
                  value={r4Image}
                  onChange={(url) => setR4Image(url)}
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
