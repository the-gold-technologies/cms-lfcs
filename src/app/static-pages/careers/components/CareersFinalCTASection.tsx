"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function CareersFinalCTASection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (initialData) {
      setHeading(initialData.heading ?? "");
      if (Array.isArray(initialData.paragraphs)) {
        setDescription(initialData.paragraphs.join("\n\n"));
      } else if (typeof initialData.description === "string") {
        setDescription(initialData.description);
      } else {
        setDescription("");
      }
      setButtonText(initialData.buttonText ?? "");
      setImage(initialData.image ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const paragraphs = description
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const payload = {
        section: "CareersFinalCTASection",
        content: {
          heading,
          description,
          paragraphs,
          buttonText,
          image,
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
    } catch {
      toast.error("Network error while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6">
      <SectionHeader
        title="5. Candidate Profile Submission CTA"
        description="Bottom banner inviting educators and applicants to submit their CV and profile."
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
                <p className="text-xs font-bold text-gray-800">Direct Candidate Submissions</p>
                <p className="text-[11px] text-gray-500">
                  Resumes submitted through this CTA modal are stored in the dedicated Career CVs
                  submissions module.
                </p>
              </div>
            </div>
            <Link
              href="/submissions/careers"
              className="px-4 py-2 bg-white text-[#842b46] text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-50 transition-all flex items-center gap-1.5"
            >
              Manage CVs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <InputField
            label="CTA Headline"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="e.g. Your Next Opportunity Could Begin Here"
          />

          <TextAreaField
            label="CTA Description (Separate paragraphs with a blank line)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="If you are passionate about education and would like to explore a career with Little Flower Group of Schools, we invite you to share your profile with us.&#10;&#10;Tell us about your experience, skills and area of interest, and our team can consider your profile for relevant opportunities as they arise."
            helperText="Separate multiple paragraphs with an empty line (double Enter)."
          />

          <InputField
            label="Modal Trigger Button Label"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            placeholder="e.g. Submit Your Profile"
          />

          <ImagePickerField
            label="Banner Illustration / Photo"
            value={image}
            onChange={setImage}
            folder="lfcs-school/about"
            helperText="Banner right-side student group photography."
          />

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
