"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function AcademicResultsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badgeText, setBadgeText] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "ACADEMIC EXCELLENCE");
      setHeadline(initialData.headline ?? "Consistent Outstanding Board Results");
      setSubtitle(initialData.subtitle ?? "Celebrating our brilliant CBSE Class X and Class XII toppers whose dedication and academic excellence continue to make LFCS proud.");
      setBadgeText(initialData.badgeText ?? "100% Board Pass Rate");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "AcademicResultsSection",
        content: {
          tagline,
          headline,
          subtitle,
          badgeText,
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
        toast.success("Academic Results section saved successfully!");
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
        title="6. Board Results & Toppers Showcase"
        description="Headlines, pass rate badges, and links to the comprehensive Board Results management portal."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-600 text-white">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Board Results & Merit Lists</p>
                <p className="text-[11px] text-gray-500">
                  Individual student names, percentages, and topper photographs are managed in the dedicated Board Results module.
                </p>
              </div>
            </div>
            <Link
              href="/results"
              className="px-4 py-2 bg-white text-amber-700 text-xs font-bold rounded-xl border border-amber-200 hover:bg-amber-50 transition-all flex items-center gap-1.5"
            >
              Manage Toppers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Eyebrow Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. ACADEMIC EXCELLENCE"
            />
            <div className="md:col-span-2">
              <InputField
                label="Section Headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Consistent Outstanding Board Results"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <TextAreaField
                label="Section Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={2}
                placeholder="e.g. Narrative celebrating toppers and board achievements..."
              />
            </div>
            <InputField
              label="Highlight Badge Text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="e.g. 100% Board Pass Rate"
            />
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
