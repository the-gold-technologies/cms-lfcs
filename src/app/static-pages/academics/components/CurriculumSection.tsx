"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
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
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("");

  const [subjects, setSubjects] = useState<SubjectGroup[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "OUR CURRICULUM");
      setHeadline(
        initialData.headline ?? "A Curriculum Designed for Deep Conceptual Understanding",
      );
      setSubtitle(
        initialData.subtitle ??
          "Affiliated with the Central Board of Secondary Education (CBSE), New Delhi, our curriculum integrates NCERT guidelines with modern experiential inquiry.",
      );
      setImage(
        initialData.image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170028/lfcs-school/practical_1793170027731.webp",
      );

      if (Array.isArray(initialData.subjects) && initialData.subjects.length > 0) {
        setSubjects(
          initialData.subjects.map((s: any) => ({
            title: s.title ?? "",
            desc: s.desc ?? "",
          })),
        );
      } else {
        setSubjects([
          {
            title: initialData.subj1Title ?? "Language & Literature",
            desc:
              initialData.subj1Desc ??
              "English and Hindi articulation, grammar fluency, and comprehension.",
          },
          {
            title: initialData.subj2Title ?? "Mathematics & Logic",
            desc:
              initialData.subj2Desc ??
              "Conceptual problem-solving, mental arithmetic, and geometry.",
          },
          {
            title: initialData.subj3Title ?? "Science & Inquiry",
            desc:
              initialData.subj3Desc ??
              "Physics, Chemistry, and Biology hands-on lab experimentation.",
          },
          {
            title: initialData.subj4Title ?? "Social Sciences & Civics",
            desc:
              initialData.subj4Desc ??
              "History, Geography, and Democratic Politics understanding.",
          },
        ]);
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
  };

  const handleRemoveSubject = (index: number) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
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
    try {
      const payload = {
        section: "CurriculumSection",
        content: {
          tagline,
          headline,
          subtitle,
          image,
          subjects, // dynamic array object!
          // Backward compatibility:
          subj1Title: subjects[0]?.title ?? "",
          subj1Desc: subjects[0]?.desc ?? "",
          subj2Title: subjects[1]?.title ?? "",
          subj2Desc: subjects[1]?.desc ?? "",
          subj3Title: subjects[2]?.title ?? "",
          subj3Desc: subjects[2]?.desc ?? "",
          subj4Title: subjects[3]?.title ?? "",
          subj4Desc: subjects[3]?.desc ?? "",
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
        title="2. CBSE Curriculum Overview & Subject Groups"
        description="Explains the CBSE affiliation, composite illustration, and primary learning subjects."
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
              placeholder="e.g. OUR CURRICULUM"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. A Curriculum Designed for Deep Understanding"
            />
          </div>

          <TextAreaField
            label="Curriculum Overview"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. CBSE affiliation narrative..."
          />

          <ImagePickerField
            label="Curriculum Feature Illustration"
            value={image}
            onChange={(url) => setImage(url)}
            placeholder="e.g. Cloudinary curriculum photo URL"
          />

          {/* DYNAMIC SUBJECT GROUPS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Core Academic Disciplines ({subjects.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Subject groups and instructional focus. Can add more than 4 groups.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSubject}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Discipline</span>
              </button>
            </div>

            {subjects.length === 0 ? (
              <div
                onClick={handleAddSubject}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No disciplines added yet. Click to add your first subject.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjects.map((subj, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Discipline #{idx + 1}: {subj.title || "Untitled"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Discipline"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <InputField
                      label="Subject Title"
                      value={subj.title}
                      onChange={(e) => handleUpdateSubject(idx, "title", e.target.value)}
                      placeholder="e.g. Language & Literature"
                    />

                    <TextAreaField
                      label="Description"
                      value={subj.desc}
                      onChange={(e) => handleUpdateSubject(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. English, Hindi, and communication fluency..."
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
