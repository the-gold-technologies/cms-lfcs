"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function CareersFinalCTASection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [emailText, setEmailText] = useState("");

  useEffect(() => {
    if (initialData) {
      setHeading(initialData.heading ?? "Your Next Opportunity Could Begin Here");
      setDescription(
        initialData.description ??
          "If you are passionate about education and would like to explore a fulfilling career with Little Flower Group of Schools, submit your CV and profile today.",
      );
      setButtonText(initialData.buttonText ?? "Submit Your Profile");
      setEmailText(initialData.emailText ?? "careers@lfcsschools.com");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "CareersFinalCTASection",
        content: {
          heading,
          description,
          buttonText,
          emailText,
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
        toast.success("Careers Final CTA section saved successfully!");
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
        title="5. CV Submission & Profile Invitation Banner"
        description="Bottom banner inviting candidates to submit their application or email their resume directly to HR."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <InputField
            label="Banner Heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="e.g. Your Next Opportunity Could Begin Here"
          />

          <TextAreaField
            label="Banner Paragraph"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. Invitation to submit candidate credentials..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Label"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="e.g. Submit Your Profile"
            />
            <InputField
              label="HR Direct Email"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="e.g. careers@lfcsschools.com"
            />
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
