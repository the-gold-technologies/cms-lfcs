"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function WelcomeSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");

  const [feature1Title, setFeature1Title] = useState("");
  const [feature1Desc, setFeature1Desc] = useState("");
  const [feature1Image, setFeature1Image] = useState("");

  const [feature2Title, setFeature2Title] = useState("");
  const [feature2Desc, setFeature2Desc] = useState("");
  const [feature2Image, setFeature2Image] = useState("");

  const [feature3Title, setFeature3Title] = useState("");
  const [feature3Desc, setFeature3Desc] = useState("");
  const [feature3Image, setFeature3Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "Welcome To");
      setHeadline(initialData.headline ?? "Little Flower Group");
      setScriptAccent(initialData.scriptAccent ?? "of Schools");
      setDescription(
        initialData.description ??
          "Our schools are places where children discover their potential, nurture their dreams and grow into confident, compassionate and responsible global citizens.",
      );
      setCtaText(initialData.ctaText ?? "Know More About Us");
      setCtaLink(initialData.ctaLink ?? "/about");

      setFeature1Title(initialData.feature1Title ?? "Strong Academics");
      setFeature1Desc(initialData.feature1Desc ?? "CBSE curriculum with future ready learning.");
      setFeature1Image(
        initialData.feature1Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170028/lfcs-school/practical_1793170027731.webp",
      );

      setFeature2Title(initialData.feature2Title ?? "Holistic Growth");
      setFeature2Desc(
        initialData.feature2Desc ?? "Sports, arts, life skills and leadership opportunities.",
      );
      setFeature2Image(
        initialData.feature2Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170040/lfcs-school/life1_1793170040339.webp",
      );

      setFeature3Title(initialData.feature3Title ?? "Future Ready");
      setFeature3Desc(
        initialData.feature3Desc ?? "Innovation, technology and 21st century skills.",
      );
      setFeature3Image(
        initialData.feature3Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170019/lfcs-school/digital-classroom_1793170018820.webp",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "WelcomeSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          ctaText,
          ctaLink,
          feature1Title,
          feature1Desc,
          feature1Image,
          feature2Title,
          feature2Desc,
          feature2Image,
          feature3Title,
          feature3Desc,
          feature3Image,
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
        toast.success("Welcome section saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save Welcome section");
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
        title="2. Welcome & Core Focus Pillars"
        description="Introductory narrative showcasing the 3 signature focus cards: Strong Academics, Holistic Growth, and Future Ready."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Pre-Heading Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Small eyebrow tag (e.g. Welcome To)"
            />
            <InputField
              label="Main Heading"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Primary title (e.g. Little Flower Group)"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Golden cursive highlight (e.g. of Schools)"
            />
          </div>

          <TextAreaField
            label="Welcome Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Elaborate on the vision and community ethos of Little Flower Group..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Call to action label (e.g. Know More About Us)"
            />
            <InputField
              label="CTA Button Link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. Target route (e.g. /about)"
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Pillar Card 1: Strong Academics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <InputField
                  label="Card Title"
                  value={feature1Title}
                  onChange={(e) => setFeature1Title(e.target.value)}
                  placeholder="e.g. Pillar title (e.g. Strong Academics)"
                />
                <TextAreaField
                  label="Card Description"
                  value={feature1Desc}
                  onChange={(e) => setFeature1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Brief curriculum overview..."
                />
              </div>
              <ImagePickerField
                label="Card Image"
                value={feature1Image}
                onChange={(url) => setFeature1Image(url)}
                placeholder="e.g. Select or paste Cloudinary image URL"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Pillar Card 2: Holistic Growth
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <InputField
                  label="Card Title"
                  value={feature2Title}
                  onChange={(e) => setFeature2Title(e.target.value)}
                  placeholder="e.g. Pillar title (e.g. Holistic Growth)"
                />
                <TextAreaField
                  label="Card Description"
                  value={feature2Desc}
                  onChange={(e) => setFeature2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Details about extracurriculars and character..."
                />
              </div>
              <ImagePickerField
                label="Card Image"
                value={feature2Image}
                onChange={(url) => setFeature2Image(url)}
                placeholder="e.g. Select or paste Cloudinary image URL"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Pillar Card 3: Future Ready
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <InputField
                  label="Card Title"
                  value={feature3Title}
                  onChange={(e) => setFeature3Title(e.target.value)}
                  placeholder="e.g. Pillar title (e.g. Future Ready)"
                />
                <TextAreaField
                  label="Card Description"
                  value={feature3Desc}
                  onChange={(e) => setFeature3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Technological integration and digital literacy..."
                />
              </div>
              <ImagePickerField
                label="Card Image"
                value={feature3Image}
                onChange={(url) => setFeature3Image(url)}
                placeholder="e.g. Select or paste Cloudinary image URL"
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
