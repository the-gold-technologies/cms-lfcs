"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function ClubsActivitiesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");

  const [c1Name, setC1Name] = useState("");
  const [c2Name, setC2Name] = useState("");
  const [c3Name, setC3Name] = useState("");
  const [c4Name, setC4Name] = useState("");
  const [c5Name, setC5Name] = useState("");
  const [c6Name, setC6Name] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "CLUBS & SOCIETIES");
      setHeadline(initialData.headline ?? "Student Clubs & Active Co-Curriculars");
      setDescription(
        initialData.description ??
          "Student-led clubs encourage teamwork, passion exploration, and leadership outside standard periods.",
      );

      setC1Name(initialData.c1Name ?? "Academic Competitions & Olympiads");
      setC2Name(initialData.c2Name ?? "Quiz & General Knowledge Club");
      setC3Name(initialData.c3Name ?? "Technology & STEM Coding Lab");
      setC4Name(initialData.c4Name ?? "Debate & Model United Nations");
      setC5Name(initialData.c5Name ?? "Literary & Creative Writing Guild");
      setC6Name(initialData.c6Name ?? "Fine Arts & Craft Studio");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "ClubsActivitiesSection",
        content: {
          tagline,
          headline,
          description,
          c1Name,
          c2Name,
          c3Name,
          c4Name,
          c5Name,
          c6Name,
        },
      };

      const res = await fetch("/api/experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Clubs & Activities section saved successfully!");
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
        title="5. Student Clubs & Societies"
        description="6 co-curricular student interest clubs fostering innovation, debate, and creativity."
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
              placeholder="e.g. CLUBS & SOCIETIES"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Student Clubs & Active Co-Curriculars"
            />
          </div>

          <TextAreaField
            label="Section Narrative"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. Club participation narrative..."
          />

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              6 Active Student Clubs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <InputField
                label="Club 1"
                value={c1Name}
                onChange={(e) => setC1Name(e.target.value)}
                placeholder="e.g. Academic Competitions"
              />
              <InputField
                label="Club 2"
                value={c2Name}
                onChange={(e) => setC2Name(e.target.value)}
                placeholder="e.g. Quiz & GK Club"
              />
              <InputField
                label="Club 3"
                value={c3Name}
                onChange={(e) => setC3Name(e.target.value)}
                placeholder="e.g. Technology & STEM"
              />
              <InputField
                label="Club 4"
                value={c4Name}
                onChange={(e) => setC4Name(e.target.value)}
                placeholder="e.g. Debate & Communication"
              />
              <InputField
                label="Club 5"
                value={c5Name}
                onChange={(e) => setC5Name(e.target.value)}
                placeholder="e.g. Literary Guild"
              />
              <InputField
                label="Club 6"
                value={c6Name}
                onChange={(e) => setC6Name(e.target.value)}
                placeholder="e.g. Fine Arts & Craft"
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
