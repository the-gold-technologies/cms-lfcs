"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { Plus } from "lucide-react";

export interface HomeTestimonial {
  name: string;
  role: string;
  text: string;
  category: "PARENTS" | "TEACHERS" | "STUDENTS";
}

export function TestimonialsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [testimonials, setTestimonials] = useState<HomeTestimonial[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle(initialData.subtitle ?? "");

      if (Array.isArray(initialData.testimonials)) {
        setTestimonials(
          initialData.testimonials.map((t: any) => ({
            name: t.name ?? "",
            role: t.role ?? "",
            text: t.text ?? "",
            category: t.category ?? "PARENTS",
          })),
        );
      } else {
        setTestimonials([]);
      }
    }
  }, [initialData]);

  const handleAddTestimonial = () => {
    setTestimonials((prev) => [
      ...prev,
      {
        name: "",
        role: "",
        text: "",
        category: "PARENTS",
      },
    ]);
    setOpenIndices((prev) => [...prev, testimonials.length]);
  };

  const handleRemoveTestimonial = (index: number) => {
    setTestimonials((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateTestimonial = (
    index: number,
    field: keyof HomeTestimonial,
    value: string,
  ) => {
    setTestimonials((prev) => {
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
        section: "TestimonialsSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          testimonials,
        },
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Testimonials section saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save section");
      }
    } catch {
      toast.error("Network error saving Testimonials section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6">
      <SectionHeader
        title="10. Testimonials & Community Voices"
        description="Parent, teacher, and student testimonials featured on the homepage."
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
              placeholder="e.g. COMMUNITY VOICES"
            />
            <InputField
              label="Main Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Loved by Parents, Trusted for"
            />
            <InputField
              label="Script Accent Text"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Generations"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Hear from the wonderful people who make our school a vibrant community..."
          />

          {/* Testimonials Card Array */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Testimonial Voices ({testimonials.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Quotes from Students, Teachers, and Parents.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openIndices.length === testimonials.length) {
                      setOpenIndices([]);
                    } else {
                      setOpenIndices(testimonials.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {openIndices.length === testimonials.length ? "Collapse All" : "Expand All"}
                </button>
                <button
                  type="button"
                  onClick={handleAddTestimonial}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#842b46] hover:text-[#0a192f] bg-[#842b46]/10 hover:bg-[#842b46]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Testimonial</span>
                </button>
              </div>
            </div>

            {testimonials.length === 0 ? (
              <div
                onClick={handleAddTestimonial}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No testimonials added yet. Click to add your first testimonial.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {testimonials.map((t, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`${t.name || "Untitled"} (${t.category})`}
                    badge={t.category}
                    subtitle={t.role}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveTestimonial(idx)}
                    deleteTitle="Delete Testimonial"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <InputField
                        label="Author Name"
                        value={t.name}
                        onChange={(e) => handleUpdateTestimonial(idx, "name", e.target.value)}
                        placeholder="e.g. Mr. Sarvesh Singh"
                      />
                      <InputField
                        label="Role / Designation"
                        value={t.role}
                        onChange={(e) => handleUpdateTestimonial(idx, "role", e.target.value)}
                        placeholder="e.g. Parent / Alumnus / PGT Science"
                      />
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                          Audience Category
                        </label>
                        <select
                          value={t.category}
                          onChange={(e) =>
                            handleUpdateTestimonial(idx, "category", e.target.value as any)
                          }
                          className="w-full text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#842b46] focus:ring-1 focus:ring-[#842b46]"
                        >
                          <option value="PARENTS">PARENTS</option>
                          <option value="TEACHERS">TEACHERS</option>
                          <option value="STUDENTS">STUDENTS</option>
                        </select>
                      </div>
                    </div>

                    <TextAreaField
                      label="Testimonial Quote"
                      value={t.text}
                      onChange={(e) => handleUpdateTestimonial(idx, "text", e.target.value)}
                      rows={3}
                      placeholder="e.g. Detailed quote describing their experience..."
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
