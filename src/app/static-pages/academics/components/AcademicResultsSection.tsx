"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Trophy, ArrowRight, Plus, X } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface ResultStat {
  value: string;
  label: string;
}

export function AcademicResultsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [headlineSuffix, setHeadlineSuffix] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [stats, setStats] = useState<ResultStat[]>([]);
  const [achieversHeading, setAchieversHeading] = useState("");
  const [topperBadge, setTopperBadge] = useState("");
  const [classXTitle, setClassXTitle] = useState("");
  const [classXExam, setClassXExam] = useState("");
  const [classXIITitle, setClassXIITitle] = useState("");
  const [classXIIExam, setClassXIIExam] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle(initialData.subtitle ?? "");
      setHeadlineSuffix(initialData.headlineSuffix ?? "");
      setBadgeText(initialData.badgeText ?? "");
      setStats(
        Array.isArray(initialData.stats)
          ? initialData.stats.map((st: any) => ({ value: st.value ?? "", label: st.label ?? "" }))
          : [],
      );
      setAchieversHeading(initialData.achieversHeading ?? "");
      setTopperBadge(initialData.topperBadge ?? "");
      setClassXTitle(initialData.classXTitle ?? "");
      setClassXExam(initialData.classXExam ?? "");
      setClassXIITitle(initialData.classXIITitle ?? "");
      setClassXIIExam(initialData.classXIIExam ?? "");
    }
  }, [initialData]);

  const handleUpdateStat = (index: number, field: keyof ResultStat, val: string) => {
    setStats((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "AcademicResultsSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          headlineSuffix,
          subtitle,
          badgeText,
          stats,
          achieversHeading,
          topperBadge,
          classXTitle,
          classXExam,
          classXIITitle,
          classXIIExam,
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
                  Individual student names, percentages, and topper photographs are managed in the
                  dedicated Board Results module.
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Pre-Heading Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Academic Results"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Primary Objective of"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Consistent"
            />
          </div>

          <InputField
            label="Headline Suffix"
            value={headlineSuffix}
            onChange={(e) => setHeadlineSuffix(e.target.value)}
            placeholder="e.g. Text shown after the script accent"
          />

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. At LFCS, we focus on a strong foundation, concept clarity, consistent learning..."
          />

          <InputField
            label="Badge Text"
            value={badgeText}
            onChange={(e) => setBadgeText(e.target.value)}
            placeholder="e.g. 100% Board Pass Rate (CBSE)"
          />

          {/* HIGHLIGHT STATS */}
          <div className="border-t border-gray-100 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Highlight Stats ({stats.length})
              </h4>
              <button
                type="button"
                onClick={() => setStats((prev) => [...prev, { value: "", label: "" }])}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#842b46] hover:text-[#0a192f] bg-[#842b46]/10 hover:bg-[#842b46]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stat</span>
              </button>
            </div>
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-end gap-3">
                <div className="w-40 shrink-0">
                  <InputField
                    label="Value"
                    value={stat.value}
                    onChange={(e) => handleUpdateStat(idx, "value", e.target.value)}
                    placeholder="e.g. 98%"
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    label="Label"
                    value={stat.label}
                    onChange={(e) => handleUpdateStat(idx, "label", e.target.value)}
                    placeholder="e.g. Class X Topper"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setStats((prev) => prev.filter((_, i) => i !== idx))}
                  className="mb-1 p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove Stat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* TOPPERS SHOWCASE LABELS */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Toppers Showcase Labels
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Achievers Heading"
                value={achieversHeading}
                onChange={(e) => setAchieversHeading(e.target.value)}
                placeholder="e.g. Our Star Performers"
              />
              <InputField
                label="Topper Ribbon Label"
                value={topperBadge}
                onChange={(e) => setTopperBadge(e.target.value)}
                placeholder="e.g. Campus Topper"
              />
              <InputField
                label="Class X Block Title"
                value={classXTitle}
                onChange={(e) => setClassXTitle(e.target.value)}
                placeholder="e.g. Class 10 Achievers"
              />
              <InputField
                label="Class X Exam Line"
                value={classXExam}
                onChange={(e) => setClassXExam(e.target.value)}
                placeholder="e.g. Board examination name and session"
              />
              <InputField
                label="Class XII Block Title"
                value={classXIITitle}
                onChange={(e) => setClassXIITitle(e.target.value)}
                placeholder="e.g. Class 12 Achievers"
              />
              <InputField
                label="Class XII Exam Line"
                value={classXIIExam}
                onChange={(e) => setClassXIIExam(e.target.value)}
                placeholder="e.g. Board examination name and session"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <div className="w-full">
              <SaveButton onClick={handleSave} loading={loading} saved={saved} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
