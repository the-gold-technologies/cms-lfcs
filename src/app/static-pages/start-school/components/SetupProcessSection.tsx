"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function SetupProcessSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [step1, setStep1] = useState("");
  const [step2, setStep2] = useState("");
  const [step3, setStep3] = useState("");
  const [step4, setStep4] = useState("");
  const [step5, setStep5] = useState("");
  const [step6, setStep6] = useState("");
  const [step7, setStep7] = useState("");
  const [step8, setStep8] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "SCHOOL SETUP ROADMAP");
      setHeadline(initialData.headline ?? "From Initial Planning to");
      setScriptAccent(initialData.scriptAccent ?? "Grand Opening");
      setSubtitle(
        initialData.subtitle ??
          "Establishing a CBSE school requires disciplined milestone planning. Our structured 8-step roadmap guides your project smoothly from proposal to student admissions.",
      );

      setStep1(initialData.step1 ?? "01. Initial Enquiry & Location Feasibility");
      setStep2(initialData.step2 ?? "02. Leadership Evaluation & Preliminary Discussions");
      setStep3(initialData.step3 ?? "03. Site Survey & Infrastructure Blueprints");
      setStep4(initialData.step4 ?? "04. Associate Agreement & Territory Finalisation");
      setStep5(initialData.step5 ?? "05. Campus Civil Construction & Lab Setup");
      setStep6(initialData.step6 ?? "06. Principal & Faculty Recruitment & Training");
      setStep7(initialData.step7 ?? "07. Admissions Campaign Launch & School Readiness Audit");
      setStep8(initialData.step8 ?? "08. Inaugural Opening & Commencement of Classes");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "SetupProcessSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          step1,
          step2,
          step3,
          step4,
          step5,
          step6,
          step7,
          step8,
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
        toast.success("Setup Roadmap saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save roadmap");
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
        title="6. 8-Step School Setup Roadmap"
        description="The sequential roadmap from initial location enquiry to grand opening and inaugural class commencement."
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
              label="Headline Lead"
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
            placeholder="e.g. Overview of chronological timeline..."
          />

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              8 Roadmap Milestones
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Step 1"
                value={step1}
                onChange={(e) => setStep1(e.target.value)}
                placeholder="e.g. 01. Initial Enquiry & Location Feasibility"
              />
              <InputField
                label="Step 2"
                value={step2}
                onChange={(e) => setStep2(e.target.value)}
                placeholder="e.g. 02. Leadership Evaluation & Discussions"
              />
              <InputField
                label="Step 3"
                value={step3}
                onChange={(e) => setStep3(e.target.value)}
                placeholder="e.g. 03. Site Survey & Blueprints"
              />
              <InputField
                label="Step 4"
                value={step4}
                onChange={(e) => setStep4(e.target.value)}
                placeholder="e.g. 04. Agreement & Finalisation"
              />
              <InputField
                label="Step 5"
                value={step5}
                onChange={(e) => setStep5(e.target.value)}
                placeholder="e.g. 05. Civil Construction & Lab Setup"
              />
              <InputField
                label="Step 6"
                value={step6}
                onChange={(e) => setStep6(e.target.value)}
                placeholder="e.g. 06. Faculty Recruitment & Training"
              />
              <InputField
                label="Step 7"
                value={step7}
                onChange={(e) => setStep7(e.target.value)}
                placeholder="e.g. 07. Admissions Campaign Launch"
              />
              <InputField
                label="Step 8"
                value={step8}
                onChange={(e) => setStep8(e.target.value)}
                placeholder="e.g. 08. Grand Opening & Classes"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <div className="w-full sm:w-64">
              <SaveButton onClick={handleSave} loading={loading} saved={saved} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
