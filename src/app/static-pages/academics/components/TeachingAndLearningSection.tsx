"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function TeachingAndLearningSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [m1Title, setM1Title] = useState("");
  const [m1Desc, setM1Desc] = useState("");
  const [m1Image, setM1Image] = useState("");

  const [m2Title, setM2Title] = useState("");
  const [m2Desc, setM2Desc] = useState("");
  const [m2Image, setM2Image] = useState("");

  const [m3Title, setM3Title] = useState("");
  const [m3Desc, setM3Desc] = useState("");
  const [m3Image, setM3Image] = useState("");

  const [m4Title, setM4Title] = useState("");
  const [m4Desc, setM4Desc] = useState("");
  const [m4Image, setM4Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "TEACHING & LEARNING");
      setHeadline(initialData.headline ?? "From Concepts to Applying Them");
      setSubtitle(
        initialData.subtitle ??
          "Learning at LFCS moves beyond books. Our skilled educators make classroom learning interactive, exploratory, and memorable.",
      );

      setM1Title(initialData.m1Title ?? "Collaborative Group Inquiry");
      setM1Desc(
        initialData.m1Desc ??
          "Peer-to-peer discussions, group projects, and team presentations that reinforce communication.",
      );
      setM1Image(
        initialData.m1Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170022/lfcs-school/collabrative_1793170021825.webp",
      );

      setM2Title(initialData.m2Title ?? "Practical Demonstrations");
      setM2Desc(
        initialData.m2Desc ??
          "Laboratory experiments, real-world models, and tactile math tools to cement abstract formulas.",
      );
      setM2Image(
        initialData.m2Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170028/lfcs-school/practical_1793170027731.webp",
      );

      setM3Title(initialData.m3Title ?? "Independent Research");
      setM3Desc(
        initialData.m3Desc ??
          "Self-guided library reading, science fair displays, and research essays fostering intellectual autonomy.",
      );
      setM3Image(
        initialData.m3Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170030/lfcs-school/independent_1793170030545.webp",
      );

      setM4Title(initialData.m4Title ?? "Active Remediation & Mentorship");
      setM4Desc(
        initialData.m4Desc ??
          "Targeted one-on-one doubt resolution and tailored guidance to leave no child behind.",
      );
      setM4Image(
        initialData.m4Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170034/lfcs-school/activity_1793170034132.webp",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "TeachingAndLearningSection",
        content: {
          tagline,
          headline,
          subtitle,
          m1Title,
          m1Desc,
          m1Image,
          m2Title,
          m2Desc,
          m2Image,
          m3Title,
          m3Desc,
          m3Image,
          m4Title,
          m4Desc,
          m4Image,
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
        toast.success("Teaching & Learning section saved successfully!");
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
        title="4. Teaching & Learning Methodologies"
        description="Explains dynamic instructional methods: Collaborative Inquiry, Practical Labs, Independent Study, and Remediation."
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
              placeholder="e.g. TEACHING & LEARNING"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. From Concepts to Applying Them"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Pedagogical overview..."
          />

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              4 Instructional Approaches
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Method 1 Title"
                  value={m1Title}
                  onChange={(e) => setM1Title(e.target.value)}
                  placeholder="e.g. Collaborative Inquiry"
                />
                <TextAreaField
                  label="Method 1 Description"
                  value={m1Desc}
                  onChange={(e) => setM1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Group study explanation..."
                />
                <ImagePickerField
                  label="Method 1 Photo"
                  value={m1Image}
                  onChange={(url) => setM1Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Method 2 Title"
                  value={m2Title}
                  onChange={(e) => setM2Title(e.target.value)}
                  placeholder="e.g. Practical Demonstrations"
                />
                <TextAreaField
                  label="Method 2 Description"
                  value={m2Desc}
                  onChange={(e) => setM2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Lab demonstration explanation..."
                />
                <ImagePickerField
                  label="Method 2 Photo"
                  value={m2Image}
                  onChange={(url) => setM2Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Method 3 Title"
                  value={m3Title}
                  onChange={(e) => setM3Title(e.target.value)}
                  placeholder="e.g. Independent Research"
                />
                <TextAreaField
                  label="Method 3 Description"
                  value={m3Desc}
                  onChange={(e) => setM3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Autonomous inquiry..."
                />
                <ImagePickerField
                  label="Method 3 Photo"
                  value={m3Image}
                  onChange={(url) => setM3Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Method 4 Title"
                  value={m4Title}
                  onChange={(e) => setM4Title(e.target.value)}
                  placeholder="e.g. Active Remediation"
                />
                <TextAreaField
                  label="Method 4 Description"
                  value={m4Desc}
                  onChange={(e) => setM4Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Mentorship & doubt sessions..."
                />
                <ImagePickerField
                  label="Method 4 Photo"
                  value={m4Image}
                  onChange={(url) => setM4Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
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
