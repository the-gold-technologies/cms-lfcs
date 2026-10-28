"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function AwardsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [award1Title, setAward1Title] = useState("");
  const [award1Desc, setAward1Desc] = useState("");
  const [award1Image, setAward1Image] = useState("");

  const [award2Title, setAward2Title] = useState("");
  const [award2Desc, setAward2Desc] = useState("");
  const [award2Image, setAward2Image] = useState("");

  const [award3Title, setAward3Title] = useState("");
  const [award3Desc, setAward3Desc] = useState("");
  const [award3Image, setAward3Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "HONOURS & RECOGNITION");
      setHeadline(initialData.headline ?? "Awards That Inspire Us");
      setSubtitle(
        initialData.subtitle ??
          "Celebrating excellence recognized at state, national, and international summits.",
      );

      setAward1Title(initialData.award1Title ?? "International Academic Recognition");
      setAward1Desc(
        initialData.award1Desc ??
          "Representation at the 1st International & 31st Annual Conference of Sahodaya School Complexes in Dubai, UAE.",
      );
      setAward1Image(
        initialData.award1Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170013/lfcs-school/logo-unveiling_1793170013232.webp",
      );

      setAward2Title(initialData.award2Title ?? "National Leadership Award");
      setAward2Desc(
        initialData.award2Desc ??
          "Honoured with the Award for Leading School Chain of Uttar Pradesh at the Education Summit in Lucknow.",
      );
      setAward2Image(
        initialData.award2Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170009/lfcs-school/anand-kumar-toi-profile_1793170009223.webp",
      );

      setAward3Title(initialData.award3Title ?? "Prestigious Media Recognition");
      setAward3Desc(
        initialData.award3Desc ??
          "Recipient of the Dainik Jagran Award for being one of the Most Credible Educational Brands in UP.",
      );
      setAward3Image(
        initialData.award3Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170010/lfcs-school/anand-kumar-felicitation_1793170010248.webp",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "AwardsSection",
        content: {
          tagline,
          headline,
          subtitle,
          award1Title,
          award1Desc,
          award1Image,
          award2Title,
          award2Desc,
          award2Image,
          award3Title,
          award3Desc,
          award3Image,
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

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              3 Featured Honours
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Award 1 Title"
                  value={award1Title}
                  onChange={(e) => setAward1Title(e.target.value)}
                  placeholder="e.g. Sahodaya Dubai Recognition"
                />
                <TextAreaField
                  label="Description"
                  value={award1Desc}
                  onChange={(e) => setAward1Desc(e.target.value)}
                  rows={3}
                  placeholder="e.g. Citation details..."
                />
                <ImagePickerField
                  label="Award Photo"
                  value={award1Image}
                  onChange={(url) => setAward1Image(url)}
                  placeholder="e.g. Cloudinary trophy/award photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Award 2 Title"
                  value={award2Title}
                  onChange={(e) => setAward2Title(e.target.value)}
                  placeholder="e.g. National Leadership Award"
                />
                <TextAreaField
                  label="Description"
                  value={award2Desc}
                  onChange={(e) => setAward2Desc(e.target.value)}
                  rows={3}
                  placeholder="e.g. Citation details..."
                />
                <ImagePickerField
                  label="Award Photo"
                  value={award2Image}
                  onChange={(url) => setAward2Image(url)}
                  placeholder="e.g. Cloudinary trophy/award photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Award 3 Title"
                  value={award3Title}
                  onChange={(e) => setAward3Title(e.target.value)}
                  placeholder="e.g. Dainik Jagran Most Credible Brand"
                />
                <TextAreaField
                  label="Description"
                  value={award3Desc}
                  onChange={(e) => setAward3Desc(e.target.value)}
                  rows={3}
                  placeholder="e.g. Citation details..."
                />
                <ImagePickerField
                  label="Award Photo"
                  value={award3Image}
                  onChange={(url) => setAward3Image(url)}
                  placeholder="e.g. Cloudinary trophy/award photo URL"
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
