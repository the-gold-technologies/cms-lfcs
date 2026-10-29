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

interface LeaderProfile {
  name: string;
  role: string;
  quote: string;
  bio: string;
  image: string;
}

export function LeadershipSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [leaders, setLeaders] = useState<LeaderProfile[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "LEADERSHIP & VISION");
      setHeadline(initialData.headline ?? "Guiding the Institution with Integrity");
      setSubtitle(
        initialData.subtitle ??
          "Meet the visionary pioneers and active academic administrators guiding Little Flower Children School.",
      );

      if (Array.isArray(initialData.leaders) && initialData.leaders.length > 0) {
        setLeaders(
          initialData.leaders.map((l: any) => ({
            name: l.name ?? "",
            role: l.role ?? "",
            quote: l.quote ?? "",
            bio: l.bio ?? "",
            image: l.image ?? "",
          })),
        );
      } else {
        setLeaders([
          {
            name: initialData.founderName ?? "Late Shri Vijay Shankar Yadav",
            role: initialData.founderTitle ?? "Founder & Visionary",
            quote:
              initialData.founderQuote ??
              "Education is the only wealth that grows when shared and can never be taken away.",
            bio:
              initialData.founderBio ??
              "A passionate educator who dedicated his entire life to building accessible, value-based learning institutions across eastern Uttar Pradesh.",
            image:
              initialData.founderImage ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170014/lfcs-school/founder_1793170013955.webp",
          },
          {
            name: initialData.directorName ?? "Shri Vivek Yadav",
            role: initialData.directorTitle ?? "Managing Director",
            quote:
              initialData.directorQuote ??
              "Our mission is to prepare every student not merely for examinations, but for life.",
            bio:
              initialData.directorBio ??
              "Steering LFCS into the future with modern pedagogy, digital classrooms, comprehensive athletic programs, and expansive campus infrastructure.",
            image:
              initialData.directorImage ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170014/lfcs-school/director_1793170014631.webp",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddLeader = () => {
    setLeaders((prev) => [
      ...prev,
      {
        name: "",
        role: "",
        quote: "",
        bio: "",
        image: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, leaders.length]);
  };

  const handleRemoveLeader = (index: number) => {
    setLeaders((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateLeader = (index: number, field: keyof LeaderProfile, val: string) => {
    setLeaders((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "LeadershipSection",
        content: {
          tagline,
          headline,
          subtitle,
          leaders,
        },
      };

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Leadership section saved successfully!");
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
        title="6. Leadership & Management Profiles"
        description="Profiles of institutional leadership with quotes, photos, and biographies."
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
              placeholder="e.g. Eyebrow badge (e.g. LEADERSHIP)"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Section title (e.g. Guiding the Institution)"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Introductory summary of management philosophy..."
          />

          {/* DYNAMIC LEADERS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Leadership Profiles ({leaders.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Founders, directors, and institutional leaders. Can add more than 2 profiles.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openIndices.length === leaders.length) {
                      setOpenIndices([]);
                    } else {
                      setOpenIndices(leaders.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {openIndices.length === leaders.length ? "Collapse All" : "Expand All"}
                </button>
                <button
                  type="button"
                  onClick={handleAddLeader}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Leader</span>
                </button>
              </div>
            </div>

            {leaders.length === 0 ? (
              <div
                onClick={handleAddLeader}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No leadership profiles added yet. Click to add your first leader.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {leaders.map((leader, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Leader ${idx + 1}: ${leader.name || "Untitled Profile"}`}
                    subtitle={leader.role}
                    thumbnail={leader.image}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveLeader(idx)}
                    deleteTitle="Delete Profile"
                  >
                    {/* Row 1: Name and Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Leader Name"
                        value={leader.name}
                        onChange={(e) => handleUpdateLeader(idx, "name", e.target.value)}
                        placeholder="e.g. Late Shri Vijay Shankar Yadav"
                      />
                      <InputField
                        label="Title / Role"
                        value={leader.role}
                        onChange={(e) => handleUpdateLeader(idx, "role", e.target.value)}
                        placeholder="e.g. Founder & Visionary"
                      />
                    </div>

                    {/* Row 2: Quote */}
                    <TextAreaField
                      label="Visionary Quote"
                      value={leader.quote}
                      onChange={(e) => handleUpdateLeader(idx, "quote", e.target.value)}
                      rows={2}
                      placeholder="e.g. Core educational aphorism or motto..."
                    />

                    {/* Row 3: Biography */}
                    <TextAreaField
                      label="Biography"
                      value={leader.bio}
                      onChange={(e) => handleUpdateLeader(idx, "bio", e.target.value)}
                      rows={3}
                      placeholder="e.g. Biographical sketch and initiatives..."
                    />

                    {/* Row 4: Image (full width) */}
                    <ImagePickerField
                      label="Portrait Photo"
                      value={leader.image}
                      onChange={(url) => handleUpdateLeader(idx, "image", url)}
                      placeholder="e.g. Cloudinary portrait photo URL"
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
