"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function OurStorySection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [paragraph1, setParagraph1] = useState("");
  const [paragraph2, setParagraph2] = useState("");

  const [stat1Number, setStat1Number] = useState("");
  const [stat1Text, setStat1Text] = useState("");
  const [stat2Number, setStat2Number] = useState("");
  const [stat2Text, setStat2Text] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "Our Story");
      setHeadline(initialData.headline ?? "A Journey of");
      setScriptAccent(initialData.scriptAccent ?? "Dedication");
      setParagraph1(
        initialData.paragraph1 ??
          "Founded in 1993 by Late Shri Vijay Shankar Yadav in a temporary space with just 30 students and a big dream, Little Flower School began its journey with a simple mission: to provide quality, value-based education that goes beyond textbooks.",
      );
      setParagraph2(
        initialData.paragraph2 ??
          "Over the past three decades, we have grown from a modest neighborhood school into a network of CBSE-affiliated schools across Uttar Pradesh. What hasn't changed is our commitment to fostering a nurturing environment where every child feels valued, encouraged, and challenged.",
      );

      setStat1Number(initialData.stat1Number ?? "1993");
      setStat1Text(initialData.stat1Text ?? "Year Founded with 30 Students");
      setStat2Number(initialData.stat2Number ?? "30+");
      setStat2Text(initialData.stat2Text ?? "Years of Transformative Growth");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "OurStorySection",
        content: {
          tagline,
          headline,
          scriptAccent,
          paragraph1,
          paragraph2,
          stat1Number,
          stat1Text,
          stat2Number,
          stat2Text,
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
        toast.success("Our Story section saved successfully!");
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
        title="2. Our Story (Foundational Legacy)"
        description="The story of how Late Shri Vijay Shankar Yadav established Little Flower in 1993 and grew it into a premier educational institution."
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
              placeholder="e.g. Section category tag (e.g. Our Story)"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Title lead (e.g. A Journey of)"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Cursive word (e.g. Dedication)"
            />
          </div>

          <div className="space-y-4">
            <TextAreaField
              label="Story Narrative: Part 1"
              value={paragraph1}
              onChange={(e) => setParagraph1(e.target.value)}
              rows={3}
              placeholder="e.g. Describe the origin, founding in 1993, and early vision..."
            />
            <TextAreaField
              label="Story Narrative: Part 2"
              value={paragraph2}
              onChange={(e) => setParagraph2(e.target.value)}
              rows={3}
              placeholder="e.g. Describe three decades of expansion and unchanging institutional values..."
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Historical Milestones
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Stat 1 Value"
                  value={stat1Number}
                  onChange={(e) => setStat1Number(e.target.value)}
                  placeholder="e.g. Year (e.g. 1993)"
                />
                <InputField
                  label="Stat 1 Label"
                  value={stat1Text}
                  onChange={(e) => setStat1Text(e.target.value)}
                  placeholder="e.g. Year Founded with 30 Students"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Stat 2 Value"
                  value={stat2Number}
                  onChange={(e) => setStat2Number(e.target.value)}
                  placeholder="e.g. Metric (e.g. 30+)"
                />
                <InputField
                  label="Stat 2 Label"
                  value={stat2Text}
                  onChange={(e) => setStat2Text(e.target.value)}
                  placeholder="e.g. Years of Transformative Growth"
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
