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
  quote?: string;
  bio?: string;
  image: string;
}

export function LeadershipSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [leaders, setLeaders] = useState<LeaderProfile[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle(initialData.subtitle ?? "");

      if (Array.isArray(initialData.leaders)) {
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
        setLeaders([]);
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
    setOpenIndices((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
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
    setSaved(false);
    try {
      const payload = {
        section: "LeadershipSection",
        content: {
          tagline,
          headline,
          scriptAccent,
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
        description="Profiles of the Founder, Chairman, Advisors, and Key Institutional Leaders with portrait photography and vision messages."
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
              placeholder="e.g. Leadership / Management"
            />
            <InputField
              label="Main Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Guiding the"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Institution"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Little Flower's growth has been guided by a management committed to building an institution..."
          />

          {/* DYNAMIC LEADERS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Leadership Profiles ({leaders.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Institutional leaders, founder tribute, chairman message, and education partners.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddLeader}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#842b46] hover:text-[#0a192f] bg-[#842b46]/10 hover:bg-[#842b46]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Leader</span>
              </button>
            </div>

            {leaders.length === 0 ? (
              <div
                onClick={handleAddLeader}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No leaders added yet. Click to add your first leader.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {leaders.map((leader, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={leader.name ? `${leader.name} (${leader.role})` : `Leader ${idx + 1}`}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveLeader(idx)}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Full Name"
                        value={leader.name}
                        onChange={(e) => handleUpdateLeader(idx, "name", e.target.value)}
                        placeholder="e.g. Late Vijay Shankar Yadav Ji"
                      />
                      <InputField
                        label="Role / Designation"
                        value={leader.role}
                        onChange={(e) => handleUpdateLeader(idx, "role", e.target.value)}
                        placeholder="e.g. Founder & Visionary"
                      />
                    </div>

                    <TextAreaField
                      label="Headline / Signature Quote"
                      value={leader.quote || ""}
                      onChange={(e) => handleUpdateLeader(idx, "quote", e.target.value)}
                      rows={2}
                      placeholder="e.g. Foundation of Little Flower's educational journey..."
                    />

                    <TextAreaField
                      label="Biography / Extended Message"
                      value={leader.bio || ""}
                      onChange={(e) => handleUpdateLeader(idx, "bio", e.target.value)}
                      rows={4}
                      placeholder="e.g. Detailed institutional statement or biographical milestones..."
                    />

                    <ImagePickerField
                      label="Leader Portrait / Photo"
                      value={leader.image}
                      onChange={(url) => handleUpdateLeader(idx, "image", url)}
                      folder="lfcs-school/about"
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
