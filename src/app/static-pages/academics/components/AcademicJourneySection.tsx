"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function AcademicJourneySection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");

  const [s1Title, setS1Title] = useState("");
  const [s1Grades, setS1Grades] = useState("");
  const [s1Desc, setS1Desc] = useState("");
  const [s1Image, setS1Image] = useState("");

  const [s2Title, setS2Title] = useState("");
  const [s2Grades, setS2Grades] = useState("");
  const [s2Desc, setS2Desc] = useState("");
  const [s2Image, setS2Image] = useState("");

  const [s3Title, setS3Title] = useState("");
  const [s3Grades, setS3Grades] = useState("");
  const [s3Desc, setS3Desc] = useState("");
  const [s3Image, setS3Image] = useState("");

  const [s4Title, setS4Title] = useState("");
  const [s4Grades, setS4Grades] = useState("");
  const [s4Desc, setS4Desc] = useState("");
  const [s4Image, setS4Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "LEARNING PATHWAYS");
      setHeadline(initialData.headline ?? "The Academic Journey at Little Flower");

      setS1Title(initialData.s1Title ?? "Early Years");
      setS1Grades(initialData.s1Grades ?? "[Nursery – UKG]");
      setS1Desc(initialData.s1Desc ?? "Play-based exploration, sensory development, phonics, and foundational social skills.");
      setS1Image(initialData.s1Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170030/lfcs-school/independent_1793170030545.webp");

      setS2Title(initialData.s2Title ?? "Primary School");
      setS2Grades(initialData.s2Grades ?? "[Classes I – V]");
      setS2Desc(initialData.s2Desc ?? "Building conceptual numeracy, bilingual literacy, environmental science, and structured habits.");
      setS2Image(initialData.s2Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170034/lfcs-school/activity_1793170034132.webp");

      setS3Title(initialData.s3Title ?? "Middle School");
      setS3Grades(initialData.s3Grades ?? "[Classes VI – VIII]");
      setS3Desc(initialData.s3Desc ?? "Transitioning into rigorous subject disciplines, computer science, and creative projects.");
      setS3Image(initialData.s3Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170020/lfcs-school/Experience6_1793170019770.webp");

      setS4Title(initialData.s4Title ?? "Secondary & Senior Secondary");
      setS4Grades(initialData.s4Grades ?? "[Classes IX – XII]");
      setS4Desc(initialData.s4Desc ?? "Board examination mastery in Science, Commerce, and Humanities with IIT-JEE and NEET coaching support.");
      setS4Image(initialData.s4Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170019/lfcs-school/digital-classroom_1793170018820.webp");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "AcademicJourneySection",
        content: {
          tagline,
          headline,
          s1Title,
          s1Grades,
          s1Desc,
          s1Image,
          s2Title,
          s2Grades,
          s2Desc,
          s2Image,
          s3Title,
          s3Grades,
          s3Desc,
          s3Image,
          s4Title,
          s4Grades,
          s4Desc,
          s4Image,
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
        toast.success("Academic Journey stages saved successfully!");
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
        title="3. Academic Journey Stages (Nursery to Class XII)"
        description="Structured learning stages: Early Years (Nursery-UKG), Primary (I-V), Middle (VI-VIII), and Senior Secondary (IX-XII)."
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
              placeholder="e.g. LEARNING PATHWAYS"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. The Academic Journey at Little Flower"
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              4 Developmental Stages
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="Stage 1 Title"
                    value={s1Title}
                    onChange={(e) => setS1Title(e.target.value)}
                    placeholder="e.g. Early Years"
                  />
                  <InputField
                    label="Grades"
                    value={s1Grades}
                    onChange={(e) => setS1Grades(e.target.value)}
                    placeholder="e.g. [Nursery – UKG]"
                  />
                </div>
                <TextAreaField
                  label="Curricular Focus"
                  value={s1Desc}
                  onChange={(e) => setS1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Play-based learning details..."
                />
                <ImagePickerField
                  label="Stage Photo"
                  value={s1Image}
                  onChange={(url) => setS1Image(url)}
                  placeholder="e.g. Cloudinary early years photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="Stage 2 Title"
                    value={s2Title}
                    onChange={(e) => setS2Title(e.target.value)}
                    placeholder="e.g. Primary School"
                  />
                  <InputField
                    label="Grades"
                    value={s2Grades}
                    onChange={(e) => setS2Grades(e.target.value)}
                    placeholder="e.g. [Classes I – V]"
                  />
                </div>
                <TextAreaField
                  label="Curricular Focus"
                  value={s2Desc}
                  onChange={(e) => setS2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Primary school numeracy & literacy..."
                />
                <ImagePickerField
                  label="Stage Photo"
                  value={s2Image}
                  onChange={(url) => setS2Image(url)}
                  placeholder="e.g. Cloudinary primary school photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="Stage 3 Title"
                    value={s3Title}
                    onChange={(e) => setS3Title(e.target.value)}
                    placeholder="e.g. Middle School"
                  />
                  <InputField
                    label="Grades"
                    value={s3Grades}
                    onChange={(e) => setS3Grades(e.target.value)}
                    placeholder="e.g. [Classes VI – VIII]"
                  />
                </div>
                <TextAreaField
                  label="Curricular Focus"
                  value={s3Desc}
                  onChange={(e) => setS3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Middle school sciences & lab work..."
                />
                <ImagePickerField
                  label="Stage Photo"
                  value={s3Image}
                  onChange={(url) => setS3Image(url)}
                  placeholder="e.g. Cloudinary middle school photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="Stage 4 Title"
                    value={s4Title}
                    onChange={(e) => setS4Title(e.target.value)}
                    placeholder="e.g. Senior Secondary"
                  />
                  <InputField
                    label="Grades"
                    value={s4Grades}
                    onChange={(e) => setS4Grades(e.target.value)}
                    placeholder="e.g. [Classes IX – XII]"
                  />
                </div>
                <TextAreaField
                  label="Curricular Focus"
                  value={s4Desc}
                  onChange={(e) => setS4Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Senior secondary board preparation..."
                />
                <ImagePickerField
                  label="Stage Photo"
                  value={s4Image}
                  onChange={(url) => setS4Image(url)}
                  placeholder="e.g. Cloudinary senior school photo URL"
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
