"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { Plus } from "lucide-react";

export interface RoadmapStep {
  title: string;
  desc?: string;
}

export function SetupProcessSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "SCHOOL SETUP ROADMAP");
      setHeadline(initialData.headline ?? "From Initial Planning to");
      setScriptAccent(initialData.scriptAccent ?? "Grand Opening");
      setSubtitle(
        initialData.subtitle ??
          "Establishing a CBSE school requires disciplined milestone planning. Our structured 8-step roadmap guides your project smoothly from proposal to student admissions.",
      );

      if (Array.isArray(initialData.steps) && initialData.steps.length > 0) {
        setSteps(
          initialData.steps.map((s: any) =>
            typeof s === "string"
              ? { title: s, desc: "" }
              : { title: s.title ?? "", desc: s.desc ?? "" },
          ),
        );
      } else {
        setSteps([
          { title: initialData.step1 ?? "Initial Enquiry & Location Feasibility" },
          { title: initialData.step2 ?? "Leadership Evaluation & Preliminary Discussions" },
          { title: initialData.step3 ?? "Site Survey & Infrastructure Blueprints" },
          { title: initialData.step4 ?? "Associate Agreement & Territory Finalisation" },
          { title: initialData.step5 ?? "Campus Civil Construction & Lab Setup" },
          { title: initialData.step6 ?? "Principal & Faculty Recruitment & Training" },
          { title: initialData.step7 ?? "Admissions Campaign Launch & School Readiness Audit" },
          { title: initialData.step8 ?? "Inaugural Opening & Commencement of Classes" },
        ]);
      }
    }
  }, [initialData]);

  const handleAddStep = () => {
    setSteps((prev) => [...prev, { title: "", desc: "" }]);
    setOpenIndices((prev) => [...prev, steps.length]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateStep = (index: number, value: string) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], title: value };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "SetupProcessSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          steps,
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
        toast.success("Setup roadmap saved successfully!");
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
        title="6. School Setup Roadmap & Process Timeline"
        description="Structured setup process from location feasibility survey to campus construction and inaugural admissions."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Eyebrow Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. SCHOOL SETUP ROADMAP"
            />
            <InputField
              label="Heading Lead"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. From Initial Planning to"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Grand Opening"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Establishing a CBSE school requires disciplined milestone planning..."
          />

          {/* DYNAMIC STEPS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Roadmap Milestone Steps ({steps.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Sequential phases guiding partners to successful launch. Can add or reorder steps.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openIndices.length === steps.length) {
                      setOpenIndices([]);
                    } else {
                      setOpenIndices(steps.map((_, i) => i));
                    }
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {openIndices.length === steps.length ? "Collapse All" : "Expand All"}
                </button>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>
            </div>

            {steps.length === 0 ? (
              <div
                onClick={handleAddStep}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No steps added yet. Click to add your first roadmap milestone.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((st, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={st.title || `Step ${idx < 9 ? `0${idx + 1}` : idx + 1}`}
                    badge={`Step ${idx + 1}`}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveStep(idx)}
                    deleteTitle="Delete Step"
                  >
                    <InputField
                      label="Step Title & Details"
                      value={st.title}
                      onChange={(e) => handleUpdateStep(idx, e.target.value)}
                      placeholder="e.g. Initial Enquiry & Location Feasibility"
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
