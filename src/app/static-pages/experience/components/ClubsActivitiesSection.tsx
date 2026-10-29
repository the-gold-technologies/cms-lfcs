"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleCard } from "@/components/CollapsibleCard";

export interface ClubCard {
  name: string;
  image: string;
  bg?: string;
}

export function ClubsActivitiesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [clientNote, setClientNote] = useState("");

  const [clubs, setClubs] = useState<ClubCard[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");
      setClientNote(initialData.clientNote ?? "");

      if (Array.isArray(initialData.clubs)) {
        setClubs(
          initialData.clubs.map((c: any) => ({
            name: c.name ?? c.title ?? "",
            image: c.image ?? "",
            bg: c.bg ?? "",
          })),
        );
      } else {
        setClubs([]);
      }
    }
  }, [initialData]);

  const handleAddClub = () => {
    setClubs((prev) => [...prev, { name: "", image: "", bg: "" }]);
    setOpenIndices((prev) => [...prev, clubs.length]);
  };

  const handleRemoveClub = (index: number) => {
    setClubs((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
  };

  const handleUpdateClub = (index: number, field: keyof ClubCard, value: string) => {
    setClubs((prev) => {
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
        section: "ClubsActivitiesSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          clientNote,
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
        title="5. Clubs, Societies & Co-Curriculars"
        description="Showcase student-led interest clubs, STEM societies, debate teams, and cultural troupes."
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
              placeholder="e.g. Clubs & Activities"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Discover an Interest. Practice it Further."
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Discover"
            />
          </div>

          <TextAreaField
            label="Section Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. At LFCS, we introduce our students to various cultural to sports activities..."
          />

          <InputField
            label="Campus Disclaimer Note"
            value={clientNote}
            onChange={(e) => setClientNote(e.target.value)}
            placeholder="e.g. * Specific club names and enrollment options vary by campus..."
          />

          {/* DYNAMIC CLUBS LIST */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Student Clubs & Activities ({clubs.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Manage club names, illustrations, and badge accent styles.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddClub}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#842b46] bg-[#842b46]/10 hover:bg-[#842b46]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Club</span>
              </button>
            </div>

            {clubs.length === 0 ? (
              <div
                onClick={handleAddClub}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#842b46] hover:text-[#842b46] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No clubs added yet. Click to add the first club card.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {clubs.map((club, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Club ${idx + 1}: ${club.name || "Untitled Club"}`}
                    thumbnail={club.image}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveClub(idx)}
                    deleteTitle="Delete Club"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InputField
                        label="Club Name"
                        value={club.name}
                        onChange={(e) => handleUpdateClub(idx, "name", e.target.value)}
                        placeholder="e.g. Academic competitions"
                      />
                      <InputField
                        label="Badge Color Hex (Optional)"
                        value={club.bg ?? ""}
                        onChange={(e) => handleUpdateClub(idx, "bg", e.target.value)}
                        placeholder="e.g. #e5a024"
                      />
                    </div>

                    <ImagePickerField
                      label="Club Illustration Photo"
                      value={club.image}
                      onChange={(url) => handleUpdateClub(idx, "image", url)}
                      placeholder="e.g. Cloudinary image URL"
                      folder="lfcs-school/experience"
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
