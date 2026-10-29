"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { GraduationCap, ArrowRight, Plus } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleCard } from "@/components/CollapsibleCard";

export interface PrincipalItem {
  name: string;
  school: string;
  city: string;
  image: string;
}

export function FacultySection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [principals, setPrincipals] = useState<PrincipalItem[]>([]);
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "");
      setHeadline(initialData.headline ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setSubtitle(initialData.subtitle ?? "");

      if (Array.isArray(initialData.principals)) {
        setPrincipals(
          initialData.principals.map((p: any) => ({
            name: p.name ?? "",
            school: p.school ?? "",
            city: p.city ?? "",
            image: p.image ?? p.img ?? "",
          })),
        );
      } else {
        setPrincipals([]);
      }
    }
  }, [initialData]);

  const handleAddPrincipal = () => {
    setPrincipals((prev) => [
      ...prev,
      {
        name: "",
        school: "",
        city: "",
        image: "",
      },
    ]);
    setOpenIndices((prev) => [...prev, principals.length]);
  };

  const handleRemovePrincipal = (index: number) => {
    setPrincipals((prev) => prev.filter((_, i) => i !== index));
    setOpenIndices((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const handleUpdatePrincipal = (
    index: number,
    field: keyof PrincipalItem,
    value: string,
  ) => {
    setPrincipals((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "FacultySection",
        content: {
          tagline,
          headline,
          scriptAccent,
          subtitle,
          principals,
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
        toast.success("Faculty & Principals section saved successfully!");
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
        title="5. Academic Leadership & School Principals"
        description="Showcase campus principals with names, schools, locations, and photographs."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          {/* Campuses module notice */}
          <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0E5A60] text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Branch Principals & Campuses Directory</p>
                <p className="text-[11px] text-gray-500">
                  Principal profiles, branch designations, and leadership details can also be inspected in the Campuses module.
                </p>
              </div>
            </div>
            <Link
              href="/campuses"
              className="px-4 py-2 bg-white text-[#0E5A60] text-xs font-bold rounded-xl border border-teal-200 hover:bg-teal-50 transition-all flex items-center gap-1.5"
            >
              Campuses Module <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Pre-Heading Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. OUR FACULTY"
            />
            <InputField
              label="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Meet Our School"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Principals"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Each Little Flower campus is led by an experienced principal..."
          />

          {/* DYNAMIC PRINCIPALS LIST */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  School Principals ({principals.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Manage principal names, campus affiliations, cities, and portraits.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPrincipal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0E5A60] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Principal</span>
              </button>
            </div>

            {principals.length === 0 ? (
              <div
                onClick={handleAddPrincipal}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#0E5A60] hover:text-[#0E5A60] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No principals added yet. Click to add the first principal.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {principals.map((principal, idx) => (
                  <CollapsibleCard
                    key={idx}
                    index={idx}
                    title={`Principal ${idx + 1}: ${principal.name || "Untitled Principal"}`}
                    thumbnail={principal.image}
                    isOpen={openIndices.includes(idx)}
                    onToggle={() =>
                      setOpenIndices((prev) =>
                        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                      )
                    }
                    onDelete={() => handleRemovePrincipal(idx)}
                    deleteTitle="Delete Principal"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <InputField
                        label="Principal Name"
                        value={principal.name}
                        onChange={(e) => handleUpdatePrincipal(idx, "name", e.target.value)}
                        placeholder="e.g. Sarita Kedia"
                      />
                      <InputField
                        label="School / Campus Name"
                        value={principal.school}
                        onChange={(e) => handleUpdatePrincipal(idx, "school", e.target.value)}
                        placeholder="e.g. LFCS, Nizamuddinpura"
                      />
                      <InputField
                        label="City / Location"
                        value={principal.city}
                        onChange={(e) => handleUpdatePrincipal(idx, "city", e.target.value)}
                        placeholder="e.g. Mau"
                      />
                    </div>

                    <ImagePickerField
                      label="Principal Photo"
                      value={principal.image}
                      onChange={(url) => handleUpdatePrincipal(idx, "image", url)}
                      placeholder="e.g. Cloudinary image URL"
                      folder="lfcs-school/academics"
                    />
                  </CollapsibleCard>
                ))}
              </div>
            )}
          </div>

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
