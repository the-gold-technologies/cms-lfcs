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

export interface SportActivity {
  title: string;
}

export function SportsFitnessSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [calloutText, setCalloutText] = useState("");
  const [activitiesTitle, setActivitiesTitle] = useState("");
  const [clientNote, setClientNote] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");

  const [activities, setActivities] = useState<SportActivity[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");
      setCalloutText(initialData.calloutText ?? "");
      setActivitiesTitle(initialData.activitiesTitle ?? "");
      setClientNote(initialData.clientNote ?? "");
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
    setOpenIndices((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
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
        section: "SportsFitnessSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          calloutText,
          activitiesTitle,
          clientNote,
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
        toast.success("Sports & Fitness section saved successfully!");
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
        title="3. Sports, Athletics & Fitness"
        description="Showcase outdoor sports complexes, swimming pools, athletic meets, and physical education."
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
              placeholder="e.g. Sports & Fitness"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. An Active School Life"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Active"
            />
          </div>

          <TextAreaField
            label="Section Description (Paragraphs separated by blank lines)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="e.g. Sports and physical activities are an important part of student life at LFCS..."
          />

          <InputField
            label="Activities List Heading"
            value={activitiesTitle}
            onChange={(e) => setActivitiesTitle(e.target.value)}
            placeholder="e.g. Games & Fitness Programmes"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Callout Badge Banner Text"
              value={calloutText}
              onChange={(e) => setCalloutText(e.target.value)}
              placeholder="e.g. Teamwork, discipline, & fair play"
            />
            <InputField
              label="Campus Availability Note"
              value={clientNote}
              onChange={(e) => setClientNote(e.target.value)}
              placeholder="e.g. * Note: Available sports vary by branch..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImagePickerField
              label="Sports Photo 1 (Swimming / Field)"
              value={image1}
              onChange={(url) => setImage1(url)}
              placeholder="e.g. Cloudinary image URL"
              folder="lfcs-school/experience"
            />
            <ImagePickerField
              label="Sports Photo 2 (Outdoor Sports)"
              value={image2}
              onChange={(url) => setImage2(url)}
              placeholder="e.g. Cloudinary image URL"
              folder="lfcs-school/experience"
            />
          </div>

          {/* DYNAMIC SPORTS ACTIVITIES */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Sports & Physical Activities ({activities.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Sport types, athletics, and competitions listed in the activities card.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddActivity}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#842b46] bg-[#842b46]/10 hover:bg-[#842b46]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Activity</span>
              </button>
            </div>

            {activities.length === 0 ? (
              <div
                onClick={handleAddActivity}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#842b46] hover:text-[#842b46] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No activities added yet. Click to add the first activity.</span>
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
                      label="Sport / Activity Name"
                      value={act.title}
                      onChange={(e) => handleUpdateActivity(idx, e.target.value)}
                      placeholder="e.g. Outdoor sports"
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
