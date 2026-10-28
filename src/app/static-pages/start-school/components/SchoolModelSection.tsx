"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function SchoolModelSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [area1Title, setArea1Title] = useState("");
  const [area1Desc, setArea1Desc] = useState("");
  const [area2Title, setArea2Title] = useState("");
  const [area2Desc, setArea2Desc] = useState("");
  const [area3Title, setArea3Title] = useState("");
  const [area3Desc, setArea3Desc] = useState("");
  const [area4Title, setArea4Title] = useState("");
  const [area4Desc, setArea4Desc] = useState("");
  const [area5Title, setArea5Title] = useState("");
  const [area5Desc, setArea5Desc] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "LFCS SCHOOL MODEL");
      setHeadline(initialData.headline ?? "A Partnership Built Around");
      setScriptAccent(initialData.scriptAccent ?? "Education");
      setSubtitle(initialData.subtitle ?? "A transparent institutional framework designed to align academic excellence, school administration, and sustainable local community impact.");

      setArea1Title(initialData.area1Title ?? "Educational Framework");
      setArea1Desc(initialData.area1Desc ?? "Full alignment with the LFCS pedagogical approach, student evaluations, and school values.");

      setArea2Title(initialData.area2Title ?? "School Management System");
      setArea2Desc(initialData.area2Desc ?? "Clear delineation of operational responsibilities, ERP deployment, and administration.");

      setArea3Title(initialData.area3Title ?? "Academic Structure");
      setArea3Desc(initialData.area3Desc ?? "Continuous guidance on CBSE curriculum rollout, teacher training, and timetable management.");

      setArea4Title(initialData.area4Title ?? "Brand Identity Standards");
      setArea4Desc(initialData.area4Desc ?? "Authorized usage of LFCS logos, school uniforms, signage, and marketing collaterals.");

      setArea5Title(initialData.area5Title ?? "Campus Development Coordination");
      setArea5Desc(initialData.area5Desc ?? "Architectural blueprints, laboratory layouts, safety clearances, and sports ground setup.");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "SchoolModelSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          area1Title,
          area1Desc,
          area2Title,
          area2Desc,
          area3Title,
          area3Desc,
          area4Title,
          area4Desc,
          area5Title,
          area5Desc,
        },
      };

      const res = await fetch("/api/start-school", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("School Model section saved successfully!");
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
        title="3. LFCS School Operating Model (5 Pillars)"
        description="Core operational framework: Educational, Management, Academic Structure, Brand Identity, and Development."
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
              placeholder="e.g. LFCS SCHOOL MODEL"
            />
            <InputField
              label="Headline Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. A Partnership Built Around"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Education"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Operating model summary..."
          />

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              5 Model Focus Areas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Area 1 Title"
                  value={area1Title}
                  onChange={(e) => setArea1Title(e.target.value)}
                  placeholder="e.g. Educational Framework"
                />
                <TextAreaField
                  label="Description"
                  value={area1Desc}
                  onChange={(e) => setArea1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Learning approach..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Area 2 Title"
                  value={area2Title}
                  onChange={(e) => setArea2Title(e.target.value)}
                  placeholder="e.g. School Management"
                />
                <TextAreaField
                  label="Description"
                  value={area2Desc}
                  onChange={(e) => setArea2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Operations and ERP..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Area 3 Title"
                  value={area3Title}
                  onChange={(e) => setArea3Title(e.target.value)}
                  placeholder="e.g. Academic Structure"
                />
                <TextAreaField
                  label="Description"
                  value={area3Desc}
                  onChange={(e) => setArea3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Curriculum guidance..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Area 4 Title"
                  value={area4Title}
                  onChange={(e) => setArea4Title(e.target.value)}
                  placeholder="e.g. Brand Identity"
                />
                <TextAreaField
                  label="Description"
                  value={area4Desc}
                  onChange={(e) => setArea4Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Brand usage guidelines..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Area 5 Title"
                  value={area5Title}
                  onChange={(e) => setArea5Title(e.target.value)}
                  placeholder="e.g. School Development"
                />
                <TextAreaField
                  label="Description"
                  value={area5Desc}
                  onChange={(e) => setArea5Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Campus blueprints..."
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
