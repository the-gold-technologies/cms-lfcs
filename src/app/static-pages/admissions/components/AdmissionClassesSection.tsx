"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface AdmissionClass {
  name: string;
  grades: string;
  desc: string;
}

export function AdmissionClassesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [classes, setClasses] = useState<AdmissionClass[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "CLASSES OPEN FOR ADMISSION");
      setHeadline(initialData.headline ?? "Find the Right Learning Stage");
      setScriptAccent(initialData.scriptAccent ?? "for Your Child");
      setSubtitle(
        initialData.subtitle ??
          "Little Flower Group of Schools offers admissions across foundational pre-primary, primary, middle, and senior secondary grades.",
      );

      if (Array.isArray(initialData.classes) && initialData.classes.length > 0) {
        setClasses(
          initialData.classes.map((c: any) => ({
            name: c.name ?? "",
            grades: c.grades ?? "",
            desc: c.desc ?? "",
          })),
        );
      } else {
        setClasses([
          {
            name: initialData.c1Name ?? "Pre-Primary Foundation",
            grades: initialData.c1Grades ?? "Nursery, LKG, UKG",
            desc:
              initialData.c1Desc ??
              "Play-based motor skills, phonics, socialization, and storytelling.",
          },
          {
            name: initialData.c2Name ?? "Primary School",
            grades: initialData.c2Grades ?? "Classes I to V",
            desc:
              initialData.c2Desc ??
              "Foundational numeracy, literacy, hindi, environmental studies, and co-curriculars.",
          },
          {
            name: initialData.c3Name ?? "Middle School",
            grades: initialData.c3Grades ?? "Classes VI to VIII",
            desc:
              initialData.c3Desc ??
              "Subject specialization, science labs, computer technology, and sports.",
          },
          {
            name: initialData.c4Name ?? "Secondary School",
            grades: initialData.c4Grades ?? "Classes IX and X",
            desc:
              initialData.c4Desc ??
              "Rigorous CBSE Board syllabus, practical experiments, and academic remediation.",
          },
          {
            name: initialData.c5Name ?? "Senior Secondary",
            grades: initialData.c5Grades ?? "Classes XI and XII",
            desc:
              initialData.c5Desc ??
              "Science (PCM/PCB), Commerce, and Humanities with integrated competitive coaching.",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddClass = () => {
    setClasses((prev) => [
      ...prev,
      {
        name: "",
        grades: "",
        desc: "",
      },
    ]);
  };

  const handleRemoveClass = (index: number) => {
    setClasses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateClass = (index: number, field: keyof AdmissionClass, val: string) => {
    setClasses((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "AdmissionClassesSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          classes,
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
        toast.success("Admission Classes section saved successfully!");
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
        title="3. Entry Stages & Grade Groups"
        description="Configure available entry grade stages: Pre-Primary Foundation, Primary, Middle, Secondary, and Senior Secondary."
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
              placeholder="e.g. CLASSES OPEN FOR ADMISSION"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Find the Right Learning Stage"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. for Your Child"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Overview of grade groups open for admission..."
          />

          {/* DYNAMIC ADMISSION STAGES ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Admission Grade Stages ({classes.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Available entry stages and grade levels. Can add more stages.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddClass}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stage</span>
              </button>
            </div>

            {classes.length === 0 ? (
              <div
                onClick={handleAddClass}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No stages added yet. Click to add your first admission stage.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {classes.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3.5 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Stage #{idx + 1}: {c.name || "Untitled Stage"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveClass(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Stage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Stage Name"
                        value={c.name}
                        onChange={(e) => handleUpdateClass(idx, "name", e.target.value)}
                        placeholder="e.g. Pre-Primary Foundation"
                      />
                      <InputField
                        label="Grades Included"
                        value={c.grades}
                        onChange={(e) => handleUpdateClass(idx, "grades", e.target.value)}
                        placeholder="e.g. Nursery, LKG, UKG"
                      />
                    </div>

                    <TextAreaField
                      label="Curriculum & Learning Focus"
                      value={c.desc}
                      onChange={(e) => handleUpdateClass(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Play-based motor skills, foundational literacy..."
                    />
                  </div>
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
