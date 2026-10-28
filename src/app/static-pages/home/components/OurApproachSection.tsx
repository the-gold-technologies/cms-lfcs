"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function OurApproachSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");

  const [card1Title, setCard1Title] = useState("");
  const [card1Desc, setCard1Desc] = useState("");
  const [card1Image, setCard1Image] = useState("");

  const [card2Title, setCard2Title] = useState("");
  const [card2Desc, setCard2Desc] = useState("");
  const [card2Image, setCard2Image] = useState("");

  const [card3Title, setCard3Title] = useState("");
  const [card3Desc, setCard3Desc] = useState("");
  const [card3Image, setCard3Image] = useState("");

  const [card4Title, setCard4Title] = useState("");
  const [card4Desc, setCard4Desc] = useState("");
  const [card4Image, setCard4Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "OUR APPROACH");
      setHeadline(initialData.headline ?? "Learning That Builds");
      setScriptAccent(initialData.scriptAccent ?? "Life Skills");
      setSubtitle(initialData.subtitle ?? "Not just academics we prepare children for life, with knowledge, character and curiosity.");
      setCtaText(initialData.ctaText ?? "Explore Academics");
      setCtaLink(initialData.ctaLink ?? "/academics");

      setCard1Title(initialData.card1Title ?? "Communication Skills");
      setCard1Desc(initialData.card1Desc ?? "Public speaking, debate, and bilingual articulate expression.");
      setCard1Image(initialData.card1Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170018/lfcs-school/skills1_1793170017926.webp");

      setCard2Title(initialData.card2Title ?? "Problem Solving & Logic");
      setCard2Desc(initialData.card2Desc ?? "STEM-oriented scientific enquiry and analytical reasoning.");
      setCard2Image(initialData.card2Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170029/lfcs-school/skills2_1793170028638.webp");

      setCard3Title(initialData.card3Title ?? "Emotional Resilience");
      setCard3Desc(initialData.card3Desc ?? "Mindfulness, self-awareness, and value-based moral balance.");
      setCard3Image(initialData.card3Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170036/lfcs-school/skills3_1793170036462.webp");

      setCard4Title(initialData.card4Title ?? "Leadership & Ethics");
      setCard4Desc(initialData.card4Desc ?? "Student council, community outreach, and peer mentorship.");
      setCard4Image(initialData.card4Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170039/lfcs-school/skills4_1793170038535.webp");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "OurApproachSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          ctaText,
          ctaLink,
          card1Title,
          card1Desc,
          card1Image,
          card2Title,
          card2Desc,
          card2Image,
          card3Title,
          card3Desc,
          card3Image,
          card4Title,
          card4Desc,
          card4Image,
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
        toast.success("Our Approach section saved successfully!");
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
        title="5. Our Approach (Life Skills Dark Banner & Carousel)"
        description="Dark navy banner showcasing how LFCS develops foundational life skills with a horizontal carousel of interactive cards."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Eyebrow Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Eyebrow badge (e.g. OUR APPROACH)"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Primary title (e.g. Learning That Builds)"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Gold script word (e.g. Life Skills)"
            />
          </div>

          <TextAreaField
            label="Banner Description"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Summary describing the preparation of children for future life challenges..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Label"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Button label (e.g. Explore Academics)"
            />
            <InputField
              label="CTA Button Link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. Target route (e.g. /academics)"
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Life Skill Carousel Cards
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Skill Card 1 Title"
                  value={card1Title}
                  onChange={(e) => setCard1Title(e.target.value)}
                  placeholder="e.g. Communication Skills"
                />
                <TextAreaField
                  label="Skill Card 1 Description"
                  value={card1Desc}
                  onChange={(e) => setCard1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Public speaking and articulacy..."
                />
                <ImagePickerField
                  label="Card 1 Photo"
                  value={card1Image}
                  onChange={(url) => setCard1Image(url)}
                  placeholder="e.g. Select Cloudinary skill card photo"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Skill Card 2 Title"
                  value={card2Title}
                  onChange={(e) => setCard2Title(e.target.value)}
                  placeholder="e.g. Problem Solving & Logic"
                />
                <TextAreaField
                  label="Skill Card 2 Description"
                  value={card2Desc}
                  onChange={(e) => setCard2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Analytical and reasoning focus..."
                />
                <ImagePickerField
                  label="Card 2 Photo"
                  value={card2Image}
                  onChange={(url) => setCard2Image(url)}
                  placeholder="e.g. Select Cloudinary skill card photo"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Skill Card 3 Title"
                  value={card3Title}
                  onChange={(e) => setCard3Title(e.target.value)}
                  placeholder="e.g. Emotional Resilience"
                />
                <TextAreaField
                  label="Skill Card 3 Description"
                  value={card3Desc}
                  onChange={(e) => setCard3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Mindfulness and moral compass..."
                />
                <ImagePickerField
                  label="Card 3 Photo"
                  value={card3Image}
                  onChange={(url) => setCard3Image(url)}
                  placeholder="e.g. Select Cloudinary skill card photo"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Skill Card 4 Title"
                  value={card4Title}
                  onChange={(e) => setCard4Title(e.target.value)}
                  placeholder="e.g. Leadership & Ethics"
                />
                <TextAreaField
                  label="Skill Card 4 Description"
                  value={card4Desc}
                  onChange={(e) => setCard4Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Student leadership and peer initiatives..."
                />
                <ImagePickerField
                  label="Card 4 Photo"
                  value={card4Image}
                  onChange={(url) => setCard4Image(url)}
                  placeholder="e.g. Select Cloudinary skill card photo"
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
