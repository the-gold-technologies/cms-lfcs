"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function EducationalApproachSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");

  const [app1Title, setApp1Title] = useState("");
  const [app1Desc, setApp1Desc] = useState("");
  const [app1Image, setApp1Image] = useState("");

  const [app2Title, setApp2Title] = useState("");
  const [app2Desc, setApp2Desc] = useState("");
  const [app2Image, setApp2Image] = useState("");

  const [app3Title, setApp3Title] = useState("");
  const [app3Desc, setApp3Desc] = useState("");
  const [app3Image, setApp3Image] = useState("");

  const [app4Title, setApp4Title] = useState("");
  const [app4Desc, setApp4Desc] = useState("");
  const [app4Image, setApp4Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "OUR PHILOSOPHY");
      setHeadline(initialData.headline ?? "A Thoughtful Educational Approach");
      setDescription(initialData.description ?? "Our academic paradigm integrates modern cognitive science with time-tested values.");

      setApp1Title(initialData.app1Title ?? "Child-Centered Learning");
      setApp1Desc(initialData.app1Desc ?? "We focus on nurturing curiosity and encouraging exploration tailored to each learner.");
      setApp1Image(initialData.app1Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170030/lfcs-school/independent_1793170030545.webp");

      setApp2Title(initialData.app2Title ?? "Experiential Learning");
      setApp2Desc(initialData.app2Desc ?? "Hands-on experiences that make learning meaningful, relevant, and lasting.");
      setApp2Image(initialData.app2Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170028/lfcs-school/practical_1793170027731.webp");

      setApp3Title(initialData.app3Title ?? "Holistic Development");
      setApp3Desc(initialData.app3Desc ?? "We nurture academics, creativity, athletics, and life skills equally.");
      setApp3Image(initialData.app3Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170034/lfcs-school/activity_1793170034132.webp");

      setApp4Title(initialData.app4Title ?? "Values & Character");
      setApp4Desc(initialData.app4Desc ?? "Building strong moral compass, empathy, and respect for a better tomorrow.");
      setApp4Image(initialData.app4Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170022/lfcs-school/collabrative_1793170021825.webp");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "EducationalApproachSection",
        content: {
          tagline,
          headline,
          description,
          app1Title,
          app1Desc,
          app1Image,
          app2Title,
          app2Desc,
          app2Image,
          app3Title,
          app3Desc,
          app3Image,
          app4Title,
          app4Desc,
          app4Image,
        },
      };

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Educational Approach section saved successfully!");
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
        title="4. Educational Approach (4 Core Pillars)"
        description="Four foundational learning principles: Child-Centered, Experiential, Holistic Development, and Values & Character."
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
              placeholder="e.g. Eyebrow badge (e.g. OUR PHILOSOPHY)"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Section title (e.g. A Thoughtful Educational Approach)"
            />
          </div>

          <TextAreaField
            label="Section Overview"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. Overview introducing the multi-faceted pedagogy..."
          />

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Approach Pillars
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Pillar 1 Title"
                  value={app1Title}
                  onChange={(e) => setApp1Title(e.target.value)}
                  placeholder="e.g. Child-Centered Learning"
                />
                <TextAreaField
                  label="Pillar 1 Description"
                  value={app1Desc}
                  onChange={(e) => setApp1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Detail on personalized learning..."
                />
                <ImagePickerField
                  label="Pillar 1 Photo"
                  value={app1Image}
                  onChange={(url) => setApp1Image(url)}
                  placeholder="e.g. Cloudinary image URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Pillar 2 Title"
                  value={app2Title}
                  onChange={(e) => setApp2Title(e.target.value)}
                  placeholder="e.g. Experiential Learning"
                />
                <TextAreaField
                  label="Pillar 2 Description"
                  value={app2Desc}
                  onChange={(e) => setApp2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Detail on hands-on experiences..."
                />
                <ImagePickerField
                  label="Pillar 2 Photo"
                  value={app2Image}
                  onChange={(url) => setApp2Image(url)}
                  placeholder="e.g. Cloudinary image URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Pillar 3 Title"
                  value={app3Title}
                  onChange={(e) => setApp3Title(e.target.value)}
                  placeholder="e.g. Holistic Development"
                />
                <TextAreaField
                  label="Pillar 3 Description"
                  value={app3Desc}
                  onChange={(e) => setApp3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Sports and co-curricular integration..."
                />
                <ImagePickerField
                  label="Pillar 3 Photo"
                  value={app3Image}
                  onChange={(url) => setApp3Image(url)}
                  placeholder="e.g. Cloudinary image URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Pillar 4 Title"
                  value={app4Title}
                  onChange={(e) => setApp4Title(e.target.value)}
                  placeholder="e.g. Values & Character"
                />
                <TextAreaField
                  label="Pillar 4 Description"
                  value={app4Desc}
                  onChange={(e) => setApp4Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Moral and ethical development..."
                />
                <ImagePickerField
                  label="Pillar 4 Photo"
                  value={app4Image}
                  onChange={(url) => setApp4Image(url)}
                  placeholder="e.g. Cloudinary image URL"
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
