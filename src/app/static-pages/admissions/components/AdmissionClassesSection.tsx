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

export interface AdmissionClass {
  title: string;
  grades: string;
  desc: string;
  image: string;
}

export function AdmissionClassesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [noticeText, setNoticeText] = useState("");

  const [classes, setClasses] = useState<AdmissionClass[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle(initialData.subtitle ?? "");
      setCtaText(initialData.ctaText ?? "");
      setCtaLink(initialData.ctaLink ?? "");
      setNoticeText(initialData.noticeText ?? "");

      if (Array.isArray(initialData.classes)) {
        setClasses(
          initialData.classes.map((c: any) => ({
            title: c.title ?? c.name ?? "",
            grades: c.grades ?? "",
            desc: c.desc ?? c.description ?? "",
            image: c.image ?? "",
          })),
        );
      } else {
        setClasses([]);
      }
    }
  }, [initialData]);

  const handleAddClass = () => {
    setClasses((prev) => [
      ...prev,
      {
        title: "",
        grades: "",
        desc: "",
        image: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, classes.length]);
  };

  const handleRemoveClass = (index: number) => {
    setClasses((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
  };

  const handleUpdateClass = (index: number, field: keyof AdmissionClass, value: string) => {
    setClasses((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "AdmissionClassesSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          ctaText,
          ctaLink,
          noticeText,
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
        toast.success("Classes Open for Admission saved successfully!");
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
        title="3. Classes Open for Admission"
        description="Stage-by-stage learning breakdown from Pre-Primary through Senior Secondary with curriculum highlights."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Pre-Heading Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Classes Open for Admission"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Find the Right Learning"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Stage for Your Child"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Little Flower Group of Schools offers educational opportunities across different stages..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Enquire About Class Availability"
            />
            <InputField
              label="CTA Button Link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. #admission-enquiry"
            />
          </div>

          <TextAreaField
            label="Campus Availability Notice"
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            rows={2}
            placeholder="e.g. The classes available for admission may vary by campus. Connect with your preferred school..."
          />

          {/* DYNAMIC CLASS STAGES */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Learning Stages ({classes.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Educational stages open for admissions (e.g. Early Years, Primary, Middle,
                  Secondary, Senior Secondary).
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddClass}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#842b46] bg-[#842b46]/10 hover:bg-[#842b46]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stage</span>
              </button>
            </div>

            {classes.length === 0 ? (
              <div
                onClick={handleAddClass}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#842b46] hover:text-[#842b46] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No learning stages added yet. Click to add the first stage.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {classes.map((cls, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Stage ${idx + 1}: ${cls.title || "Untitled Stage"}`}
                    thumbnail={cls.image}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveClass(idx)}
                    deleteTitle="Delete Stage"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InputField
                        label="Stage Title"
                        value={cls.title}
                        onChange={(e) => handleUpdateClass(idx, "title", e.target.value)}
                        placeholder="e.g. Early Years"
                      />
                      <InputField
                        label="Grades Range"
                        value={cls.grades}
                        onChange={(e) => handleUpdateClass(idx, "grades", e.target.value)}
                        placeholder="e.g. Nursery — UKG"
                      />
                    </div>

                    <TextAreaField
                      label="Stage Description"
                      value={cls.desc}
                      onChange={(e) => handleUpdateClass(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Focus on play-based learning, sensory development..."
                    />

                    <ImagePickerField
                      label="Stage Illustration / Photo"
                      value={cls.image}
                      onChange={(url) => handleUpdateClass(idx, "image", url)}
                      placeholder="e.g. Cloudinary image URL"
                      folder="lfcs-school/admissions"
                    />
                  </CollapsibleCard>
                ))}
              </div>
            )}
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
