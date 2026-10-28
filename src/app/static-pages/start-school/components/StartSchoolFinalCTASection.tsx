"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function StartSchoolFinalCTASection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [heading, setHeading] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    if (initialData) {
      setHeading(initialData.heading ?? "Build a School With a Shared Educational Purpose");
      setButtonText(initialData.buttonText ?? "Submit Your Enquiry");
      setEmailText(initialData.emailText ?? "franchise@lfcsschools.com");
      setBgImage(initialData.bgImage ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170008/lfcs-school/school-associate-launch_1793170008299.webp");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "StartSchoolFinalCTASection",
        content: {
          heading,
          buttonText,
          emailText,
          bgImage,
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
        toast.success("Final CTA section saved successfully!");
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
        title="9. Start a School Final Proposal Banner"
        description="Bottom high-conversion banner prompting prospective partners to submit their school proposal."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <InputField
            label="Banner Title"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="e.g. Build a School With a Shared Educational Purpose"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="CTA Button Label"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="e.g. Submit Your Enquiry"
            />
            <InputField
              label="Contact Direct Email"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="e.g. franchise@lfcsschools.com"
            />
          </div>

          <ImagePickerField
            label="Decorative Banner Image"
            value={bgImage}
            onChange={(url) => setBgImage(url)}
            placeholder="e.g. Cloudinary background photo URL"
          />

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
