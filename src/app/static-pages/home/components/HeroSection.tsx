"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function HeroSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [bgImage, setBgImage] = useState("");
  const [primaryCtaText, setPrimaryCtaText] = useState("");
  const [primaryCtaLink, setPrimaryCtaLink] = useState("");
  const [secondaryCtaText, setSecondaryCtaText] = useState("");
  const [secondaryCtaLink, setSecondaryCtaLink] = useState("");

  const [stat1Value, setStat1Value] = useState("");
  const [stat1Label, setStat1Label] = useState("");
  const [stat2Value, setStat2Value] = useState("");
  const [stat2Label, setStat2Label] = useState("");
  const [stat3Value, setStat3Value] = useState("");
  const [stat3Label, setStat3Label] = useState("");
  const [stat4Value, setStat4Value] = useState("");
  const [stat4Label, setStat4Label] = useState("");

  useEffect(() => {
    if (initialData) {
      setHeadline(initialData.headline ?? "Rooted in Values.");
      setScriptAccent(initialData.scriptAccent ?? "Rising with Excellence.");
      setSubtitle(initialData.subtitle ?? "A network of CBSE schools committed to academic excellence, character building and holistic development.");
      setBgImage(initialData.bgImage ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170046/lfcs-school/herobg1_1793170046153.webp");
      setPrimaryCtaText(initialData.primaryCtaText ?? "Explore Our Schools");
      setPrimaryCtaLink(initialData.primaryCtaLink ?? "/our-school");
      setSecondaryCtaText(initialData.secondaryCtaText ?? "Start a School");
      setSecondaryCtaLink(initialData.secondaryCtaLink ?? "/start-school");

      setStat1Value(initialData.stat1Value ?? "40000+");
      setStat1Label(initialData.stat1Label ?? "Students Enrolled");
      setStat2Value(initialData.stat2Value ?? "40+");
      setStat2Label(initialData.stat2Label ?? "Years of Excellence");
      setStat3Value(initialData.stat3Value ?? "8");
      setStat3Label(initialData.stat3Label ?? "Schools Across UP");
      setStat4Value(initialData.stat4Value ?? "100%");
      setStat4Label(initialData.stat4Label ?? "Pass Rate (CBSE Board)");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "HeroSection",
        content: {
          headline,
          scriptAccent,
          subtitle,
          bgImage,
          primaryCtaText,
          primaryCtaLink,
          secondaryCtaText,
          secondaryCtaLink,
          stat1Value,
          stat1Label,
          stat2Value,
          stat2Label,
          stat3Value,
          stat3Label,
          stat4Value,
          stat4Label,
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
        toast.success("Hero section saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save Hero section");
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
        title="1. Hero Banner & Key Metrics"
        description="The primary above-the-fold banner on the homepage with high-impact headline, script flourish, action buttons, and statistical proofs."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Primary Headline"
              tooltip="The main bold text shown in serif font at the very top"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Enter a bold opening statement (e.g. Rooted in Values.)"
            />
            <InputField
              label="Script Accent Text"
              tooltip="Golden handwritten script flourish text with an underline wave"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Enter the handwritten script tagline (e.g. Rising with Excellence.)"
            />
          </div>

          <TextAreaField
            label="Hero Subtitle / Description"
            tooltip="Sub-paragraph summarizing the school network's core mission"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Summarize the institution's commitment to academics and holistic student growth..."
          />

          <ImagePickerField
            label="Hero Background Image"
            tooltip="Background graphic or campus photo shown behind the hero banner"
            value={bgImage}
            onChange={(url) => setBgImage(url)}
            placeholder="e.g. Paste a Cloudinary image URL or click below to upload an asset"
          />

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Call-to-Action Buttons
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Primary Button Text"
                value={primaryCtaText}
                onChange={(e) => setPrimaryCtaText(e.target.value)}
                placeholder="e.g. Label for primary button (e.g. Explore Our Schools)"
              />
              <InputField
                label="Primary Button Link"
                value={primaryCtaLink}
                onChange={(e) => setPrimaryCtaLink(e.target.value)}
                placeholder="e.g. Target route or URL (e.g. /our-school)"
              />
              <InputField
                label="Secondary Button Text"
                value={secondaryCtaText}
                onChange={(e) => setSecondaryCtaText(e.target.value)}
                placeholder="e.g. Label for outline button (e.g. Start a School)"
              />
              <InputField
                label="Secondary Button Link"
                value={secondaryCtaLink}
                onChange={(e) => setSecondaryCtaLink(e.target.value)}
                placeholder="e.g. Target route or URL (e.g. /start-school)"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Key Metrics Bar (Floating 4-Column Proofs)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <InputField
                  label="Stat 1 Metric"
                  value={stat1Value}
                  onChange={(e) => setStat1Value(e.target.value)}
                  placeholder="e.g. Numeric metric (e.g. 40,000+)"
                />
                <InputField
                  label="Stat 1 Label"
                  value={stat1Label}
                  onChange={(e) => setStat1Label(e.target.value)}
                  placeholder="e.g. Descriptive label (e.g. Students Enrolled)"
                />
              </div>
              <div className="space-y-2">
                <InputField
                  label="Stat 2 Metric"
                  value={stat2Value}
                  onChange={(e) => setStat2Value(e.target.value)}
                  placeholder="e.g. Numeric metric (e.g. 40+)"
                />
                <InputField
                  label="Stat 2 Label"
                  value={stat2Label}
                  onChange={(e) => setStat2Label(e.target.value)}
                  placeholder="e.g. Descriptive label (e.g. Years of Excellence)"
                />
              </div>
              <div className="space-y-2">
                <InputField
                  label="Stat 3 Metric"
                  value={stat3Value}
                  onChange={(e) => setStat3Value(e.target.value)}
                  placeholder="e.g. Numeric metric (e.g. 8)"
                />
                <InputField
                  label="Stat 3 Label"
                  value={stat3Label}
                  onChange={(e) => setStat3Label(e.target.value)}
                  placeholder="e.g. Descriptive label (e.g. Schools Across UP)"
                />
              </div>
              <div className="space-y-2">
                <InputField
                  label="Stat 4 Metric"
                  value={stat4Value}
                  onChange={(e) => setStat4Value(e.target.value)}
                  placeholder="e.g. Numeric metric (e.g. 100%)"
                />
                <InputField
                  label="Stat 4 Label"
                  value={stat4Label}
                  onChange={(e) => setStat4Label(e.target.value)}
                  placeholder="e.g. Descriptive label (e.g. CBSE Board Pass Rate)"
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
