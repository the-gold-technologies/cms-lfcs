"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";

export interface FaqItem {
  q: string;
  a: string;
  note?: string;
}

export function StartSchoolFaqSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");

  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");

      if (Array.isArray(initialData.faqs)) {
        setFaqs(
          initialData.faqs.map((f: any) => ({
            q: f.q ?? f.question ?? "",
            a: f.a ?? f.answer ?? "",
            note: f.note ?? "",
          })),
        );
      } else {
        setFaqs([]);
      }
    }
  }, [initialData]);

  const handleAddFaq = () => {
    setFaqs((prev) => [...prev, { q: "", a: "", note: "" }]);
    setOpenIndices((prev) => [...prev, faqs.length]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdateFaq = (
    index: number,
    field: keyof FaqItem,
    value: string,
  ) => {
    setFaqs((prev) => {
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
        section: "StartSchoolFaqSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          faqs,
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
        toast.success("FAQs section saved successfully!");
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
        title="8. Frequently Asked Questions (Partner FAQs)"
        description="Address prospective franchisee queries on land, capital, academic support, and agreements."
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
              placeholder="e.g. FAQs"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Frequently Asked"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Questions"
            />
          </div>

          <TextAreaField
            label="Section Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. Find answers to common questions about starting an LFCS school..."
          />

          {/* DYNAMIC FAQS */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Questions & Answers ({faqs.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Expandable FAQ accordion items shown to partners.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0E5A60] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ</span>
              </button>
            </div>

            {faqs.length === 0 ? (
              <div
                onClick={handleAddFaq}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#0E5A60] hover:text-[#0E5A60] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No FAQs added yet. Click to add your first question.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Q${idx + 1}: ${faq.q || "Untitled Question"}`}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemoveFaq(idx)}
                    deleteTitle="Delete FAQ"
                  >
                    <InputField
                      label="Question"
                      value={faq.q}
                      onChange={(e) => handleUpdateFaq(idx, "q", e.target.value)}
                      placeholder="e.g. Who can apply to start an LFCS school?"
                    />

                    <TextAreaField
                      label="Answer"
                      value={faq.a}
                      onChange={(e) => handleUpdateFaq(idx, "a", e.target.value)}
                      rows={3}
                      placeholder="e.g. Individuals and eligible organisations interested in establishing a school may enquire..."
                    />

                    <InputField
                      label="Note / Footnote (Optional)"
                      value={faq.note ?? ""}
                      onChange={(e) => handleUpdateFaq(idx, "note", e.target.value)}
                      placeholder="e.g. Need to confirm this from client..."
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
