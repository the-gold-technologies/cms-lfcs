"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";

export interface SetupStep {
  n?: string;
  title: string;
  desc: string;
}

export function SetupProcessSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");

  const [steps, setSteps] = useState<SetupStep[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");

      if (Array.isArray(initialData.steps)) {
        setSteps(
          initialData.steps.map((s: any, idx: number) => ({
            n: s.n ?? String(idx + 1).padStart(2, "0"),
            title: s.title ?? "",
            desc: s.desc ?? s.description ?? "",
          })),
        );
      } else {
        setSteps([]);
      }
    }
  }, [initialData]);

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        n: String(prev.length + 1).padStart(2, "0"),
        title: "",
        desc: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, steps.length]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateStep = (
    index: number,
    field: keyof SetupStep,
    value: string,
  ) => {
    setSteps((prev) => {
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
        section: "SetupProcessSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
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
        toast.success("Setup Process section saved successfully!");
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
        title="6. 8-Step School Setup Process Roadmap"
        description="Chronological milestones from initial feasibility to campus inauguration."
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
              placeholder="e.g. School Setup Process"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. From Planning to"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. School Opening"
            />
          </div>

          <TextAreaField
            label="Section Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. Establishing a school requires coordinated planning across infrastructure, academic preparation..."
          />

          {/* DYNAMIC SETUP STEPS */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Setup Process Steps ({steps.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Ordered milestones shown in the setup process timeline.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddStep}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0E5A60] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            {steps.length === 0 ? (
              <div
                onClick={handleAddStep}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#0E5A60] hover:text-[#0E5A60] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No setup steps added yet. Click to add your first roadmap step.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Step ${step.n || idx + 1}: ${step.title || "Untitled Step"}`}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveStep(idx)}
                    deleteTitle="Delete Step"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <InputField
                        label="Step Number"
                        value={step.n ?? ""}
                        onChange={(e) => handleUpdateStep(idx, "n", e.target.value)}
                        placeholder="e.g. 01"
                      />
                      <div className="sm:col-span-3">
                        <InputField
                          label="Step Title"
                          value={step.title}
                          onChange={(e) => handleUpdateStep(idx, "title", e.target.value)}
                          placeholder="e.g. Initial Enquiry"
                        />
                      </div>
                    </div>

                    <TextAreaField
                      label="Step Description"
                      value={step.desc}
                      onChange={(e) => handleUpdateStep(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Share your interest in establishing an LFCS school..."
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
