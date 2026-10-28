"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { Plus, Trash2 } from "lucide-react";

export interface FacilityCard {
  title: string;
  desc: string;
  image: string;
}

export function AcademicFacilitiesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");

  const [facilities, setFacilities] = useState<FacilityCard[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "CAMPUS INFRASTRUCTURE");
      setHeadline(initialData.headline ?? "Modern Academic Facilities");

      if (Array.isArray(initialData.facilities) && initialData.facilities.length > 0) {
        setFacilities(
          initialData.facilities.map((f: any) => ({
            title: f.title ?? "",
            desc: f.desc ?? f.description ?? "",
            image: f.image ?? "",
          })),
        );
      } else {
        setFacilities([
          {
            title: initialData.f1Title ?? "Smart / Digital Classrooms",
            desc:
              initialData.f1Desc ??
              "Interactive flat panels, multimedia audio-visual aids, and high-speed broadband supporting dynamic visual learning.",
            image:
              initialData.f1Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170019/lfcs-school/digital-classroom_1793170018820.webp",
          },
          {
            title: initialData.f2Title ?? "Advanced Science Laboratories",
            desc:
              initialData.f2Desc ??
              "Fully equipped Physics, Chemistry, and Biology laboratories adhering strictly to CBSE safety guidelines.",
            image:
              initialData.f2Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170032/lfcs-school/Experience4_1793170032205.webp",
          },
          {
            title: initialData.f3Title ?? "High-Tech Computer Labs",
            desc:
              initialData.f3Desc ??
              "Modern terminals with coding IDEs, AI workstations, robotics kits, and digital literacy modules.",
            image:
              initialData.f3Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170016/lfcs-school/computer-lab_1793170016129.webp",
          },
          {
            title: initialData.f4Title ?? "Knowledge Resource Center & Library",
            desc:
              initialData.f4Desc ??
              "Vast catalog of 10,000+ fiction, reference volumes, periodicals, and quiet reading pods.",
            image:
              initialData.f4Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170015/lfcs-school/library_1793170015178.webp",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddFacility = () => {
    setFacilities((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
        image: "",
      },
    ]);
  };

  const handleRemoveFacility = (index: number) => {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateFacility = (index: number, field: keyof FacilityCard, value: string) => {
    setFacilities((prev) => {
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
        section: "AcademicFacilitiesSection",
        content: {
          tagline,
          headline,
          facilities, // Array object!
          // Backward compatibility:
          f1Title: facilities[0]?.title ?? "",
          f1Desc: facilities[0]?.desc ?? "",
          f1Image: facilities[0]?.image ?? "",
          f2Title: facilities[1]?.title ?? "",
          f2Desc: facilities[1]?.desc ?? "",
          f2Image: facilities[1]?.image ?? "",
          f3Title: facilities[2]?.title ?? "",
          f3Desc: facilities[2]?.desc ?? "",
          f3Image: facilities[2]?.image ?? "",
          f4Title: facilities[3]?.title ?? "",
          f4Desc: facilities[3]?.desc ?? "",
          f4Image: facilities[3]?.image ?? "",
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
        toast.success("Academic Facilities section saved successfully!");
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
        title="7. Academic Facilities & Modern Infrastructure"
        description="Showcase smart classrooms, specialized science labs, computer labs, knowledge library, and more."
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

          {/* DYNAMIC FACILITIES ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Featured Academic Facilities ({facilities.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Infrastructure facilities and modern learning spaces. Can add more than 4 facilities.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFacility}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Facility</span>
              </button>
            </div>

            {facilities.length === 0 ? (
              <div
                onClick={handleAddFacility}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No facilities added yet. Click to add your first facility.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {facilities.map((facility, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3.5 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Facility #{idx + 1}: {facility.title || "Untitled Facility"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFacility(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Facility"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <InputField
                      label="Facility Title"
                      value={facility.title}
                      onChange={(e) => handleUpdateFacility(idx, "title", e.target.value)}
                      placeholder="e.g. Smart / Digital Classrooms"
                    />

                    <TextAreaField
                      label="Description"
                      value={facility.desc}
                      onChange={(e) => handleUpdateFacility(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Digital learning features and modern AV aids..."
                    />

                    <ImagePickerField
                      label="Facility Photo"
                      value={facility.image}
                      onChange={(url) => handleUpdateFacility(idx, "image", url)}
                      placeholder="e.g. Cloudinary photo URL"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
