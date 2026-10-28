"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { Plus, Trash2 } from "lucide-react";

export interface MethodologyCard {
  title: string;
  desc: string;
  image: string;
}

export function TeachingAndLearningSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [methodologies, setMethodologies] = useState<MethodologyCard[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "TEACHING & LEARNING");
      setHeadline(initialData.headline ?? "From Concepts to Applying Them");
      setSubtitle(
        initialData.subtitle ??
          "Learning at LFCS moves beyond books. Our skilled educators make classroom learning interactive, exploratory, and memorable.",
      );

      if (Array.isArray(initialData.methodologies) && initialData.methodologies.length > 0) {
        setMethodologies(
          initialData.methodologies.map((m: any) => ({
            title: m.title ?? "",
            desc: m.desc ?? m.description ?? "",
            image: m.image ?? "",
          })),
        );
      } else {
        setMethodologies([
          {
            title: initialData.m1Title ?? "Collaborative Group Inquiry",
            desc:
              initialData.m1Desc ??
              "Peer-to-peer discussions, group projects, and team presentations that reinforce communication.",
            image:
              initialData.m1Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170022/lfcs-school/collabrative_1793170021825.webp",
          },
          {
            title: initialData.m2Title ?? "Practical Demonstrations",
            desc:
              initialData.m2Desc ??
              "Laboratory experiments, real-world models, and tactile math tools to cement abstract formulas.",
            image:
              initialData.m2Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170028/lfcs-school/practical_1793170027731.webp",
          },
          {
            title: initialData.m3Title ?? "Independent Research",
            desc:
              initialData.m3Desc ??
              "Library exploration, topic syntheses, and self-directed study units fostering intellectual curiosity.",
            image:
              initialData.m3Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170030/lfcs-school/independent_1793170030545.webp",
          },
          {
            title: initialData.m4Title ?? "Activity-Based Integration",
            desc:
              initialData.m4Desc ??
              "Role plays, quizzes, field trips, and subject weeks bridging curriculum knowledge with active experiences.",
            image:
              initialData.m4Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170034/lfcs-school/activity_1793170034132.webp",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddMethodology = () => {
    setMethodologies((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
        image: "",
      },
    ]);
  };

  const handleRemoveMethodology = (index: number) => {
    setMethodologies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateMethodology = (
    index: number,
    field: keyof MethodologyCard,
    value: string,
  ) => {
    setMethodologies((prev) => {
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
        section: "TeachingAndLearningSection",
        content: {
          tagline,
          headline,
          subtitle,
          methodologies, // Array object!
          // Backward compatibility:
          m1Title: methodologies[0]?.title ?? "",
          m1Desc: methodologies[0]?.desc ?? "",
          m1Image: methodologies[0]?.image ?? "",
          m2Title: methodologies[1]?.title ?? "",
          m2Desc: methodologies[1]?.desc ?? "",
          m2Image: methodologies[1]?.image ?? "",
          m3Title: methodologies[2]?.title ?? "",
          m3Desc: methodologies[2]?.desc ?? "",
          m3Image: methodologies[2]?.image ?? "",
          m4Title: methodologies[3]?.title ?? "",
          m4Desc: methodologies[3]?.desc ?? "",
          m4Image: methodologies[3]?.image ?? "",
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
        toast.success("Teaching & Learning section saved successfully!");
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
        title="4. Teaching & Learning Methodologies"
        description="Explains dynamic instructional methods: Collaborative Inquiry, Practical Labs, Independent Study, and Activity-Based Integration."
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
              placeholder="e.g. TEACHING & LEARNING"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. From Concepts to Applying Them"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Pedagogical overview..."
          />

          {/* DYNAMIC METHODOLOGIES ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Instructional Approaches ({methodologies.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Dynamic pedagogical approaches applied in the classroom. Can add more than 4 approaches.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMethodology}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Approach</span>
              </button>
            </div>

            {methodologies.length === 0 ? (
              <div
                onClick={handleAddMethodology}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No approaches added yet. Click to add your first instructional approach.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {methodologies.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3.5 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Approach #{idx + 1}: {m.title || "Untitled Approach"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMethodology(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Approach"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <InputField
                      label="Approach Title"
                      value={m.title}
                      onChange={(e) => handleUpdateMethodology(idx, "title", e.target.value)}
                      placeholder="e.g. Collaborative Inquiry"
                    />

                    <TextAreaField
                      label="Description"
                      value={m.desc}
                      onChange={(e) => handleUpdateMethodology(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Group study and peer learning explanation..."
                    />

                    <ImagePickerField
                      label="Approach Photo"
                      value={m.image}
                      onChange={(url) => handleUpdateMethodology(idx, "image", url)}
                      placeholder="e.g. Cloudinary photo URL"
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
