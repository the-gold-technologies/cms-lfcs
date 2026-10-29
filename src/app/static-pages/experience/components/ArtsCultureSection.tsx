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

export interface CreativeActivity {
  title: string;
}

export function ArtsCultureSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [activitiesTitle, setActivitiesTitle] = useState("");
  const [calloutText, setCalloutText] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");

  const [activities, setActivities] = useState<CreativeActivity[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");
      setActivitiesTitle(initialData.activitiesTitle ?? "");
      setCalloutText(initialData.calloutText ?? "");
      setImage1(initialData.image1 ?? "");
      setImage2(initialData.image2 ?? "");

      if (Array.isArray(initialData.activities)) {
        setActivities(
          initialData.activities.map((a: any) => ({
            title: typeof a === "string" ? a : (a.title ?? a.name ?? ""),
          })),
        );
      } else {
        setActivities([]);
      }
    }
  }, [initialData]);

  const handleAddActivity = () => {
    setActivities((prev) => [...prev, { title: "" }]);
    setOpenIndices((prev) => [...prev, activities.length]);
  };

  const handleRemoveActivity = (index: number) => {
    setActivities((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateActivity = (index: number, val: string) => {
    setActivities((prev) => {
      const copy = [...prev];
      copy[index] = { title: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "ArtsCultureSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          activitiesTitle,
          calloutText,
          activities,
          image1,
          image2,
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
        toast.success("Arts & Culture section saved successfully!");
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
        title="4. Arts, Culture & Creativity"
        description="Showcase fine arts studios, music concerts, classical dance, and annual cultural celebrations."
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
              placeholder="e.g. Arts, Culture & Creativity"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. A Place to Create &"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Express"
            />
          </div>

          <TextAreaField
            label="Section Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. At LFCS, we provide students with an opportunity to explore their creative interests..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Activities Box Title"
              value={activitiesTitle}
              onChange={(e) => setActivitiesTitle(e.target.value)}
              placeholder="e.g. Creative & Cultural Activities"
            />
            <InputField
              label="Callout Badge Banner Text"
              value={calloutText}
              onChange={(e) => setCalloutText(e.target.value)}
              placeholder="e.g. Creativity, expression, & culture"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImagePickerField
              label="Arts Photo 1 (Craft / Painting)"
              value={image1}
              onChange={(url) => setImage1(url)}
              placeholder="e.g. Cloudinary image URL"
              folder="lfcs-school/experience"
            />
            <ImagePickerField
              label="Arts Photo 2 (Cultural Performance)"
              value={image2}
              onChange={(url) => setImage2(url)}
              placeholder="e.g. Cloudinary image URL"
              folder="lfcs-school/experience"
            />
          </div>

          {/* DYNAMIC ARTS ACTIVITIES */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Creative & Cultural Activities ({activities.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Activities displayed in the arts checklist (e.g. Music, Dance, Art & Craft).
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddActivity}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0E5A60] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Activity</span>
              </button>
            </div>

            {activities.length === 0 ? (
              <div
                onClick={handleAddActivity}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#0E5A60] hover:text-[#0E5A60] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No activities added yet. Click to add your first creative activity.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((act, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Activity ${idx + 1}: ${act.title || "Untitled Activity"}`}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveActivity(idx)}
                    deleteTitle="Delete Activity"
                  >
                    <InputField
                      label="Activity Title"
                      value={act.title}
                      onChange={(e) => handleUpdateActivity(idx, e.target.value)}
                      placeholder="e.g. Art & Craft"
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
