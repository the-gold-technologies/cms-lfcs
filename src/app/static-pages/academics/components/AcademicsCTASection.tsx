"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function AcademicsCTASection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [heading, setHeading] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    if (initialData) {
      setHeading(initialData.heading ?? "");
      setButtonText(initialData.buttonText ?? "");
      setButtonLink(initialData.buttonLink ?? "");
      setBgImage(initialData.bgImage ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "AcademicsCTASection",
        content: {
          heading,
          buttonText,
          buttonLink,
          bgImage,
        },
      };

      const res = await fetch("/api/academics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Academics CTA section saved successfully!");
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
        title="8. Academics Enrollment Banner"
        description="Bottom banner directing students and families to submit an admission enquiry."
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
            placeholder="e.g. A Strong Foundation Today, A Brighter Tomorrow."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Button Text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="e.g. Enquire Now"
            />
            <InputField
              label="Button Link"
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              placeholder="e.g. /contact#contact-form"
            />
          </div>

          <ImagePickerField
            label="Banner Visual Graphic"
            value={bgImage}
            onChange={(url) => setBgImage(url)}
            placeholder="e.g. Cloudinary image URL"
            folder="lfcs-school/academics"
          />

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
