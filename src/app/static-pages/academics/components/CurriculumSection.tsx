"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface SubjectGroup {
  title: string;
  desc: string;
}

export function CurriculumSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("");

  const [subjects, setSubjects] = useState<SubjectGroup[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle(initialData.subtitle ?? "");
      setImage(initialData.image ?? "");

      if (Array.isArray(initialData.subjects)) {
        setSubjects(
          initialData.subjects.map((s: any) => ({
            title: s.title ?? "",
            desc: s.desc ?? "",
          })),
        );
      } else {
        setSubjects([]);
      }
    }
  }, [initialData]);

  const handleAddSubject = () => {
    setSubjects((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, subjects.length]);
  };

  const handleRemoveSubject = (index: number) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateSubject = (index: number, field: keyof SubjectGroup, val: string) => {
    setSubjects((prev) => {
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
        section: "CurriculumSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          image,
          subjects,
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
        toast.success("Curriculum section saved successfully!");
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
        title="2. CBSE Curriculum Overview"
        description="Comprehensive framework of subjects taught across languages, sciences, social disciplines, mathematics, and IT."
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
              placeholder="e.g. OUR CURRICULUM"
            />
            <InputField
              label="Main Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. A curriculum applied for"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Developmental Learning"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Our curriculum is designed to provide students with a structured academic journey..."
          />

          <ImagePickerField
            label="Curriculum Feature Illustration"
            value={image}
            onChange={setImage}
            folder="lfcs-school/academics"
          />

          {/* DYNAMIC SUBJECT GROUPS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Academic Subject Areas ({subjects.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Core subject pillars taught under the CBSE framework.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSubject}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#842b46] hover:text-[#0a192f] bg-[#842b46]/10 hover:bg-[#842b46]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Subject</span>
              </button>
            </div>

            {subjects.length === 0 ? (
              <div
                onClick={handleAddSubject}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No subject areas added yet. Click to add your first subject.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {subjects.map((subject, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={subject.title || `Subject ${idx + 1}`}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveSubject(idx)}
                  >
                    <InputField
                      label="Subject Title"
                      value={subject.title}
                      onChange={(e) => handleUpdateSubject(idx, "title", e.target.value)}
                      placeholder="e.g. Languages"
                    />

                    <InputField
                      label="Short Summary"
                      value={subject.desc}
                      onChange={(e) => handleUpdateSubject(idx, "desc", e.target.value)}
                      placeholder="e.g. English, Hindi & more."
                    />
                  </CollapsibleCard>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
