"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function AcademicFacilitiesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");

  const [f1Title, setF1Title] = useState("");
  const [f1Desc, setF1Desc] = useState("");
  const [f1Image, setF1Image] = useState("");

  const [f2Title, setF2Title] = useState("");
  const [f2Desc, setF2Desc] = useState("");
  const [f2Image, setF2Image] = useState("");

  const [f3Title, setF3Title] = useState("");
  const [f3Desc, setF3Desc] = useState("");
  const [f3Image, setF3Image] = useState("");

  const [f4Title, setF4Title] = useState("");
  const [f4Desc, setF4Desc] = useState("");
  const [f4Image, setF4Image] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "CAMPUS INFRASTRUCTURE");
      setHeadline(initialData.headline ?? "Modern Academic Facilities");

      setF1Title(initialData.f1Title ?? "Smart / Digital Classrooms");
      setF1Desc(initialData.f1Desc ?? "Interactive flat panels, multimedia audio-visual aids, and high-speed broadband supporting dynamic visual learning.");
      setF1Image(initialData.f1Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170019/lfcs-school/digital-classroom_1793170018820.webp");

      setF2Title(initialData.f2Title ?? "Advanced Science Laboratories");
      setF2Desc(initialData.f2Desc ?? "Fully equipped Physics, Chemistry, and Biology laboratories adhering strictly to CBSE safety guidelines.");
      setF2Image(initialData.f2Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170032/lfcs-school/Experience4_1793170032205.webp");

      setF3Title(initialData.f3Title ?? "High-Tech Computer Labs");
      setF3Desc(initialData.f3Desc ?? "Modern terminals with coding IDEs, AI workstations, robotics kits, and digital literacy modules.");
      setF3Image(initialData.f3Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170016/lfcs-school/computer-lab_1793170016129.webp");

      setF4Title(initialData.f4Title ?? "Knowledge Resource Center & Library");
      setF4Desc(initialData.f4Desc ?? "Vast catalog of 10,000+ fiction, reference volumes, periodicals, and quiet reading pods.");
      setF4Image(initialData.f4Image ?? "https://res.cloudinary.com/dpa93copz/image/upload/v1793170015/lfcs-school/library_1793170015178.webp");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "AcademicFacilitiesSection",
        content: {
          tagline,
          headline,
          f1Title,
          f1Desc,
          f1Image,
          f2Title,
          f2Desc,
          f2Image,
          f3Title,
          f3Desc,
          f3Image,
          f4Title,
          f4Desc,
          f4Image,
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
        toast.success("Academic Facilities saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save facilities");
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
        title="7. Academic Facilities & Modern Infrastructure"
        description="Showcase smart classrooms, specialized science labs, computer labs, and knowledge library."
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
              placeholder="e.g. CAMPUS INFRASTRUCTURE"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Modern Academic Facilities"
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              4 Featured Facilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Facility 1 Title"
                  value={f1Title}
                  onChange={(e) => setF1Title(e.target.value)}
                  placeholder="e.g. Smart / Digital Classrooms"
                />
                <TextAreaField
                  label="Description"
                  value={f1Desc}
                  onChange={(e) => setF1Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Digital learning features..."
                />
                <ImagePickerField
                  label="Facility 1 Photo"
                  value={f1Image}
                  onChange={(url) => setF1Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Facility 2 Title"
                  value={f2Title}
                  onChange={(e) => setF2Title(e.target.value)}
                  placeholder="e.g. Advanced Science Laboratories"
                />
                <TextAreaField
                  label="Description"
                  value={f2Desc}
                  onChange={(e) => setF2Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Science lab equipment and safety..."
                />
                <ImagePickerField
                  label="Facility 2 Photo"
                  value={f2Image}
                  onChange={(url) => setF2Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Facility 3 Title"
                  value={f3Title}
                  onChange={(e) => setF3Title(e.target.value)}
                  placeholder="e.g. High-Tech Computer Labs"
                />
                <TextAreaField
                  label="Description"
                  value={f3Desc}
                  onChange={(e) => setF3Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Coding and digital workstations..."
                />
                <ImagePickerField
                  label="Facility 3 Photo"
                  value={f3Image}
                  onChange={(url) => setF3Image(url)}
                  placeholder="e.g. Cloudinary photo URL"
                />
              </div>

              <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                <InputField
                  label="Facility 4 Title"
                  value={f4Title}
                  onChange={(e) => setF4Title(e.target.value)}
                  placeholder="e.g. Knowledge Resource Center & Library"
                />
                <TextAreaField
                  label="Description"
                  value={f4Desc}
                  onChange={(e) => setF4Desc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Book catalog and reading pods..."
                />
                <ImagePickerField
                  label="Facility 4 Photo"
                  value={f4Image}
                  onChange={(url) => setF4Image(url)}
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
