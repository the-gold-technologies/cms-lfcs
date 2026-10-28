"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function OurValuesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");

  const [val1Title, setVal1Title] = useState("");
  const [val1Desc, setVal1Desc] = useState("");

  const [val2Title, setVal2Title] = useState("");
  const [val2Desc, setVal2Desc] = useState("");

  const [val3Title, setVal3Title] = useState("");
  const [val3Desc, setVal3Desc] = useState("");

  const [val4Title, setVal4Title] = useState("");
  const [val4Desc, setVal4Desc] = useState("");

  const [val5Title, setVal5Title] = useState("");
  const [val5Desc, setVal5Desc] = useState("");

  const [val6Title, setVal6Title] = useState("");
  const [val6Desc, setVal6Desc] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "OUR VALUES");
      setHeadline(initialData.headline ?? "Principles That Define Little Flower");

      setVal1Title(initialData.val1Title ?? "Integrity");
      setVal1Desc(
        initialData.val1Desc ?? "We do the right thing at all times, even when no one is watching.",
      );

      setVal2Title(initialData.val2Title ?? "Respect");
      setVal2Desc(
        initialData.val2Desc ??
          "We value every single individual and treat everyone with empathy and kindness.",
      );

      setVal3Title(initialData.val3Title ?? "Excellence");
      setVal3Desc(
        initialData.val3Desc ??
          "We consistently strive for the highest academic and moral standards in all that we do.",
      );

      setVal4Title(initialData.val4Title ?? "Innovation");
      setVal4Desc(
        initialData.val4Desc ??
          "We embrace modern ideas, critical thinking, and creativity to solve real-world challenges.",
      );

      setVal5Title(initialData.val5Title ?? "Compassion");
      setVal5Desc(
        initialData.val5Desc ??
          "We foster empathy, active community service, and sincere care for all living things.",
      );

      setVal6Title(initialData.val6Title ?? "Perseverance");
      setVal6Desc(
        initialData.val6Desc ??
          "We build grit, resilience, and quiet determination to overcome challenges.",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "OurValuesSection",
        content: {
          tagline,
          headline,
          val1Title,
          val1Desc,
          val2Title,
          val2Desc,
          val3Title,
          val3Desc,
          val4Title,
          val4Desc,
          val5Title,
          val5Desc,
          val6Title,
          val6Desc,
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
        toast.success("Core Values section saved successfully!");
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
        title="5. Core Values (6 Institutional Tenets)"
        description="The 6 moral compass tenets: Integrity, Respect, Excellence, Innovation, Compassion, and Perseverance."
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
              placeholder="e.g. Eyebrow badge (e.g. OUR VALUES)"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Section title (e.g. Principles That Define Little Flower)"
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              6 Core Values Cards
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Value 1 Title"
                  value={val1Title}
                  onChange={(e) => setVal1Title(e.target.value)}
                  placeholder="e.g. Integrity"
                />
                <TextAreaField
                  label="Value 1 Description"
                  value={val1Desc}
                  onChange={(e) => setVal1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Ethical character explanation..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Value 2 Title"
                  value={val2Title}
                  onChange={(e) => setVal2Title(e.target.value)}
                  placeholder="e.g. Respect"
                />
                <TextAreaField
                  label="Value 2 Description"
                  value={val2Desc}
                  onChange={(e) => setVal2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Empathy and mutual respect..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Value 3 Title"
                  value={val3Title}
                  onChange={(e) => setVal3Title(e.target.value)}
                  placeholder="e.g. Excellence"
                />
                <TextAreaField
                  label="Value 3 Description"
                  value={val3Desc}
                  onChange={(e) => setVal3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. High standards explanation..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Value 4 Title"
                  value={val4Title}
                  onChange={(e) => setVal4Title(e.target.value)}
                  placeholder="e.g. Innovation"
                />
                <TextAreaField
                  label="Value 4 Description"
                  value={val4Desc}
                  onChange={(e) => setVal4Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Creative problem solving..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Value 5 Title"
                  value={val5Title}
                  onChange={(e) => setVal5Title(e.target.value)}
                  placeholder="e.g. Compassion"
                />
                <TextAreaField
                  label="Value 5 Description"
                  value={val5Desc}
                  onChange={(e) => setVal5Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Community service and caring..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Value 6 Title"
                  value={val6Title}
                  onChange={(e) => setVal6Title(e.target.value)}
                  placeholder="e.g. Perseverance"
                />
                <TextAreaField
                  label="Value 6 Description"
                  value={val6Desc}
                  onChange={(e) => setVal6Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Grit and resilience..."
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
