"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function WorkCultureSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [valuesList, setValuesList] = useState("");
  const [quote, setQuote] = useState("");
  const [cultureImage, setCultureImage] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");

      if (Array.isArray(initialData.paragraphs)) {
        setDescription(initialData.paragraphs.join("\n\n"));
      } else if (initialData.paragraph1 && initialData.paragraph2) {
        setDescription(`${initialData.paragraph1}\n\n${initialData.paragraph2}`);
      } else if (typeof initialData.description === "string" && initialData.description) {
        setDescription(initialData.description);
      } else {
        setDescription("");
      }

      setValuesList(
        Array.isArray(initialData.values)
          ? initialData.values.join(", ")
          : (initialData.valuesList ?? ""),
      );
      setQuote(initialData.quote ?? "");
      setCultureImage(initialData.cultureImage ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const valuesArray = valuesList
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const paragraphs = description
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const payload = {
        section: "WorkCultureSection",
        content: {
          tagline,
          headline,
          scriptAccent,
          description,
          paragraphs,
          values: valuesArray,
          valuesList,
          quote,
          cultureImage,
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
        toast.success("Work Culture section saved successfully!");
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
        title="3. Work Culture & Values Section"
        description="Workplace ethos, shared team values badges, photo of staff, and institutional philosophy quote."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Pre-Heading Tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Our Work Culture"
            />
            <InputField
              label="Main Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Growing Together Through Learning and"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Collaboration"
            />
          </div>

          <TextAreaField
            label="Culture Narrative (Separate paragraphs with a blank line)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="At Little Flower Group of Schools, we recognise that educators and staff play an important role in shaping the student experience...&#10;&#10;We value professionalism, integrity, respect, responsibility and a willingness to learn..."
            helperText="Separate multiple paragraphs with an empty line (double Enter)."
          />

          <InputField
            label="Core Values (Comma Separated)"
            value={valuesList}
            onChange={(e) => setValuesList(e.target.value)}
            placeholder="e.g. Professionalism, Integrity, Respect, Responsibility, Willingness to Learn"
            helperText="Enter values separated by commas. Each item will render as a distinct badge pill."
          />

          <TextAreaField
            label="Inspirational Quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={2}
            placeholder="e.g. We believe that when the people within a school continue to learn and improve, the entire learning community benefits."
          />

          <ImagePickerField
            label="Work Culture Photo"
            value={cultureImage}
            onChange={setCultureImage}
            folder="lfcs-school/about"
            helperText="Photo of staff members or school activities (e.g. school band, mentoring)."
          />

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
