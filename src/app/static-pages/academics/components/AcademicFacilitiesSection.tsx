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

export interface FacilityCard {
  title: string;
  description: string;
  image: string;
}

export function AcademicFacilitiesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [facilities, setFacilities] = useState<FacilityCard[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle(initialData.subtitle ?? "");

      if (Array.isArray(initialData.facilities)) {
        setFacilities(
          initialData.facilities.map((f: any) => ({
            title: f.title ?? "",
            description: f.description ?? f.desc ?? "",
            image: f.image ?? "",
          })),
        );
      } else {
        setFacilities([]);
      }
    }
  }, [initialData]);

  const handleAddFacility = () => {
    setFacilities((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        image: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, facilities.length]);
  };

  const handleRemoveFacility = (index: number) => {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateFacility = (
    index: number,
    field: keyof FacilityCard,
    value: string,
  ) => {
    setFacilities((prev) => {
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
        section: "AcademicFacilitiesSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          facilities,
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
        toast.success("Academic Facilities section saved successfully!");
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
        title="7. Academic Facilities & Modern Infrastructure"
        description="Showcase smart classrooms, specialized science labs, computer labs, knowledge library, and more."
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
              placeholder="e.g. INFRASTRUCTURE"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Academic"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Facilities"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. At LFCS, the academic facilities are curated to complement classroom learning..."
          />

          {/* DYNAMIC FACILITIES LIST */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Campus Facilities ({facilities.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Manage facility items displayed in the infrastructure showcase.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFacility}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0E5A60] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Facility</span>
              </button>
            </div>

            {facilities.length === 0 ? (
              <div
                onClick={handleAddFacility}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#0E5A60] hover:text-[#0E5A60] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No facilities added yet. Click to add the first facility.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {facilities.map((fac, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Facility ${idx + 1}: ${fac.title || "Untitled Facility"}`}
                    thumbnail={fac.image}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveFacility(idx)}
                    deleteTitle="Delete Facility"
                  >
                    <InputField
                      label="Facility Title"
                      value={fac.title}
                      onChange={(e) => handleUpdateFacility(idx, "title", e.target.value)}
                      placeholder="e.g. Smart / Digital Classrooms"
                    />

                    <TextAreaField
                      label="Facility Description"
                      value={fac.description}
                      onChange={(e) => handleUpdateFacility(idx, "description", e.target.value)}
                      rows={2}
                      placeholder="e.g. Technology-enabled resources that support classroom instruction..."
                    />

                    <ImagePickerField
                      label="Facility Photo"
                      value={fac.image}
                      onChange={(url) => handleUpdateFacility(idx, "image", url)}
                      placeholder="e.g. Cloudinary image URL"
                      folder="lfcs-school/academics"
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
