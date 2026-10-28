"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { Plus, Trash2 } from "lucide-react";

export interface SkillCard {
  title: string;
  desc: string;
  image: string;
}

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

  const [cards, setCards] = useState<SkillCard[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "OUR APPROACH");
      setHeadline(initialData.headline ?? "Learning That Builds");
      setScriptAccent(initialData.scriptAccent ?? "Life Skills");
      setSubtitle(
        initialData.subtitle ??
          "Not just academics we prepare children for life, with knowledge, character and curiosity.",
      );
      setCtaText(initialData.ctaText ?? "Explore Academics");
      setCtaLink(initialData.ctaLink ?? "/academics");

      if (Array.isArray(initialData.cards) && initialData.cards.length > 0) {
        setCards(
          initialData.cards.map((c: any) => ({
            title: c.title ?? "",
            desc: c.desc ?? c.description ?? "",
            image: c.image ?? "",
          })),
        );
      } else if (Array.isArray(initialData.skills) && initialData.skills.length > 0) {
        setCards(
          initialData.skills.map((c: any) => ({
            title: c.title ?? "",
            desc: c.desc ?? c.description ?? "",
            image: c.image ?? "",
          })),
        );
      } else {
        setCards([
          {
            title: initialData.card1Title ?? "Communication Skills",
            desc:
              initialData.card1Desc ??
              "Public speaking, debate, and bilingual articulate expression.",
            image:
              initialData.card1Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170018/lfcs-school/skills1_1793170017926.webp",
          },
          {
            title: initialData.card2Title ?? "Problem Solving & Logic",
            desc:
              initialData.card2Desc ??
              "STEM-oriented scientific enquiry and analytical reasoning.",
            image:
              initialData.card2Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170029/lfcs-school/skills2_1793170028638.webp",
          },
          {
            title: initialData.card3Title ?? "Emotional Resilience",
            desc:
              initialData.card3Desc ??
              "Mindfulness, self-awareness, and value-based moral balance.",
            image:
              initialData.card3Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170036/lfcs-school/skills3_1793170036462.webp",
          },
          {
            title: initialData.card4Title ?? "Leadership & Ethics",
            desc:
              initialData.card4Desc ??
              "Student council, community outreach, and peer mentorship.",
            image:
              initialData.card4Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170039/lfcs-school/skills4_1793170038535.webp",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddCard = () => {
    setCards((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
        image: "",
      },
    ]);
  };

  const handleRemoveCard = (index: number) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateCard = (index: number, field: keyof SkillCard, value: string) => {
    setCards((prev) => {
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
        section: "OurApproachSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          ctaText,
          ctaLink,
          cards, // Array object!
          // Backward compatibility:
          card1Title: cards[0]?.title ?? "",
          card1Desc: cards[0]?.desc ?? "",
          card1Image: cards[0]?.image ?? "",
          card2Title: cards[1]?.title ?? "",
          card2Desc: cards[1]?.desc ?? "",
          card2Image: cards[1]?.image ?? "",
          card3Title: cards[2]?.title ?? "",
          card3Desc: cards[2]?.desc ?? "",
          card3Image: cards[2]?.image ?? "",
          card4Title: cards[3]?.title ?? "",
          card4Desc: cards[3]?.desc ?? "",
          card4Image: cards[3]?.image ?? "",
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
        title="5. Our Approach (Life Skills & Carousel)"
        description="Showcases the holistic curriculum focus on 21st century competencies and dynamic life skill carousel cards."
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
              label="Heading Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Primary title (e.g. Learning That Builds)"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Cursive word flourish (e.g. Life Skills)"
            />
          </div>

          <TextAreaField
            label="Approach Summary"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Expand on building character and emotional resilience..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Text"
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

          {/* DYNAMIC LIFE SKILL CARDS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Life Skill Carousel Cards ({cards.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Interactive carousel cards highlighting character and competencies. Can add more than 4 cards.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCard}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill Card</span>
              </button>
            </div>

            {cards.length === 0 ? (
              <div
                onClick={handleAddCard}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No skill cards added yet. Click to add your first skill card.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {cards.map((card, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3.5 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Skill Card #{idx + 1}: {card.title || "Untitled Skill"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCard(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Skill Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <InputField
                      label="Skill Card Title"
                      value={card.title}
                      onChange={(e) => handleUpdateCard(idx, "title", e.target.value)}
                      placeholder="e.g. Communication Skills"
                    />

                    <TextAreaField
                      label="Skill Card Description"
                      value={card.desc}
                      onChange={(e) => handleUpdateCard(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Public speaking and articulacy..."
                    />

                    <ImagePickerField
                      label="Card Photo"
                      value={card.image}
                      onChange={(url) => handleUpdateCard(idx, "image", url)}
                      placeholder="e.g. Select Cloudinary skill card photo"
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
