"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface WorkHighlight {
  title: string;
  text: string;
  icon: string;
  color: string;
  bg: string;
}

export function WhyWorkWithUsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");

  const [highlights, setHighlights] = useState<WorkHighlight[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");

      if (Array.isArray(initialData.paragraphs)) {
        setDescription(initialData.paragraphs.join("\n\n"));
      } else if (typeof initialData.paragraph === "string" && initialData.paragraph) {
        setDescription(initialData.paragraph);
      } else if (typeof initialData.description === "string" && initialData.description) {
        setDescription(initialData.description);
      } else {
        setDescription("");
      }

      const list = Array.isArray(initialData.highlights)
        ? initialData.highlights
        : Array.isArray(initialData.benefits)
          ? initialData.benefits
          : null;

      if (list) {
        setHighlights(
          list.map((h: any) => ({
            title: h.title ?? "",
            text: h.text ?? "",
            icon: h.icon ?? "Target",
            color: h.color ?? "text-lf-burgundy",
            bg: h.bg ?? "bg-[#fbeef2]",
          })),
        );
      } else {
        setHighlights([]);
      }
    }
  }, [initialData]);

  const toggleCard = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const addHighlight = () => {
    setHighlights((prev) => [
      ...prev,
      {
        title: "",
        text: "",
        icon: "Target",
        color: "text-lf-burgundy",
        bg: "bg-[#fbeef2]",
      },
    ]);
    setOpenIndices((prev) => [...prev, highlights.length]);
  };

  const removeHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const updateHighlight = (index: number, field: keyof WorkHighlight, value: string) => {
    setHighlights((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const paragraphs = description
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const payload = {
        section: "WhyWorkWithUsSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          paragraphs,
          highlights,
        },
      };

      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Why Work With Us section saved successfully!");
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
        title="2. Why Work With LFCS Section"
        description="Core recruitment appeal, institution philosophy narrative, and 4 highlight benefit pillars."
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
              placeholder="e.g. Why Work With LFCS"
            />
            <InputField
              label="Main Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Be Part of Something"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Meaningful"
            />
          </div>

          <TextAreaField
            label="Section Narrative (Separate paragraphs with a blank line)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Working in education is an opportunity to make a difference that extends far beyond the classroom...&#10;&#10;As our network continues to grow, we value individuals who bring commitment..."
            helperText="Separate multiple paragraphs with an empty line (double Enter)."
          />

          {/* Highlights Array */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-800">Benefit Highlight Cards</h4>
                <p className="text-xs text-gray-500">
                  Core advantages shown in grid cards below the narrative.
                </p>
              </div>
              <button
                type="button"
                onClick={addHighlight}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#842b46] text-white text-xs font-semibold rounded-xl hover:bg-[#0b484d] transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Benefit Card
              </button>
            </div>

            <div className="space-y-3">
              {highlights.map((highlight, idx) => (
                <CollapsibleCard
                  key={idx}
                  index={idx}
                  title={highlight.title || `Benefit #${idx + 1}`}
                  subtitle={highlight.text ? highlight.text.slice(0, 50) + "..." : "Benefit card details"}
                  isOpen={openIndices.includes(idx)}
                  onToggle={() => toggleCard(idx)}
                  onDelete={() => removeHighlight(idx)}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Card Title"
                        value={highlight.title}
                        onChange={(e) => updateHighlight(idx, "title", e.target.value)}
                        placeholder="e.g. Purpose-Driven Work"
                      />
                      <InputField
                        label="Lucide Icon Name"
                        value={highlight.icon}
                        onChange={(e) => updateHighlight(idx, "icon", e.target.value)}
                        placeholder="e.g. Target, Users, GraduationCap, HeartHandshake"
                      />
                    </div>

                    <TextAreaField
                      label="Card Description"
                      value={highlight.text}
                      onChange={(e) => updateHighlight(idx, "text", e.target.value)}
                      rows={2}
                      placeholder="e.g. Contribute to the learning and development of young minds."
                    />
                  </div>
                </CollapsibleCard>
              ))}
              {highlights.length === 0 && (
                <p className="text-xs text-gray-400 italic">No benefit cards added.</p>
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
