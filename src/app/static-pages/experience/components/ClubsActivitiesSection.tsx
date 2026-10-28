"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface ClubItem {
  name: string;
}

export function ClubsActivitiesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");

  const [clubs, setClubs] = useState<ClubItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "CLUBS & SOCIETIES");
      setHeadline(initialData.headline ?? "Student Clubs & Active Co-Curriculars");
      setDescription(
        initialData.description ??
          "Student-led clubs encourage teamwork, passion exploration, and leadership outside standard periods.",
      );

      if (Array.isArray(initialData.clubs) && initialData.clubs.length > 0) {
        setClubs(
          initialData.clubs.map((c: any) => ({
            name: typeof c === "string" ? c : (c.name ?? ""),
          })),
        );
      } else {
        setClubs([
          { name: initialData.c1Name ?? "Academic Competitions & Olympiads" },
          { name: initialData.c2Name ?? "Quiz & General Knowledge Club" },
          { name: initialData.c3Name ?? "Technology & STEM Coding Lab" },
          { name: initialData.c4Name ?? "Debate & Model United Nations" },
          { name: initialData.c5Name ?? "Literary & Creative Writing Guild" },
          { name: initialData.c6Name ?? "Fine Arts & Craft Studio" },
        ]);
      }
    }
  }, [initialData]);

  const handleAddClub = () => {
    setClubs((prev) => [...prev, { name: "" }]);
  };

  const handleRemoveClub = (index: number) => {
    setClubs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateClub = (index: number, val: string) => {
    setClubs((prev) => {
      const copy = [...prev];
      copy[index] = { name: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "ClubsActivitiesSection",
        content: {
          tagline,
          headline,
          description,
          clubs,
        },
      };

      const res = await fetch("/api/experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Clubs & Activities section saved successfully!");
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
        title="5. Student Clubs & Societies"
        description="Co-curricular student interest clubs fostering innovation, debate, and creativity."
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
              placeholder="e.g. CLUBS & SOCIETIES"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Student Clubs & Active Co-Curriculars"
            />
          </div>

          <TextAreaField
            label="Section Narrative"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. Club participation narrative..."
          />

          {/* DYNAMIC CLUBS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Active Student Clubs ({clubs.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Co-curricular clubs and activity societies. Can add more than 6 clubs.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddClub}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Club</span>
              </button>
            </div>

            {clubs.length === 0 ? (
              <div
                onClick={handleAddClub}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No clubs added yet. Click to add your first student club.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {clubs.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center gap-2 relative transition-all group"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black text-[#0E5A60] shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => handleUpdateClub(idx, e.target.value)}
                        placeholder={`Club #${idx + 1} Name`}
                        className="w-full text-xs font-semibold text-gray-800 bg-transparent border-none outline-none focus:ring-0 placeholder:text-gray-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveClub(idx)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                      title="Delete Club"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
