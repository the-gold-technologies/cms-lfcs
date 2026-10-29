"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function VisionMissionSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [visionTitle, setVisionTitle] = useState("");
  const [visionDesc, setVisionDesc] = useState("");
  const [missionTitle, setMissionTitle] = useState("");
  const [missionDesc, setMissionDesc] = useState("");

  useEffect(() => {
    if (initialData) {
      setVisionTitle(initialData.visionTitle ?? "");
      setVisionDesc(initialData.visionDesc ?? "");
      setMissionTitle(initialData.missionTitle ?? "");
      setMissionDesc(initialData.missionDesc ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "VisionMissionSection",
        content: {
          visionTitle,
          visionDesc,
          missionTitle,
          missionDesc,
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
        toast.success("Vision & Mission section saved successfully!");
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
        title="4. Vision & Mission Cards"
        description="Dual signature cards defining Little Flower's forward-looking institutional vision and grounded everyday mission."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision Card */}
            <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Vision Statement (Olive Card)
              </h4>
              <InputField
                label="Card Title"
                value={visionTitle}
                onChange={(e) => setVisionTitle(e.target.value)}
                placeholder="e.g. Our Vision"
              />
              <TextAreaField
                label="Vision Description"
                value={visionDesc}
                onChange={(e) => setVisionDesc(e.target.value)}
                rows={4}
                placeholder="e.g. State the institutional vision..."
              />
            </div>

            {/* Mission Card */}
            <div className="p-5 bg-pink-50/40 rounded-2xl border border-pink-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-800">
                Mission Statement (Pink Card)
              </h4>
              <InputField
                label="Card Title"
                value={missionTitle}
                onChange={(e) => setMissionTitle(e.target.value)}
                placeholder="e.g. Our Mission"
              />
              <TextAreaField
                label="Mission Description"
                value={missionDesc}
                onChange={(e) => setMissionDesc(e.target.value)}
                rows={4}
                placeholder="e.g. State the institutional mission..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
