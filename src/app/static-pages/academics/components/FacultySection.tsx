"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function FacultySection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "OUR FACULTY");
      setHeadline(initialData.headline ?? "Meet Our School");
      setScriptAccent(initialData.scriptAccent ?? "Principals");
      setSubtitle(
        initialData.subtitle ??
          "Experienced academic leaders guiding faculty mentors and nurturing student potential across all 8 branches.",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "FacultySection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
        },
      };

      const res = await fetch("/api/academics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Faculty & Principals section saved successfully!");
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
        title="5. Academic Leadership & School Principals"
        description="Header and narrative for the school leadership showcase. Individual principal cards are pulled dynamically from the Campuses module."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0E5A60] text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Dynamic Principals & Campuses</p>
                <p className="text-[11px] text-gray-500">
                  Principal photos, designations, and qualifications can also be configured per
                  branch in the Campuses directory.
                </p>
              </div>
            </div>
            <Link
              href="/campuses"
              className="px-4 py-2 bg-white text-[#0E5A60] text-xs font-bold rounded-xl border border-teal-200 hover:bg-teal-50 transition-all flex items-center gap-1.5"
            >
              Campuses Module <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Eyebrow Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. OUR FACULTY"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Meet Our School"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Principals"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Educational leadership narrative..."
          />

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
