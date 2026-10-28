"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function LeadershipSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [founderName, setFounderName] = useState("");
  const [founderTitle, setFounderTitle] = useState("");
  const [founderQuote, setFounderQuote] = useState("");
  const [founderBio, setFounderBio] = useState("");
  const [founderImage, setFounderImage] = useState("");

  const [directorName, setDirectorName] = useState("");
  const [directorTitle, setDirectorTitle] = useState("");
  const [directorQuote, setDirectorQuote] = useState("");
  const [directorBio, setDirectorBio] = useState("");
  const [directorImage, setDirectorImage] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "LEADERSHIP / MANAGEMENT");
      setHeadline(initialData.headline ?? "Guiding the Institution");
      setSubtitle(initialData.subtitle ?? "Little Flower's growth has been guided by visionary management committed to quality education and character formation.");

      setFounderName(initialData.founderName ?? "Late Shri Vijay Shankar Yadav");
      setFounderTitle(initialData.founderTitle ?? "Founder & Visionary");
      setFounderQuote(initialData.founderQuote ?? "Education is not merely the transmission of information; it is the ignition of character, curiosity, and compassion.");
      setFounderBio(initialData.founderBio ?? "A dedicated educator whose unwavering belief in the potential of rural and semi-urban children gave birth to Little Flower in 1993.");
      setFounderImage(initialData.founderImage ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170014/lfcs-school/journey-lfis-mau_1793170014137.webp");

      setDirectorName(initialData.directorName ?? "Shri Vivek Yadav");
      setDirectorTitle(initialData.directorTitle ?? "Managing Director");
      setDirectorQuote(initialData.directorQuote ?? "Our mission is to prepare children not just for examinations, but for life — equipped with ethics, logic, and global awareness.");
      setDirectorBio(initialData.directorBio ?? "Spearheading modern curriculum integration, Olympic-standard sports facilities, and the LFCS Associate School expansion across Uttar Pradesh.");
      setDirectorImage(initialData.directorImage ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170010/lfcs-school/anand-kumar-felicitation_1793170010248.webp");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "LeadershipSection",
        content: {
          tagline,
          headline,
          subtitle,
          founderName,
          founderTitle,
          founderQuote,
          founderBio,
          founderImage,
          directorName,
          directorTitle,
          directorQuote,
          directorBio,
          directorImage,
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
        toast.success("Leadership section saved successfully!");
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
        title="6. Leadership & Management Profiles"
        description="Profiles of Founder Late Shri Vijay Shankar Yadav and Managing Director Shri Vivek Yadav with quotes, photos, and biographies."
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
              placeholder="e.g. Eyebrow badge (e.g. LEADERSHIP)"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Section title (e.g. Guiding the Institution)"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Introductory summary of management philosophy..."
          />

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-4">
              Founder Profile: Late Shri Vijay Shankar Yadav
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <InputField
                  label="Founder Name"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  placeholder="e.g. Late Shri Vijay Shankar Yadav"
                />
                <InputField
                  label="Title / Role"
                  value={founderTitle}
                  onChange={(e) => setFounderTitle(e.target.value)}
                  placeholder="e.g. Founder & Visionary"
                />
                <TextAreaField
                  label="Signature Quote"
                  value={founderQuote}
                  onChange={(e) => setFounderQuote(e.target.value)}
                  rows={2}
                  placeholder="e.g. Founder's core educational aphorism..."
                />
                <TextAreaField
                  label="Biography"
                  value={founderBio}
                  onChange={(e) => setFounderBio(e.target.value)}
                  rows={3}
                  placeholder="e.g. Brief biographical sketch..."
                />
              </div>
              <ImagePickerField
                label="Founder Portrait Photo"
                value={founderImage}
                onChange={(url) => setFounderImage(url)}
                placeholder="e.g. Cloudinary portrait photo URL"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E5A60] mb-4">
              Managing Director: Shri Vivek Yadav
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <InputField
                  label="Director Name"
                  value={directorName}
                  onChange={(e) => setDirectorName(e.target.value)}
                  placeholder="e.g. Shri Vivek Yadav"
                />
                <InputField
                  label="Title / Role"
                  value={directorTitle}
                  onChange={(e) => setDirectorTitle(e.target.value)}
                  placeholder="e.g. Managing Director"
                />
                <TextAreaField
                  label="Visionary Quote"
                  value={directorQuote}
                  onChange={(e) => setDirectorQuote(e.target.value)}
                  rows={2}
                  placeholder="e.g. Leadership statement..."
                />
                <TextAreaField
                  label="Biography"
                  value={directorBio}
                  onChange={(e) => setDirectorBio(e.target.value)}
                  rows={3}
                  placeholder="e.g. Leadership profile and initiatives..."
                />
              </div>
              <ImagePickerField
                label="Director Portrait Photo"
                value={directorImage}
                onChange={(url) => setDirectorImage(url)}
                placeholder="e.g. Cloudinary portrait photo URL"
              />
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
