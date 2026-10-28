"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function AdmissionOverviewSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [paragraph1, setParagraph1] = useState("");
  const [paragraph2, setParagraph2] = useState("");

  const [p1Title, setP1Title] = useState("");
  const [p1Text, setP1Text] = useState("");
  const [p2Title, setP2Title] = useState("");
  const [p2Text, setP2Text] = useState("");
  const [p3Title, setP3Title] = useState("");
  const [p3Text, setP3Text] = useState("");
  const [p4Title, setP4Title] = useState("");
  const [p4Text, setP4Text] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "ADMISSION OVERVIEW");
      setHeadline(initialData.headline ?? "Begin Your Child's Learning");
      setScriptAccent(initialData.scriptAccent ?? "Journey with LFCS");
      setParagraph1(
        initialData.paragraph1 ??
          "Choosing the right school is an important decision for every family. At Little Flower Group of Schools, we believe that education should prepare children not only for academic success but also for the opportunities and responsibilities ahead.",
      );
      setParagraph2(
        initialData.paragraph2 ??
          "Our approach combines structured learning, value-based education and opportunities for students to discover their abilities, develop confidence and grow into responsible individuals across our 8 campuses.",
      );

      setP1Title(initialData.p1Title ?? "Structured Learning");
      setP1Text(initialData.p1Text ?? "A strong academic base built step by step.");
      setP2Title(initialData.p2Title ?? "Value-Based Education");
      setP2Text(
        initialData.p2Text ?? "Character, ethics, and civic responsibility alongside academics.",
      );
      setP3Title(initialData.p3Title ?? "Room to Discover");
      setP3Text(
        initialData.p3Text ?? "Opportunities to find passions and build genuine self-confidence.",
      );
      setP4Title(initialData.p4Title ?? "8 Premier Campuses");
      setP4Text(
        initialData.p4Text ?? "Quality education accessible for more families and communities.",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "AdmissionOverviewSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          paragraph1,
          paragraph2,
          p1Title,
          p1Text,
          p2Title,
          p2Text,
          p3Title,
          p3Text,
          p4Title,
          p4Text,
        },
      };

      const res = await fetch("/api/admissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Admission Overview saved successfully!");
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
        title="2. Admission Overview & 4 Selection Pillars"
        description="Comprehensive narrative on selecting Little Flower along with the 4 pillars of parent consideration."
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
              placeholder="e.g. ADMISSION OVERVIEW"
            />
            <InputField
              label="Heading Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Begin Your Child's Learning"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Journey with LFCS"
            />
          </div>

          <div className="space-y-4">
            <TextAreaField
              label="Overview Narrative (Paragraph 1)"
              value={paragraph1}
              onChange={(e) => setParagraph1(e.target.value)}
              rows={3}
              placeholder="e.g. Family decision-making and institutional values..."
            />
            <TextAreaField
              label="Overview Narrative (Paragraph 2)"
              value={paragraph2}
              onChange={(e) => setParagraph2(e.target.value)}
              rows={3}
              placeholder="e.g. Campus footprint and accessibility..."
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              4 Pillars of Admission
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Pillar 1 Title"
                  value={p1Title}
                  onChange={(e) => setP1Title(e.target.value)}
                  placeholder="e.g. Structured Learning"
                />
                <InputField
                  label="Pillar 1 Subtext"
                  value={p1Text}
                  onChange={(e) => setP1Text(e.target.value)}
                  placeholder="e.g. Step by step academic growth..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Pillar 2 Title"
                  value={p2Title}
                  onChange={(e) => setP2Title(e.target.value)}
                  placeholder="e.g. Value-Based Education"
                />
                <InputField
                  label="Pillar 2 Subtext"
                  value={p2Text}
                  onChange={(e) => setP2Text(e.target.value)}
                  placeholder="e.g. Character alongside academics..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Pillar 3 Title"
                  value={p3Title}
                  onChange={(e) => setP3Title(e.target.value)}
                  placeholder="e.g. Room to Discover"
                />
                <InputField
                  label="Pillar 3 Subtext"
                  value={p3Text}
                  onChange={(e) => setP3Text(e.target.value)}
                  placeholder="e.g. Building confidence..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Pillar 4 Title"
                  value={p4Title}
                  onChange={(e) => setP4Title(e.target.value)}
                  placeholder="e.g. 8 Premier Campuses"
                />
                <InputField
                  label="Pillar 4 Subtext"
                  value={p4Text}
                  onChange={(e) => setP4Text(e.target.value)}
                  placeholder="e.g. Accessible quality education..."
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
