"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function NoteOfSupportSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");

  const [person1Name, setPerson1Name] = useState("");
  const [person1Role, setPerson1Role] = useState("");
  const [person1Headline, setPerson1Headline] = useState("");
  const [person1Quote, setPerson1Quote] = useState("");
  const [person1Image, setPerson1Image] = useState("");

  const [person2Name, setPerson2Name] = useState("");
  const [person2Role, setPerson2Role] = useState("");
  const [person2Headline, setPerson2Headline] = useState("");
  const [person2Quote, setPerson2Quote] = useState("");
  const [person2Image, setPerson2Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "Notes of Support");
      setHeadline(initialData.headline ?? "Voices That Believe in Our Journey");

      setPerson1Name(initialData.person1Name ?? "Sharman Joshi");
      setPerson1Role(initialData.person1Role ?? "Actor & LFCS Supporter");
      setPerson1Headline(
        initialData.person1Headline ??
          "Some journeys are worth supporting because of the trust behind them.",
      );
      setPerson1Quote(
        initialData.person1Quote ??
          "I am happy to extend my support to Little Flower Children School and its journey towards making quality education accessible to more children and families.",
      );
      setPerson1Image(
        initialData.person1Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170012/lfcs-school/sharman-joshi_1793170012349.webp",
      );

      setPerson2Name(initialData.person2Name ?? "Mr. Anand Kumar");
      setPerson2Role(initialData.person2Role ?? "Mathematician & Founder, Super 30");
      setPerson2Headline(
        initialData.person2Headline ?? "Education can change the direction of a child's life.",
      );
      setPerson2Quote(
        initialData.person2Quote ??
          "Quality education must reach the children who need it most. I wish LFCS the very best as it takes this important vision across India.",
      );
      setPerson2Image(
        initialData.person2Image ??
          "https://res.cloudinary.com/dpa93copz/image/upload/v1793170011/lfcs-school/anand-kumar_1793170011282.webp",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "NoteOfSupportSection",
        content: {
          tagline,
          headline,
          person1Name,
          person1Role,
          person1Headline,
          person1Quote,
          person1Image,
          person2Name,
          person2Role,
          person2Headline,
          person2Quote,
          person2Image,
        },
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Notes of Support section saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save Notes of Support");
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
        title="3. Notes of Support (Celebrity & Academic Endorsements)"
        description="Public endorsements from notable figures: Sharman Joshi and Super 30's Anand Kumar."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Tagline Eyebrow"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Section category tag (e.g. Notes of Support)"
            />
            <InputField
              label="Main Heading"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Section header (e.g. Voices That Believe in Our Journey)"
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Endorser 1: Sharman Joshi
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <InputField
                  label="Full Name"
                  value={person1Name}
                  onChange={(e) => setPerson1Name(e.target.value)}
                  placeholder="e.g. Public figure's name (e.g. Sharman Joshi)"
                />
                <InputField
                  label="Title / Credential"
                  value={person1Role}
                  onChange={(e) => setPerson1Role(e.target.value)}
                  placeholder="e.g. Role or credentials (e.g. Actor & LFCS Supporter)"
                />
                <InputField
                  label="Callout Headline"
                  value={person1Headline}
                  onChange={(e) => setPerson1Headline(e.target.value)}
                  placeholder="e.g. Punchy one-sentence key quote headline"
                />
                <TextAreaField
                  label="Full Endorsement Quote"
                  value={person1Quote}
                  onChange={(e) => setPerson1Quote(e.target.value)}
                  rows={3}
                  placeholder="e.g. Complete quote or testimonial text..."
                />
              </div>
              <ImagePickerField
                label="Endorser Photo"
                value={person1Image}
                onChange={(url) => setPerson1Image(url)}
                placeholder="e.g. Select Cloudinary portrait photo"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Endorser 2: Mr. Anand Kumar (Super 30)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <InputField
                  label="Full Name"
                  value={person2Name}
                  onChange={(e) => setPerson2Name(e.target.value)}
                  placeholder="e.g. Public figure's name (e.g. Mr. Anand Kumar)"
                />
                <InputField
                  label="Title / Credential"
                  value={person2Role}
                  onChange={(e) => setPerson2Role(e.target.value)}
                  placeholder="e.g. Role or credentials (e.g. Founder, Super 30)"
                />
                <InputField
                  label="Callout Headline"
                  value={person2Headline}
                  onChange={(e) => setPerson2Headline(e.target.value)}
                  placeholder="e.g. Punchy one-sentence key quote headline"
                />
                <TextAreaField
                  label="Full Endorsement Quote"
                  value={person2Quote}
                  onChange={(e) => setPerson2Quote(e.target.value)}
                  rows={3}
                  placeholder="e.g. Complete quote or testimonial text..."
                />
              </div>
              <ImagePickerField
                label="Endorser Photo"
                value={person2Image}
                onChange={(url) => setPerson2Image(url)}
                placeholder="e.g. Select Cloudinary portrait photo"
              />
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
