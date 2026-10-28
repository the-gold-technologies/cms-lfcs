"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function CurriculumSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("");

  const [subj1Title, setSubj1Title] = useState("");
  const [subj1Desc, setSubj1Desc] = useState("");
  const [subj2Title, setSubj2Title] = useState("");
  const [subj2Desc, setSubj2Desc] = useState("");
  const [subj3Title, setSubj3Title] = useState("");
  const [subj3Desc, setSubj3Desc] = useState("");
  const [subj4Title, setSubj4Title] = useState("");
  const [subj4Desc, setSubj4Desc] = useState("");

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

      setSubj1Title(initialData.subj1Title ?? "Language & Literature");
      setSubj1Desc(
        initialData.subj1Desc ??
          "English and Hindi articulation, grammar fluency, and comprehension.",
      );
      setSubj2Title(initialData.subj2Title ?? "Mathematics & Logic");
      setSubj2Desc(
        initialData.subj2Desc ?? "Conceptual problem-solving, mental arithmetic, and geometry.",
      );
      setSubj3Title(initialData.subj3Title ?? "Science & Inquiry");
      setSubj3Desc(
        initialData.subj3Desc ?? "Physics, Chemistry, and Biology hands-on lab experimentation.",
      );
      setSubj4Title(initialData.subj4Title ?? "Social Sciences & Civics");
      setSubj4Desc(
        initialData.subj4Desc ?? "History, Geography, and Democratic Politics understanding.",
      );
    }
  }, [initialData]);

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
          subj1Title,
          subj1Desc,
          subj2Title,
          subj2Desc,
          subj3Title,
          subj3Desc,
          subj4Title,
          subj4Desc,
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

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Core Academic Disciplines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Subject Group 1"
                  value={subj1Title}
                  onChange={(e) => setSubj1Title(e.target.value)}
                  placeholder="e.g. Language & Literature"
                />
                <TextAreaField
                  label="Description"
                  value={subj1Desc}
                  onChange={(e) => setSubj1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. English, Hindi, and communication fluency..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Subject Group 2"
                  value={subj2Title}
                  onChange={(e) => setSubj2Title(e.target.value)}
                  placeholder="e.g. Mathematics & Logic"
                />
                <TextAreaField
                  label="Description"
                  value={subj2Desc}
                  onChange={(e) => setSubj2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Problem-solving and analytical reasoning..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Subject Group 3"
                  value={subj3Title}
                  onChange={(e) => setSubj3Title(e.target.value)}
                  placeholder="e.g. Science & Inquiry"
                />
                <TextAreaField
                  label="Description"
                  value={subj3Desc}
                  onChange={(e) => setSubj3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Hands-on physics, chemistry, and biology labs..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Subject Group 4"
                  value={subj4Title}
                  onChange={(e) => setSubj4Title(e.target.value)}
                  placeholder="e.g. Social Sciences & Civics"
                />
                <TextAreaField
                  label="Description"
                  value={subj4Desc}
                  onChange={(e) => setSubj4Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. History, geography, and global awareness..."
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
