"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function StartSchoolFaqSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");

  const [faq1Q, setFaq1Q] = useState("");
  const [faq1A, setFaq1A] = useState("");
  const [faq2Q, setFaq2Q] = useState("");
  const [faq2A, setFaq2A] = useState("");
  const [faq3Q, setFaq3Q] = useState("");
  const [faq3A, setFaq3A] = useState("");
  const [faq4Q, setFaq4Q] = useState("");
  const [faq4A, setFaq4A] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "FREQUENTLY ASKED QUESTIONS");
      setHeadline(initialData.headline ?? "Everything You Need to Know About Starting an LFCS School");

      setFaq1Q(initialData.faq1Q ?? "Who can apply to start an LFCS school?");
      setFaq1A(initialData.faq1A ?? "Individual entrepreneurs, registered charitable trusts, educational societies, and corporate CSR entities with dedicated resources for establishing educational institutions.");

      setFaq2Q(initialData.faq2Q ?? "What is the minimum land requirement?");
      setFaq2A(initialData.faq2A ?? "Typically 1.5 to 3 acres depending on city classification, following CBSE affiliation bylaws for playground and built-up area.");

      setFaq3Q(initialData.faq3Q ?? "Does LFCS assist with teacher recruitment and principal onboarding?");
      setFaq3A(initialData.faq3A ?? "Yes. LFCS central academic council conducts principal search interviews, teacher screening tests, and intensive initial training bootcamps.");

      setFaq4Q(initialData.faq4Q ?? "How long does the entire setup process take?");
      setFaq4A(initialData.faq4A ?? "Depending on existing infrastructure readiness, setup typically spans 6 to 12 months from agreement signing to the commencement of the academic session.");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "StartSchoolFaqSection",
        content: {
          tagline,
          headline,
          faq1Q,
          faq1A,
          faq2Q,
          faq2A,
          faq3Q,
          faq3A,
          faq4Q,
          faq4A,
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
        toast.success("Partnership FAQs saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save FAQs");
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
        title="8. Associate Partnership FAQs"
        description="Key questions frequently asked by prospective school partners, investors, and trust trustees."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Eyebrow Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. FREQUENTLY ASKED QUESTIONS"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Everything You Need to Know About Starting a School"
            />
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
              <InputField
                label="Question 1"
                value={faq1Q}
                onChange={(e) => setFaq1Q(e.target.value)}
                placeholder="e.g. Who can apply to start an LFCS school?"
              />
              <TextAreaField
                label="Answer 1"
                value={faq1A}
                onChange={(e) => setFaq1A(e.target.value)}
                rows={2}
                placeholder="e.g. Eligibility explanation..."
              />
            </div>

            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
              <InputField
                label="Question 2"
                value={faq2Q}
                onChange={(e) => setFaq2Q(e.target.value)}
                placeholder="e.g. What is the minimum land requirement?"
              />
              <TextAreaField
                label="Answer 2"
                value={faq2A}
                onChange={(e) => setFaq2A(e.target.value)}
                rows={2}
                placeholder="e.g. Land acreage explanation..."
              />
            </div>

            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
              <InputField
                label="Question 3"
                value={faq3Q}
                onChange={(e) => setFaq3Q(e.target.value)}
                placeholder="e.g. Does LFCS assist with teacher recruitment?"
              />
              <TextAreaField
                label="Answer 3"
                value={faq3A}
                onChange={(e) => setFaq3A(e.target.value)}
                rows={2}
                placeholder="e.g. Recruitment support explanation..."
              />
            </div>

            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
              <InputField
                label="Question 4"
                value={faq4Q}
                onChange={(e) => setFaq4Q(e.target.value)}
                placeholder="e.g. How long does setup take?"
              />
              <TextAreaField
                label="Answer 4"
                value={faq4A}
                onChange={(e) => setFaq4A(e.target.value)}
                rows={2}
                placeholder="e.g. Timeline explanation..."
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
