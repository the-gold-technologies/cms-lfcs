"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Plus, Users, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { SaveButton } from "@/components/SaveButton";

interface FeatureItem {
  title: string;
  icon: string;
  subtitle: string;
}

export function OurSchoolCTASection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [primaryButtonText, setPrimaryButtonText] = useState("");
  const [secondaryButtonText, setSecondaryButtonText] = useState("");
  const [secondaryButtonLink, setSecondaryButtonLink] = useState("");
  const [image, setImage] = useState("");
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setPrimaryButtonText(initialData.primaryButtonText ?? "");
      setSecondaryButtonText(initialData.secondaryButtonText ?? "");
      setSecondaryButtonLink(initialData.secondaryButtonLink ?? "");
      setImage(initialData.image ?? "");

      if (Array.isArray(initialData.features)) {
        setFeatures(
          initialData.features.map((f: any) => ({
            title: f.title ?? "",
            icon: f.icon ?? "",
            subtitle: f.subtitle ?? "",
          })),
        );
      } else {
        setFeatures([]);
      }
    }
  }, [initialData]);

  const toggleCard = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const addFeature = () => {
    setFeatures((prev) => [
      ...prev,
      {
        title: "",
        icon: "Star",
        subtitle: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, features.length]);
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const updateFeature = (index: number, field: keyof FeatureItem, value: string) => {
    setFeatures((prev) => {
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
        section: "OurSchoolCTASection",
        content: {
          tagline,
          headline,
          scriptAccent,
          primaryButtonText,
          secondaryButtonText,
          secondaryButtonLink,
          image,
          features,
        },
      };

      const res = await fetch("/api/our-school", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("CTA section saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save section");
      }
    } catch {
      toast.error("Network error while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6">
      <SectionHeader
        title="3. Admissions Open Call to Action"
        description="Bottom banner inviting prospective students to submit admission enquiries with feature badges."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          {/* Submissions Module Shortcut Banner */}
          <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#842b46] text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Online Admission Enquiries</p>
                <p className="text-[11px] text-gray-500">
                  Enquiries submitted through this CTA button are recorded and managed in Admissions Submissions.
                </p>
              </div>
            </div>
            <Link
              href="/submissions/admissions"
              className="px-4 py-2 bg-white text-[#842b46] text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-50 transition-all flex items-center gap-1.5"
            >
              View Admissions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Pre-Heading Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Admissions Open"
            />
            <InputField
              label="Main Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Give your child a place to"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Grow. Lead. Learn."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Primary CTA Button Label"
              value={primaryButtonText}
              onChange={(e) => setPrimaryButtonText(e.target.value)}
              placeholder="e.g. Enquire for Admission"
            />
            <InputField
              label="Secondary Button Label"
              value={secondaryButtonText}
              onChange={(e) => setSecondaryButtonText(e.target.value)}
              placeholder="e.g. Explore Our School"
            />
            <InputField
              label="Secondary Button Link"
              value={secondaryButtonLink}
              onChange={(e) => setSecondaryButtonLink(e.target.value)}
              placeholder="e.g. /about"
            />
          </div>

          <ImagePickerField
            label="CTA Illustration / Photo"
            value={image}
            onChange={setImage}
            folder="lfcs-school/our-school"
            helperText="Banner right-side illustration or campus photo."
          />

          {/* Features Badges */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-800">Bottom Feature Badges</h4>
                <p className="text-xs text-gray-500">
                  Highlight badges displayed beneath the CTA buttons.
                </p>
              </div>
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#842b46] text-white text-xs font-semibold rounded-xl hover:bg-[#0b484d] transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Badge
              </button>
            </div>

            <div className="space-y-3">
              {features.map((feature, idx) => (
                <CollapsibleCard
                  key={idx}
                  index={idx}
                  title={feature.title || `Badge #${idx + 1}`}
                  subtitle={feature.icon ? `Icon: ${feature.icon}` : "Badge details"}
                  isOpen={openIndices.includes(idx)}
                  onToggle={() => toggleCard(idx)}
                  onDelete={() => removeFeature(idx)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      label="Badge Title"
                      value={feature.title}
                      onChange={(e) => updateFeature(idx, "title", e.target.value)}
                      placeholder="e.g. Nurturing"
                    />
                    <InputField
                      label="Subtitle / Line 2"
                      value={feature.subtitle}
                      onChange={(e) => updateFeature(idx, "subtitle", e.target.value)}
                      placeholder="e.g. Environment"
                    />
                    <InputField
                      label="Lucide Icon Name"
                      value={feature.icon}
                      onChange={(e) => updateFeature(idx, "icon", e.target.value)}
                      placeholder="e.g. Leaf, Users, Star"
                    />
                  </div>
                </CollapsibleCard>
              ))}
              {features.length === 0 && (
                <p className="text-xs text-gray-400 italic">No feature badges added.</p>
              )}
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

