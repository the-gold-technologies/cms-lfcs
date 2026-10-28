"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { Plus, Trash2 } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

export function StartSchoolFaqSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");

  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "FREQUENTLY ASKED QUESTIONS");
      setHeadline(
        initialData.headline ?? "Everything You Need to Know About Starting an LFCS School",
      );

      if (Array.isArray(initialData.faqs) && initialData.faqs.length > 0) {
        setFaqs(
          initialData.faqs.map((f: any) => ({
            question: f.question ?? f.q ?? "",
            answer: f.answer ?? f.a ?? "",
          })),
        );
      } else {
        setFaqs([
          {
            question: initialData.faq1Q ?? "Who can apply to start an LFCS school?",
            answer:
              initialData.faq1A ??
              "Individual entrepreneurs, registered charitable trusts, educational societies, and corporate CSR entities with dedicated resources for establishing educational institutions.",
          },
          {
            question: initialData.faq2Q ?? "What is the minimum land requirement?",
            answer:
              initialData.faq2A ??
              "Typically 1.5 to 3 acres depending on city classification, following CBSE affiliation bylaws for playground and built-up area.",
          },
          {
            question:
              initialData.faq3Q ??
              "Does LFCS assist with teacher recruitment and principal onboarding?",
            answer:
              initialData.faq3A ??
              "Yes. LFCS central academic council conducts principal search interviews, teacher screening tests, and intensive initial training bootcamps.",
          },
          {
            question: initialData.faq4Q ?? "How long does the entire setup process take?",
            answer:
              initialData.faq4A ??
              "Depending on existing infrastructure readiness, setup typically spans 6 to 12 months from agreement signing to the commencement of the academic session.",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateFaq = (index: number, field: keyof FaqItem, value: string) => {
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
          faqs, // Array object!
          // Backward compatibility:
          faq1Q: faqs[0]?.question ?? "",
          faq1A: faqs[0]?.answer ?? "",
          faq2Q: faqs[1]?.question ?? "",
          faq2A: faqs[1]?.answer ?? "",
          faq3Q: faqs[2]?.question ?? "",
          faq3A: faqs[2]?.answer ?? "",
          faq4Q: faqs[3]?.question ?? "",
          faq4A: faqs[3]?.answer ?? "",
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
        title="8. Frequently Asked Questions (Associate School FAQs)"
        description="Address prospective partner doubts covering eligibility, land requirements, curriculum compliance, and ROI."
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
              placeholder="e.g. Everything You Need to Know..."
            />
          </div>

          {/* DYNAMIC FAQS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Associate School FAQs ({faqs.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Frequently asked questions and detailed answers. Can add more than 4 questions.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            {faqs.length === 0 ? (
              <div
                onClick={handleAddFaq}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No FAQs added yet. Click to add your first question.</span>
              </div>
            ) : (
              <div className="space-y-3.5">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Question #{idx + 1}: {faq.question || "Untitled Question"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <InputField
                      label="Question Text"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                      placeholder="e.g. What is the minimum land requirement?"
                    />

                    <TextAreaField
                      label="Answer"
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                      rows={3}
                      placeholder="e.g. Detailed answer covering requirements and guidelines..."
                    />
                  </div>
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
