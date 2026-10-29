"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Mail, ArrowRight, Plus } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleCard } from "@/components/CollapsibleCard";

export interface EnquiryStep {
  title: string;
  text: string;
}

export function AdmissionEnquiryFormSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");

  const [steps, setSteps] = useState<EnquiryStep[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");

      if (Array.isArray(initialData.steps)) {
        setSteps(
          initialData.steps.map((s: any) => ({
            title: s.title ?? "",
            text: s.text ?? s.desc ?? "",
          })),
        );
      } else {
        setSteps([]);
      }
    }
  }, [initialData]);

  const handleAddStep = () => {
    setSteps((prev) => [...prev, { title: "", text: "" }]);
    setOpenIndices((prev) => [...prev, steps.length]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateStep = (index: number, field: keyof EnquiryStep, value: string) => {
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
        section: "AdmissionEnquiryFormSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          steps,
        },
      };

      const res = await fetch("/api/admissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Admission Enquiry section saved successfully!");
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
        title="4. Admission Enquiry Form & Guidance Steps"
        description="Sidebar guidance steps and banner text for the parent enquiry form. Form leads are managed in the Submissions module."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          {/* Submissions module notice banner */}
          <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0E5A60] text-white">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Admission Submissions Inbox</p>
                <p className="text-[11px] text-gray-500">
                  Parent inquiries submitted via this form are collected in the dedicated Admissions Submissions module.
                </p>
              </div>
            </div>
            <Link
              href="/submissions/admissions"
              className="px-4 py-2 bg-white text-[#0E5A60] text-xs font-bold rounded-xl border border-teal-200 hover:bg-teal-50 transition-all flex items-center gap-1.5"
            >
              View Inquiries <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Pre-Heading Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Admission Enquiry"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Let's Help You Get"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Started"
            />
          </div>

          <TextAreaField
            label="Section Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. Interested in admissions at Little Flower Group of Schools? Share a few details..."
          />

          {/* DYNAMIC GUIDANCE STEPS */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Enquiry Guidance Steps ({steps.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Step-by-step guidance list displayed next to the inquiry form.
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
                <span>No guidance steps added yet. Click to add the first step.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Step ${idx + 1}: ${step.title || "Untitled Step"}`}
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
                      label="Step Title"
                      value={step.title}
                      onChange={(e) => handleUpdateStep(idx, "title", e.target.value)}
                      placeholder="e.g. Share a few details"
                    />

                    <TextAreaField
                      label="Step Description"
                      value={step.text}
                      onChange={(e) => handleUpdateStep(idx, "text", e.target.value)}
                      rows={2}
                      placeholder="e.g. Tell us about your child and the class you are looking for."
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

