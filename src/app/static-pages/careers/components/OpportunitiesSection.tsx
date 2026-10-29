"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Plus, Briefcase, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { SaveButton } from "@/components/SaveButton";

interface OpportunityItem {
  label: string;
  icon: string;
  heading: string;
  script: string;
  description: string;
  rolesText: string;
  cta: string;
  img: string;
}

export function OpportunitiesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");

      if (Array.isArray(initialData.opportunities)) {
        setOpportunities(
          initialData.opportunities.map((item: any) => ({
            label: item.label ?? "",
            icon: item.icon ?? "BookOpen",
            heading: item.heading ?? "",
            script: item.script ?? "",
            description: Array.isArray(item.paragraphs)
              ? item.paragraphs.join("\n\n")
              : (item.description ?? ""),
            rolesText: Array.isArray(item.roles) ? item.roles.join("\n") : (item.rolesText ?? ""),
            cta: item.cta ?? "",
            img: item.img ?? "",
          })),
        );
      } else {
        setOpportunities([]);
      }
    }
  }, [initialData]);

  const toggleCard = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const addOpportunity = () => {
    setOpportunities((prev) => [
      ...prev,
      {
        label: "",
        icon: "BookOpen",
        heading: "",
        script: "",
        description: "",
        rolesText: "",
        cta: "",
        img: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, opportunities.length]);
  };

  const removeOpportunity = (index: number) => {
    setOpportunities((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
  };

  const updateOpportunity = (index: number, field: keyof OpportunityItem, value: string) => {
    setOpportunities((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const formatted = opportunities.map((item) => ({
        ...item,
        paragraphs: item.description
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean),
        roles: item.rolesText
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean),
      }));

      const payload = {
        section: "OpportunitiesSection",
        content: {
          tagline,
          headline,
          opportunities: formatted,
        },
      };

      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Opportunities section saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save section");
      }
    } catch {
      toast.error("Network error while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6">
      <SectionHeader
        title="4. Career Opportunities by Domain"
        description="Teaching and administrative domain cards with job roles checklists and application modal triggers."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          {/* Submissions Module Shortcut Banner */}
          <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#842b46] text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Candidate CVs & Applications</p>
                <p className="text-[11px] text-gray-500">
                  Resumes submitted by job seekers via the career modal are collected in Submissions
                  &gt; Career CVs.
                </p>
              </div>
            </div>
            <Link
              href="/submissions/careers"
              className="px-4 py-2 bg-white text-[#842b46] text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-50 transition-all flex items-center gap-1.5"
            >
              View CVs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Pre-Heading Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. CURRENT OPENINGS"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Explore Opportunities by Domain"
            />
          </div>

          {/* Opportunities Dynamic Array */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-800">Opportunity Domains</h4>
                <p className="text-xs text-gray-500">
                  Career domains displayed with alternating layout (e.g. Teaching, Administrative).
                </p>
              </div>
              <button
                type="button"
                onClick={addOpportunity}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#842b46] text-white text-xs font-semibold rounded-xl hover:bg-[#0b484d] transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Domain
              </button>
            </div>

            <div className="space-y-3">
              {opportunities.map((opp, idx) => (
                <CollapsibleCard
                  key={idx}
                  index={idx}
                  title={opp.label || `Domain #${idx + 1}`}
                  subtitle={opp.heading ? `${opp.heading} ${opp.script}` : "Domain details"}
                  thumbnail={opp.img}
                  isOpen={openIndices.includes(idx)}
                  onToggle={() => toggleCard(idx)}
                  onDelete={() => removeOpportunity(idx)}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Domain Label / Badge"
                        value={opp.label}
                        onChange={(e) => updateOpportunity(idx, "label", e.target.value)}
                        placeholder="e.g. Teaching Opportunities"
                      />
                      <InputField
                        label="Lucide Icon Name"
                        value={opp.icon}
                        onChange={(e) => updateOpportunity(idx, "icon", e.target.value)}
                        placeholder="e.g. BookOpen, Briefcase"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Domain Headline"
                        value={opp.heading}
                        onChange={(e) => updateOpportunity(idx, "heading", e.target.value)}
                        placeholder="e.g. Inspire Learning."
                      />
                      <InputField
                        label="Script Accent"
                        value={opp.script}
                        onChange={(e) => updateOpportunity(idx, "script", e.target.value)}
                        placeholder="e.g. Make a Difference."
                      />
                    </div>

                    <TextAreaField
                      label="Domain Description / Narrative (Separate paragraphs with double Enter)"
                      value={opp.description}
                      onChange={(e) => updateOpportunity(idx, "description", e.target.value)}
                      rows={3}
                      placeholder="e.g. Teachers play a vital role in shaping how students understand the world..."
                    />

                    <TextAreaField
                      label="Available Roles / Positions (One per line)"
                      value={opp.rolesText}
                      onChange={(e) => updateOpportunity(idx, "rolesText", e.target.value)}
                      rows={4}
                      placeholder={
                        "Pre-Primary Teachers\nPrimary School Teachers\nSubject Teachers\nAcademic Coordinators"
                      }
                      helperText="Enter each role on a new line. It will render as a bulleted checklist."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="CTA Button Label"
                        value={opp.cta}
                        onChange={(e) => updateOpportunity(idx, "cta", e.target.value)}
                        placeholder="e.g. Express Interest in Teaching Opportunities"
                      />
                      <ImagePickerField
                        label="Domain Photo"
                        value={opp.img}
                        onChange={(val) => updateOpportunity(idx, "img", val)}
                        folder="lfcs-school/about"
                        helperText="Visual photo for this domain."
                      />
                    </div>
                  </div>
                </CollapsibleCard>
              ))}
              {opportunities.length === 0 && (
                <p className="text-xs text-gray-400 italic">No opportunity domains added.</p>
              )}
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
