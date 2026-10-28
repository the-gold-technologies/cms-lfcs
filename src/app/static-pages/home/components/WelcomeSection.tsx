"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { Plus, Trash2 } from "lucide-react";

export interface PillarCard {
  title: string;
  desc: string;
  image: string;
}

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

  const [cards, setCards] = useState<PillarCard[]>([]);

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

      // Load cards from array or fallback to legacy feature1/2/3 keys
      if (Array.isArray(initialData.cards) && initialData.cards.length > 0) {
        setCards(
          initialData.cards.map((c: any) => ({
            title: c.title ?? "",
            desc: c.desc ?? c.description ?? "",
            image: c.image ?? "",
          })),
        );
      } else if (Array.isArray(initialData.pillars) && initialData.pillars.length > 0) {
        setCards(
          initialData.pillars.map((c: any) => ({
            title: c.title ?? "",
            desc: c.desc ?? c.description ?? "",
            image: c.image ?? "",
          })),
        );
      } else {
        setCards([
          {
            title: initialData.feature1Title ?? "Strong Academics",
            desc: initialData.feature1Desc ?? "CBSE curriculum with future ready learning.",
            image:
              initialData.feature1Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170028/lfcs-school/practical_1793170027731.webp",
          },
          {
            title: initialData.feature2Title ?? "Holistic Growth",
            desc:
              initialData.feature2Desc ??
              "Sports, arts, life skills and leadership opportunities.",
            image:
              initialData.feature2Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170040/lfcs-school/life1_1793170040339.webp",
          },
          {
            title: initialData.feature3Title ?? "Future Ready",
            desc:
              initialData.feature3Desc ??
              "Innovation, technology and 21st century skills.",
            image:
              initialData.feature3Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170019/lfcs-school/digital-classroom_1793170018820.webp",
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

  const handleUpdateCard = (index: number, field: keyof PillarCard, value: string) => {
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
        section: "WelcomeSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          ctaText,
          ctaLink,
          cards, // array object!
          // Backward compatibility:
          feature1Title: cards[0]?.title ?? "",
          feature1Desc: cards[0]?.desc ?? "",
          feature1Image: cards[0]?.image ?? "",
          feature2Title: cards[1]?.title ?? "",
          feature2Desc: cards[1]?.desc ?? "",
          feature2Image: cards[1]?.image ?? "",
          feature3Title: cards[2]?.title ?? "",
          feature3Desc: cards[2]?.desc ?? "",
          feature3Image: cards[2]?.image ?? "",
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
        toast.error(json.error || "Failed to save");
      }
    } catch {
      toast.error("Network error saving Welcome section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100">
      <SectionHeader
        title="2. Welcome & Introduction Narrative"
        description="Introductory narrative showcasing the signature focus cards (Strong Academics, Holistic Growth, Future Ready) with expandable card array."
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
              label="Main Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Main serif headline (e.g. Little Flower Group)"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Cursive burgundy accent (e.g. of Schools)"
            />
          </div>

          <TextAreaField
            label="Narrative Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Narrative text outlining LFCS's educational vision..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Button label (e.g. Know More About Us)"
            />
            <InputField
              label="CTA Button Link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. Target route (e.g. /about)"
            />
          </div>

          {/* DYNAMIC PILLAR CARDS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Signature Pillar Cards ({cards.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Add, edit, or remove signature cards showcasing LFCS educational focus. Can add more than 3 cards.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCard}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Card</span>
              </button>
            </div>

            {cards.length === 0 ? (
              <div
                onClick={handleAddCard}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No cards added yet. Click to add your first pillar card.</span>
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
                        Pillar Card {idx + 1}: {card.title || "Untitled Card"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCard(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <InputField
                      label="Card Title"
                      value={card.title}
                      onChange={(e) => handleUpdateCard(idx, "title", e.target.value)}
                      placeholder="e.g. Strong Academics"
                    />

                    <TextAreaField
                      label="Card Description"
                      value={card.desc}
                      onChange={(e) => handleUpdateCard(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. CBSE curriculum with future ready learning..."
                    />

                    <ImagePickerField
                      label="Card Image"
                      value={card.image}
                      onChange={(url) => handleUpdateCard(idx, "image", url)}
                      placeholder="e.g. Select or paste Cloudinary image URL"
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
