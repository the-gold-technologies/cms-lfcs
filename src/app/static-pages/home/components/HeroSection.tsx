"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { Plus, Trash2 } from "lucide-react";

export interface MetricItem {
  value: string;
  label: string;
}

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

  const [stats, setStats] = useState<MetricItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setHeadline(initialData.headline ?? "Rooted in Values.");
      setScriptAccent(initialData.scriptAccent ?? "Rising with Excellence.");
      setSubtitle(
        initialData.subtitle ??
          "A network of CBSE schools committed to academic excellence, character building and holistic development.",
      );
      setBgImage(
        initialData.bgImage ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170046/lfcs-school/herobg1_1793170046153.webp",
      );
      setPrimaryCtaText(initialData.primaryCtaText ?? "Explore Our Schools");
      setPrimaryCtaLink(initialData.primaryCtaLink ?? "/our-school");
      setSecondaryCtaText(initialData.secondaryCtaText ?? "Start a School");
      setSecondaryCtaLink(initialData.secondaryCtaLink ?? "/start-school");

      // Load stats from array or fallback to individual stat keys
      if (Array.isArray(initialData.stats) && initialData.stats.length > 0) {
        setStats(
          initialData.stats.map((s: any) => ({
            value: s.value ?? "",
            label: s.label ?? "",
          })),
        );
      } else if (Array.isArray(initialData.metrics) && initialData.metrics.length > 0) {
        setStats(
          initialData.metrics.map((s: any) => ({
            value: s.value ?? "",
            label: s.label ?? "",
          })),
        );
      } else {
        setStats([
          {
            value: initialData.stat1Value ?? "40000+",
            label: initialData.stat1Label ?? "Students Enrolled",
          },
          {
            value: initialData.stat2Value ?? "40+",
            label: initialData.stat2Label ?? "Years of Excellence",
          },
          {
            value: initialData.stat3Value ?? "8",
            label: initialData.stat3Label ?? "Schools Across UP",
          },
          {
            value: initialData.stat4Value ?? "100%",
            label: initialData.stat4Label ?? "Pass Rate (CBSE Board)",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddStat = () => {
    setStats((prev) => [...prev, { value: "", label: "" }]);
  };

  const handleRemoveStat = (index: number) => {
    setStats((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateStat = (index: number, field: keyof MetricItem, value: string) => {
    setStats((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
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
          stats, // Array object!
          // Backward compatibility:
          stat1Value: stats[0]?.value ?? "",
          stat1Label: stats[0]?.label ?? "",
          stat2Value: stats[1]?.value ?? "",
          stat2Label: stats[1]?.label ?? "",
          stat3Value: stats[2]?.value ?? "",
          stat3Label: stats[2]?.label ?? "",
          stat4Value: stats[3]?.value ?? "",
          stat4Label: stats[3]?.label ?? "",
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
              label="Script Flourish Accent"
              tooltip="The cursive text with the golden accent curve"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Elegant script highlight (e.g. Rising with Excellence.)"
            />
          </div>

          <TextAreaField
            label="Hero Subtitle"
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

          {/* DYNAMIC METRICS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Key Metrics Bar ({stats.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Floating statistics bar displayed prominently under the hero section. Can add more than 4 metrics.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddStat}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Metric</span>
              </button>
            </div>

            {stats.length === 0 ? (
              <div
                onClick={handleAddStat}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No metrics added yet. Click to add your first metric.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-1.5">
                      <span className="text-[11px] font-bold text-[#0E5A60]">
                        Metric #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStat(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Metric"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <InputField
                      label="Value / Metric"
                      value={stat.value}
                      onChange={(e) => handleUpdateStat(idx, "value", e.target.value)}
                      placeholder="e.g. 40000+"
                    />

                    <InputField
                      label="Label"
                      value={stat.label}
                      onChange={(e) => handleUpdateStat(idx, "label", e.target.value)}
                      placeholder="e.g. Students Enrolled"
                    />
                  </div>
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
