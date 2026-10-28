"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function AdmissionClassesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [c1Name, setC1Name] = useState("");
  const [c1Grades, setC1Grades] = useState("");
  const [c1Desc, setC1Desc] = useState("");

  const [c2Name, setC2Name] = useState("");
  const [c2Grades, setC2Grades] = useState("");
  const [c2Desc, setC2Desc] = useState("");

  const [c3Name, setC3Name] = useState("");
  const [c3Grades, setC3Grades] = useState("");
  const [c3Desc, setC3Desc] = useState("");

  const [c4Name, setC4Name] = useState("");
  const [c4Grades, setC4Grades] = useState("");
  const [c4Desc, setC4Desc] = useState("");

  const [c5Name, setC5Name] = useState("");
  const [c5Grades, setC5Grades] = useState("");
  const [c5Desc, setC5Desc] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "CLASSES OPEN FOR ADMISSION");
      setHeadline(initialData.headline ?? "Find the Right Learning Stage");
      setScriptAccent(initialData.scriptAccent ?? "for Your Child");
      setSubtitle(initialData.subtitle ?? "Little Flower Group of Schools offers admissions across foundational pre-primary, primary, middle, and senior secondary grades.");

      setC1Name(initialData.c1Name ?? "Pre-Primary Foundation");
      setC1Grades(initialData.c1Grades ?? "Nursery, LKG, UKG");
      setC1Desc(initialData.c1Desc ?? "Play-based motor skills, phonics, socialization, and storytelling.");

      setC2Name(initialData.c2Name ?? "Primary School");
      setC2Grades(initialData.c2Grades ?? "Classes I to V");
      setC2Desc(initialData.c2Desc ?? "Foundational numeracy, literacy, hindi, environmental studies, and co-curriculars.");

      setC3Name(initialData.c3Name ?? "Middle School");
      setC3Grades(initialData.c3Grades ?? "Classes VI to VIII");
      setC3Desc(initialData.c3Desc ?? "Subject specialization, science labs, computer technology, and sports.");

      setC4Name(initialData.c4Name ?? "Secondary School");
      setC4Grades(initialData.c4Grades ?? "Classes IX and X");
      setC4Desc(initialData.c4Desc ?? "Rigorous CBSE Board syllabus, practical experiments, and academic remediation.");

      setC5Name(initialData.c5Name ?? "Senior Secondary");
      setC5Grades(initialData.c5Grades ?? "Classes XI and XII");
      setC5Desc(initialData.c5Desc ?? "Science (PCM/PCB), Commerce, and Humanities with integrated competitive coaching.");
    }
  }, [initialData]);

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
          c1Name,
          c1Grades,
          c1Desc,
          c2Name,
          c2Grades,
          c2Desc,
          c3Name,
          c3Grades,
          c3Desc,
          c4Name,
          c4Grades,
          c4Desc,
          c5Name,
          c5Grades,
          c5Desc,
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
        title="3. Classes Open for Admission (Grade-by-Grade)"
        description="Configure admission eligibility descriptions across Pre-Primary, Primary, Middle, Secondary, and Senior Secondary."
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
            placeholder="e.g. Grade offerings introductory text..."
          />

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              5 Grade Bands
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <InputField
                  label="Band 1 Name"
                  value={c1Name}
                  onChange={(e) => setC1Name(e.target.value)}
                  placeholder="e.g. Pre-Primary Foundation"
                />
                <InputField
                  label="Eligible Grades"
                  value={c1Grades}
                  onChange={(e) => setC1Grades(e.target.value)}
                  placeholder="e.g. Nursery, LKG, UKG"
                />
                <InputField
                  label="Description"
                  value={c1Desc}
                  onChange={(e) => setC1Desc(e.target.value)}
                  placeholder="e.g. Play-based learning details..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <InputField
                  label="Band 2 Name"
                  value={c2Name}
                  onChange={(e) => setC2Name(e.target.value)}
                  placeholder="e.g. Primary School"
                />
                <InputField
                  label="Eligible Grades"
                  value={c2Grades}
                  onChange={(e) => setC2Grades(e.target.value)}
                  placeholder="e.g. Classes I to V"
                />
                <InputField
                  label="Description"
                  value={c2Desc}
                  onChange={(e) => setC2Desc(e.target.value)}
                  placeholder="e.g. Numeracy & literacy..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <InputField
                  label="Band 3 Name"
                  value={c3Name}
                  onChange={(e) => setC3Name(e.target.value)}
                  placeholder="e.g. Middle School"
                />
                <InputField
                  label="Eligible Grades"
                  value={c3Grades}
                  onChange={(e) => setC3Grades(e.target.value)}
                  placeholder="e.g. Classes VI to VIII"
                />
                <InputField
                  label="Description"
                  value={c3Desc}
                  onChange={(e) => setC3Desc(e.target.value)}
                  placeholder="e.g. Science labs & sports..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <InputField
                  label="Band 4 Name"
                  value={c4Name}
                  onChange={(e) => setC4Name(e.target.value)}
                  placeholder="e.g. Secondary School"
                />
                <InputField
                  label="Eligible Grades"
                  value={c4Grades}
                  onChange={(e) => setC4Grades(e.target.value)}
                  placeholder="e.g. Classes IX and X"
                />
                <InputField
                  label="Description"
                  value={c4Desc}
                  onChange={(e) => setC4Desc(e.target.value)}
                  placeholder="e.g. CBSE Board preparation..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <InputField
                  label="Band 5 Name"
                  value={c5Name}
                  onChange={(e) => setC5Name(e.target.value)}
                  placeholder="e.g. Senior Secondary"
                />
                <InputField
                  label="Eligible Grades"
                  value={c5Grades}
                  onChange={(e) => setC5Grades(e.target.value)}
                  placeholder="e.g. Classes XI and XII"
                />
                <InputField
                  label="Description"
                  value={c5Desc}
                  onChange={(e) => setC5Desc(e.target.value)}
                  placeholder="e.g. Science, Commerce, Humanities..."
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
