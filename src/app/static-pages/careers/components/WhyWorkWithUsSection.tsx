"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function WhyWorkWithUsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [paragraph, setParagraph] = useState("");

  const [b1Title, setB1Title] = useState("");
  const [b1Text, setB1Text] = useState("");
  const [b2Title, setB2Title] = useState("");
  const [b2Text, setB2Text] = useState("");
  const [b3Title, setB3Title] = useState("");
  const [b3Text, setB3Text] = useState("");
  const [b4Title, setB4Title] = useState("");
  const [b4Text, setB4Text] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "WHY WORK WITH LFCS");
      setHeadline(initialData.headline ?? "Be Part of Something");
      setScriptAccent(initialData.scriptAccent ?? "Meaningful");
      setParagraph(
        initialData.paragraph ??
          "Working in education is an opportunity to make a difference that extends far beyond the classroom. At LFCS, every role contributes to creating a supportive learning environment.",
      );

      setB1Title(initialData.b1Title ?? "Purpose-Driven Work");
      setB1Text(
        initialData.b1Text ??
          "Directly shape the character and future trajectories of over 15,000 students.",
      );
      setB2Title(initialData.b2Title ?? "Collaborative Environment");
      setB2Text(
        initialData.b2Text ?? "Work alongside supportive peer educators and seasoned mentors.",
      );
      setB3Title(initialData.b3Title ?? "Continuous Learning");
      setB3Text(
        initialData.b3Text ??
          "Regular pedagogical workshops, digital tool training, and CBSE seminars.",
      );
      setB4Title(initialData.b4Title ?? "Fair Compensation & Stability");
      setB4Text(
        initialData.b4Text ??
          "Competitive compensation packages, performance recognition, and provident fund security.",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "WhyWorkWithUsSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          paragraph,
          b1Title,
          b1Text,
          b2Title,
          b2Text,
          b3Title,
          b3Text,
          b4Title,
          b4Text,
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
    } catch (err: any) {
      toast.error(err?.message || "Network error while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6">
      <SectionHeader
        title="2. Why Work With LFCS (4 Professional Advantages)"
        description="Highlights workplace benefits: Purpose-Driven Work, Collaborative Culture, Professional Development, and Stability."
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
              placeholder="e.g. WHY WORK WITH LFCS"
            />
            <InputField
              label="Headline Lead"
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
            label="Section Narrative"
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            rows={2}
            placeholder="e.g. Value proposition for teachers and staff..."
          />

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              4 Professional Highlights
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Highlight 1 Title"
                  value={b1Title}
                  onChange={(e) => setB1Title(e.target.value)}
                  placeholder="e.g. Purpose-Driven Work"
                />
                <TextAreaField
                  label="Description"
                  value={b1Text}
                  onChange={(e) => setB1Text(e.target.value)}
                  rows={2}
                  placeholder="e.g. Impact details..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Highlight 2 Title"
                  value={b2Title}
                  onChange={(e) => setB2Title(e.target.value)}
                  placeholder="e.g. Collaborative Culture"
                />
                <TextAreaField
                  label="Description"
                  value={b2Text}
                  onChange={(e) => setB2Text(e.target.value)}
                  rows={2}
                  placeholder="e.g. Teamwork details..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Highlight 3 Title"
                  value={b3Title}
                  onChange={(e) => setB3Title(e.target.value)}
                  placeholder="e.g. Continuous Learning"
                />
                <TextAreaField
                  label="Description"
                  value={b3Text}
                  onChange={(e) => setB3Text(e.target.value)}
                  rows={2}
                  placeholder="e.g. Training workshops..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Highlight 4 Title"
                  value={b4Title}
                  onChange={(e) => setB4Title(e.target.value)}
                  placeholder="e.g. Compensation & Stability"
                />
                <TextAreaField
                  label="Description"
                  value={b4Text}
                  onChange={(e) => setB4Text(e.target.value)}
                  rows={2}
                  placeholder="e.g. Salary, PF, and stability..."
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
