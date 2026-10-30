"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

interface FormIntroSectionProps {
  initialData?: any;
  sectionType: string;
  apiPath: string;
  title: string;
  description: string;
  inboxLabel: string;
  inboxHref: string;
}

// Intro copy and thank-you message shown around a website enquiry form (inline or pop-up).
export function FormIntroSection({
  initialData,
  sectionType,
  apiPath,
  title,
  description: sectionDescription,
  inboxLabel,
  inboxHref,
}: FormIntroSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitText, setSubmitText] = useState("");
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");
      setContactEmail(initialData.contactEmail ?? "");
      setSubmitText(initialData.submitText ?? "");
      setSuccessTitle(initialData.successTitle ?? "");
      setSuccessMessage(initialData.successMessage ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: sectionType,
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          contactEmail,
          submitText,
          successTitle,
          successMessage,
        },
      };

      const res = await fetch(apiPath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Enquiry form text saved successfully!");
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
        title={title}
        description={sectionDescription}
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#842b46] text-white">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">{inboxLabel}</p>
                <p className="text-[11px] text-gray-500">
                  Enquiries submitted through this form are collected in the Submissions module.
                </p>
              </div>
            </div>
            <Link
              href={inboxHref}
              className="px-4 py-2 bg-white text-[#842b46] text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-50 transition-all flex items-center gap-1.5"
            >
              View Inquiries <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Pre-Heading Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Get in Touch"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Tell Us About"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Your Plans"
            />
          </div>

          <TextAreaField
            label="Intro Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Share a few details and our team will get back to you..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Contact Email (shown after description)"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="e.g. enquiries@school.com"
            />
            <InputField
              label="Submit Button Label"
              value={submitText}
              onChange={(e) => setSubmitText(e.target.value)}
              placeholder="e.g. Send Enquiry"
            />
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-4">
            <InputField
              label="Thank-You Title"
              value={successTitle}
              onChange={(e) => setSuccessTitle(e.target.value)}
              placeholder="e.g. Enquiry Received"
            />
            <TextAreaField
              label="Thank-You Message"
              value={successMessage}
              onChange={(e) => setSuccessMessage(e.target.value)}
              rows={2}
              placeholder="e.g. Message shown after the form is submitted successfully..."
            />
          </div>

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
