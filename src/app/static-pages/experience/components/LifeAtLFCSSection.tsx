"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function LifeAtLFCSSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [activitiesList, setActivitiesList] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "LIFE AT LFCS");
      setHeadline(initialData.headline ?? "Upskilling, Participating & Growing");
      setScriptAccent(initialData.scriptAccent ?? "EveryDay");
      setDescription(
        initialData.description ??
          "At LFCS, even though academics form the core for the student, these diverse activities and opportunities shape them and make them confident for their future.",
      );
      setActivitiesList(
        initialData.activitiesList ??
          "Classroom learning, Sports & physical training, Cultural festivals, Inter-school competitions, Student clubs, Educational excursions, Annual Day celebrations",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "LifeAtLFCSSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          activitiesList,
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
        toast.success("Life at LFCS section saved successfully!");
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
        title="2. Daily Campus Life & Routine Highlights"
        description="Highlights regular school day activities, extracurricular schedules, and student participation."
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
              placeholder="e.g. LIFE AT LFCS"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Upskilling, Participating & Growing"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. EveryDay"
            />
          </div>

          <TextAreaField
            label="Section Narrative"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Campus atmosphere and student growth narrative..."
          />

          <TextAreaField
            label="Activities Checklist (Comma Separated)"
            value={activitiesList}
            onChange={(e) => setActivitiesList(e.target.value)}
            rows={3}
            placeholder="e.g. Classroom learning, Sports training, Debates, Cultural festivals..."
          />

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
