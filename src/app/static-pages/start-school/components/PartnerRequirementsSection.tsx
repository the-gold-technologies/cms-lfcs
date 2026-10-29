"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";

export interface PartnerProfileItem {
  title: string;
  desc: string;
  color?: string;
}

export interface EligibilityCriterion {
  title: string;
}

export function PartnerRequirementsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [eligibilityTitle, setEligibilityTitle] = useState("");
  const [eligibilityNote, setEligibilityNote] = useState("");

  const [profile, setProfile] = useState<PartnerProfileItem[]>([]);
  const [criteria, setCriteria] = useState<EligibilityCriterion[]>([]);
  const [openProfileIndices, setOpenProfileIndices] = useState<number[]>([0]);
  const [openCriteriaIndices, setOpenCriteriaIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");
      setEligibilityTitle(initialData.eligibilityTitle ?? "");
      setEligibilityNote(initialData.eligibilityNote ?? "");

      const pList = Array.isArray(initialData.profile)
        ? initialData.profile
        : Array.isArray(initialData.requirements)
          ? initialData.requirements
          : null;

      if (pList) {
        setProfile(
          pList.map((p: any) => ({
            title: p.title ?? "",
            desc: p.desc ?? p.description ?? "",
            color: p.color ?? "",
          })),
        );
      } else {
        setProfile([]);
      }

      const cList = Array.isArray(initialData.criteria)
        ? initialData.criteria
        : Array.isArray(initialData.eligibilityPending)
          ? initialData.eligibilityPending
          : null;

      if (cList) {
        setCriteria(
          cList.map((c: any) => ({
            title: typeof c === "string" ? c : (c.title ?? c.name ?? ""),
          })),
        );
      } else {
        setCriteria([]);
      }
    }
  }, [initialData]);

  const handleAddProfile = () => {
    setProfile((prev) => [...prev, { title: "", desc: "", color: "" }]);
    setOpenProfileIndices((prev) => [...prev, profile.length]);
  };

  const handleRemoveProfile = (index: number) => {
    setProfile((prev) => prev.filter((_, i) => i !== index));
    setOpenProfileIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateProfile = (
    index: number,
    field: keyof PartnerProfileItem,
    value: string,
  ) => {
    setProfile((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddCriterion = () => {
    setCriteria((prev) => [...prev, { title: "" }]);
    setOpenCriteriaIndices((prev) => [...prev, criteria.length]);
  };

  const handleRemoveCriterion = (index: number) => {
    setCriteria((prev) => prev.filter((_, i) => i !== index));
    setOpenCriteriaIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateCriterion = (index: number, value: string) => {
    setCriteria((prev) => {
      const copy = [...prev];
      copy[index] = { title: value };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "PartnerRequirementsSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          eligibilityTitle,
          eligibilityNote,
          profile,
          criteria,
        },
      };

      const res = await fetch("/api/start-school", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Partner Requirements section saved successfully!");
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
        title="5. Partner Eligibility & Requirements"
        description="Profile qualities and specific compliance requirements expected from educational partners."
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
              placeholder="e.g. Partner Requirements"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Who Can Explore an"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. LFCS Partnership?"
            />
          </div>

          <TextAreaField
            label="Section Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. We welcome enquiries from individuals and organisations who share an interest in education..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Eligibility Box Title"
              value={eligibilityTitle}
              onChange={(e) => setEligibilityTitle(e.target.value)}
              placeholder="e.g. Partner Eligibility"
            />
            <InputField
              label="Indicative Disclaimer Note"
              value={eligibilityNote}
              onChange={(e) => setEligibilityNote(e.target.value)}
              placeholder="e.g. * These eligibility criteria are indicative..."
            />
          </div>

          {/* DYNAMIC PARTNER PROFILE PILLARS */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Partner Profile Qualities ({profile.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Core competencies looked for in candidates (e.g. Management Capability, Long-Term Commitment).
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddProfile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0E5A60] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Quality</span>
              </button>
            </div>

            {profile.length === 0 ? (
              <div
                onClick={handleAddProfile}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#0E5A60] hover:text-[#0E5A60] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No qualities added yet. Click to add your first profile requirement.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.map((p, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Quality ${idx + 1}: ${p.title || "Untitled Quality"}`}
                    isOpen={openProfileIndices.includes(idx)}
                    onToggle={() =>
                      setOpenProfileIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveProfile(idx)}
                    deleteTitle="Delete Quality"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InputField
                        label="Quality Title"
                        value={p.title}
                        onChange={(e) => handleUpdateProfile(idx, "title", e.target.value)}
                        placeholder="e.g. Management Capability"
                      />
                      <InputField
                        label="Accent Color Hex (Optional)"
                        value={p.color ?? ""}
                        onChange={(e) => handleUpdateProfile(idx, "color", e.target.value)}
                        placeholder="e.g. #66733a"
                      />
                    </div>

                    <TextAreaField
                      label="Description"
                      value={p.desc}
                      onChange={(e) => handleUpdateProfile(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. The ability to manage or arrange the resources required..."
                    />
                  </CollapsibleCard>
                ))}
              </div>
            )}
          </div>

          {/* DYNAMIC ELIGIBILITY CRITERIA CHECKLIST */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Eligibility Criteria Items ({criteria.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Checklist points displayed in the eligibility box.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCriterion}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0E5A60] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Criterion</span>
              </button>
            </div>

            {criteria.length === 0 ? (
              <div
                onClick={handleAddCriterion}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#0E5A60] hover:text-[#0E5A60] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No criteria added yet. Click to add your first criterion.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {criteria.map((c, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Criterion ${idx + 1}: ${c.title || "Untitled Criterion"}`}
                    isOpen={openCriteriaIndices.includes(idx)}
                    onToggle={() =>
                      setOpenCriteriaIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveCriterion(idx)}
                    deleteTitle="Delete Criterion"
                  >
                    <InputField
                      label="Criterion Requirement"
                      value={c.title}
                      onChange={(e) => handleUpdateCriterion(idx, e.target.value)}
                      placeholder="e.g. Minimum land requirement"
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
