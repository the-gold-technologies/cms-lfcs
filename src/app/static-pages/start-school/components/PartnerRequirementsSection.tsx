"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function PartnerRequirementsSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [req1Title, setReq1Title] = useState("");
  const [req1Desc, setReq1Desc] = useState("");
  const [req2Title, setReq2Title] = useState("");
  const [req2Desc, setReq2Desc] = useState("");
  const [req3Title, setReq3Title] = useState("");
  const [req3Desc, setReq3Desc] = useState("");
  const [req4Title, setReq4Title] = useState("");
  const [req4Desc, setReq4Desc] = useState("");
  const [req5Title, setReq5Title] = useState("");
  const [req5Desc, setReq5Desc] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "PARTNER PROFILE & ELIGIBILITY");
      setHeadline(initialData.headline ?? "Who Can Explore an");
      setScriptAccent(initialData.scriptAccent ?? "LFCS Partnership?");
      setSubtitle(initialData.subtitle ?? "We welcome visionary individuals, trusts, corporate CSR bodies, and educational societies dedicated to uplifting local educational standards.");

      setReq1Title(initialData.req1Title ?? "Commitment to Education");
      setReq1Desc(initialData.req1Desc ?? "A sincere interest in contributing to children's character, academic growth, and regional development.");

      setReq2Title(initialData.req2Title ?? "Management & Leadership Capability");
      setReq2Desc(initialData.req2Desc ?? "Capacity to organize, recruit, and supervise daily administrative and operational personnel.");

      setReq3Title(initialData.req3Title ?? "Infrastructure & Land Readiness");
      setReq3Desc(initialData.req3Desc ?? "Access to 1.5 to 3+ acres of suitable land or constructed school premises adhering to CBSE affiliation norms.");

      setReq4Title(initialData.req4Title ?? "Financial Preparedness");
      setReq4Desc(initialData.req4Desc ?? "Adequate investment capability for phase-wise campus construction, lab setup, and working capital.");

      setReq5Title(initialData.req5Title ?? "Long-Term Vision");
      setReq5Desc(initialData.req5Desc ?? "A multi-year commitment to maintaining high educational integrity, discipline, and community standing.");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "PartnerRequirementsSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          req1Title,
          req1Desc,
          req2Title,
          req2Desc,
          req3Title,
          req3Desc,
          req4Title,
          req4Desc,
          req5Title,
          req5Desc,
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
        toast.success("Partner Requirements saved successfully!");
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
        title="5. Partner Eligibility & Requirements (5 Criteria)"
        description="Defines criteria for prospective partners: Commitment to Education, Management, Land, Financials, and Long-Term Vision."
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
              placeholder="e.g. PARTNER PROFILE"
            />
            <InputField
              label="Headline Lead"
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
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Overview of partner eligibility..."
          />

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              5 Eligibility Criteria
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Criterion 1 Title"
                  value={req1Title}
                  onChange={(e) => setReq1Title(e.target.value)}
                  placeholder="e.g. Commitment to Education"
                />
                <TextAreaField
                  label="Description"
                  value={req1Desc}
                  onChange={(e) => setReq1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Passion for educational development..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Criterion 2 Title"
                  value={req2Title}
                  onChange={(e) => setReq2Title(e.target.value)}
                  placeholder="e.g. Management Capability"
                />
                <TextAreaField
                  label="Description"
                  value={req2Desc}
                  onChange={(e) => setReq2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Leadership and administrative capacity..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Criterion 3 Title"
                  value={req3Title}
                  onChange={(e) => setReq3Title(e.target.value)}
                  placeholder="e.g. Land Readiness"
                />
                <TextAreaField
                  label="Description"
                  value={req3Desc}
                  onChange={(e) => setReq3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Land area requirements..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Criterion 4 Title"
                  value={req4Title}
                  onChange={(e) => setReq4Title(e.target.value)}
                  placeholder="e.g. Financial Preparedness"
                />
                <TextAreaField
                  label="Description"
                  value={req4Desc}
                  onChange={(e) => setReq4Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Capital investment capacity..."
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <InputField
                  label="Criterion 5 Title"
                  value={req5Title}
                  onChange={(e) => setReq5Title(e.target.value)}
                  placeholder="e.g. Long-Term Vision"
                />
                <TextAreaField
                  label="Description"
                  value={req5Desc}
                  onChange={(e) => setReq5Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Multi-year commitment..."
                />
              </div>
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
