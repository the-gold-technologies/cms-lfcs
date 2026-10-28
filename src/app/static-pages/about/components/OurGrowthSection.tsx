"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function OurGrowthSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [m1Year, setM1Year] = useState("");
  const [m1Title, setM1Title] = useState("");
  const [m1Desc, setM1Desc] = useState("");
  const [m1Image, setM1Image] = useState("");

  const [m2Year, setM2Year] = useState("");
  const [m2Title, setM2Title] = useState("");
  const [m2Desc, setM2Desc] = useState("");
  const [m2Image, setM2Image] = useState("");

  const [m3Year, setM3Year] = useState("");
  const [m3Title, setM3Title] = useState("");
  const [m3Desc, setM3Desc] = useState("");
  const [m3Image, setM3Image] = useState("");

  const [m4Year, setM4Year] = useState("");
  const [m4Title, setM4Title] = useState("");
  const [m4Desc, setM4Desc] = useState("");
  const [m4Image, setM4Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "TIMELINE OF EXCELLENCE");
      setHeadline(initialData.headline ?? "Milestones in Our Journey");
      setSubtitle(
        initialData.subtitle ??
          "Key historical moments that shaped our growth and expansion across Eastern Uttar Pradesh.",
      );

      setM1Year(initialData.m1Year ?? "1993");
      setM1Title(initialData.m1Title ?? "The Beginning");
      setM1Desc(
        initialData.m1Desc ??
          "Founded by Late Shri Vijay Shankar Yadav in Mau with just 30 students and a vision for holistic schooling.",
      );
      setM1Image(
        initialData.m1Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170045/lfcs-school/logo1_1793170045264.webp",
      );

      setM2Year(initialData.m2Year ?? "2012");
      setM2Title(initialData.m2Title ?? "LFCS Kiriharapur, Ballia");
      setM2Desc(
        initialData.m2Desc ??
          "Flagship expansion into Ballia district with modern laboratories and lush sports grounds.",
      );
      setM2Image(
        initialData.m2Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170004/lfcs-school/Khalispur-Balia_1793170003677.webp",
      );

      setM3Year(initialData.m3Year ?? "2014");
      setM3Title(initialData.m3Title ?? "LFIS Khalishpur, Mau");
      setM3Desc(
        initialData.m3Desc ??
          "International-standard campus with Olympic-grade swimming pool, amphitheater, and smart classrooms.",
      );
      setM3Image(
        initialData.m3Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170014/lfcs-school/journey-lfis-mau_1793170014137.webp",
      );

      setM4Year(initialData.m4Year ?? "2024");
      setM4Title(initialData.m4Title ?? "School Associate Program");
      setM4Desc(
        initialData.m4Desc ??
          "Nationwide expansion model inaugurated by Anand Kumar and Sharman Joshi to scale quality education.",
      );
      setM4Image(
        initialData.m4Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170008/lfcs-school/school-associate-launch_1793170008299.webp",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "OurGrowthSection",
        content: {
          tagline,
          headline,
          subtitle,
          m1Year,
          m1Title,
          m1Desc,
          m1Image,
          m2Year,
          m2Title,
          m2Desc,
          m2Image,
          m3Year,
          m3Title,
          m3Desc,
          m3Image,
          m4Year,
          m4Title,
          m4Desc,
          m4Image,
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
        toast.success("Growth Milestones section saved successfully!");
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
        title="7. Growth Milestones (Timeline of Expansion)"
        description="Chronological milestones from founding in 1993 to contemporary campus launches and the Associate network."
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
              placeholder="e.g. Eyebrow badge (e.g. TIMELINE OF EXCELLENCE)"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Section title (e.g. Milestones in Our Journey)"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Introductory summary of organizational expansion..."
          />

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Historical Milestones
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <InputField
                    label="Year"
                    value={m1Year}
                    onChange={(e) => setM1Year(e.target.value)}
                    placeholder="e.g. 1993"
                  />
                  <div className="col-span-2">
                    <InputField
                      label="Milestone Title"
                      value={m1Title}
                      onChange={(e) => setM1Title(e.target.value)}
                      placeholder="e.g. The Beginning"
                    />
                  </div>
                </div>
                <TextAreaField
                  label="Description"
                  value={m1Desc}
                  onChange={(e) => setM1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Brief history..."
                />
                <ImagePickerField
                  label="Milestone Photo"
                  value={m1Image}
                  onChange={(url) => setM1Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <InputField
                    label="Year"
                    value={m2Year}
                    onChange={(e) => setM2Year(e.target.value)}
                    placeholder="e.g. 2012"
                  />
                  <div className="col-span-2">
                    <InputField
                      label="Milestone Title"
                      value={m2Title}
                      onChange={(e) => setM2Title(e.target.value)}
                      placeholder="e.g. LFCS Kiriharapur, Ballia"
                    />
                  </div>
                </div>
                <TextAreaField
                  label="Description"
                  value={m2Desc}
                  onChange={(e) => setM2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Campus launch details..."
                />
                <ImagePickerField
                  label="Milestone Photo"
                  value={m2Image}
                  onChange={(url) => setM2Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <InputField
                    label="Year"
                    value={m3Year}
                    onChange={(e) => setM3Year(e.target.value)}
                    placeholder="e.g. 2014"
                  />
                  <div className="col-span-2">
                    <InputField
                      label="Milestone Title"
                      value={m3Title}
                      onChange={(e) => setM3Title(e.target.value)}
                      placeholder="e.g. LFIS Khalishpur, Mau"
                    />
                  </div>
                </div>
                <TextAreaField
                  label="Description"
                  value={m3Desc}
                  onChange={(e) => setM3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Flagship launch..."
                />
                <ImagePickerField
                  label="Milestone Photo"
                  value={m3Image}
                  onChange={(url) => setM3Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <InputField
                    label="Year"
                    value={m4Year}
                    onChange={(e) => setM4Year(e.target.value)}
                    placeholder="e.g. 2024"
                  />
                  <div className="col-span-2">
                    <InputField
                      label="Milestone Title"
                      value={m4Title}
                      onChange={(e) => setM4Title(e.target.value)}
                      placeholder="e.g. Associate Program"
                    />
                  </div>
                </div>
                <TextAreaField
                  label="Description"
                  value={m4Desc}
                  onChange={(e) => setM4Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Program details..."
                />
                <ImagePickerField
                  label="Milestone Photo"
                  value={m4Image}
                  onChange={(url) => setM4Image(url)}
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
