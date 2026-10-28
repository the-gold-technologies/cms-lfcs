"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

interface CapitalHead {
  title: string;
  desc: string;
  image: string;
}

export function InvestmentSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [heads, setHeads] = useState<CapitalHead[]>([]);

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "INFRASTRUCTURE & CAPITAL PLANNING");
      setHeadline(initialData.headline ?? "Planning the Resources for Your School");
      setSubtitle(
        initialData.subtitle ??
          "Capital allocation is phased to ensure fiscal sustainability, aligned with CBSE minimum campus norms and student intake velocity.",
      );

      if (Array.isArray(initialData.heads) && initialData.heads.length > 0) {
        setHeads(
          initialData.heads.map((h: any) => ({
            title: h.title ?? "",
            desc: h.desc ?? "",
            image: h.image ?? "",
          })),
        );
      } else {
        setHeads([
          {
            title: initialData.inv1Title ?? "Land & Site Acquisition",
            desc:
              initialData.inv1Desc ??
              "1.5 to 3+ acres with safe, accessible road connectivity, clear non-agricultural title, and playground space.",
            image:
              initialData.inv1Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170001/lfcs-school/Nizamuddinpura-Mau_1793169999785.webp",
          },
          {
            title: initialData.inv2Title ?? "Academic Building & Classrooms",
            desc:
              initialData.inv2Desc ??
              "Spacious, well-ventilated 500 sq.ft classrooms, administrative wing, staff rooms, and infirmary.",
            image:
              initialData.inv2Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170002/lfcs-school/Sikatia-Mau_1793170001648.webp",
          },
          {
            title: initialData.inv3Title ?? "Laboratories & Technology Integration",
            desc:
              initialData.inv3Desc ??
              "Physics, Chemistry, Biology, Mathematics, and Computer labs with digital interactive flat panels.",
            image:
              initialData.inv3Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170016/lfcs-school/computer-lab_1793170016129.webp",
          },
          {
            title: initialData.inv4Title ?? "Sports Complexes & Working Capital",
            desc:
              initialData.inv4Desc ??
              "Outdoor athletic field, basketball court, indoor games room, school buses, and preliminary operating reserve.",
            image:
              initialData.inv4Image ??
              "https://res.cloudinary.com/dpa93copz/image/upload/v1793170017/lfcs-school/sports1_1793170017007.webp",
          },
        ]);
      }
    }
  }, [initialData]);

  const handleAddHead = () => {
    setHeads((prev) => [
      ...prev,
      {
        title: "",
        desc: "",
        image: "",
      },
    ]);
  };

  const handleRemoveHead = (index: number) => {
    setHeads((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateHead = (index: number, field: keyof CapitalHead, val: string) => {
    setHeads((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "InvestmentSection",
        content: {
          tagline,
          headline,
          subtitle,
          heads, // dynamic array object!
          // Backward compatibility:
          inv1Title: heads[0]?.title ?? "",
          inv1Desc: heads[0]?.desc ?? "",
          inv1Image: heads[0]?.image ?? "",
          inv2Title: heads[1]?.title ?? "",
          inv2Desc: heads[1]?.desc ?? "",
          inv2Image: heads[1]?.image ?? "",
          inv3Title: heads[2]?.title ?? "",
          inv3Desc: heads[2]?.desc ?? "",
          inv3Image: heads[2]?.image ?? "",
          inv4Title: heads[3]?.title ?? "",
          inv4Desc: heads[3]?.desc ?? "",
          inv4Image: heads[3]?.image ?? "",
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
        toast.success("Investment & Resource Planning saved successfully!");
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
        title="7. Investment & Resource Planning"
        description="Outlines infrastructure requirements: Land acquisition, Civil construction, Laboratories, and Sports/Working capital."
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
              placeholder="e.g. INFRASTRUCTURE & CAPITAL PLANNING"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Planning the Resources for Your School"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            placeholder="e.g. Overview of phased capital outlay..."
          />

          {/* DYNAMIC CAPITAL HEADS ARRAY */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  Capital Allocation Heads ({heads.length})
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Phased infrastructure heads. Can add more than 4 heads.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddHead}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A60] hover:text-[#061C29] bg-[#0E5A60]/10 hover:bg-[#0E5A60]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Capital Head</span>
              </button>
            </div>

            {heads.length === 0 ? (
              <div
                onClick={handleAddHead}
                className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span>No allocation heads added yet. Click to add your first head.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {heads.map((head, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3.5 relative transition-all group"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                      <span className="text-xs font-bold text-[#0E5A60] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0E5A60]/10 flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Head #{idx + 1}: {head.title || "Untitled"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHead(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Head"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Row 1: Title */}
                    <InputField
                      label="Head Title"
                      value={head.title}
                      onChange={(e) => handleUpdateHead(idx, "title", e.target.value)}
                      placeholder="e.g. Land & Site Acquisition"
                    />

                    {/* Row 2: Description */}
                    <TextAreaField
                      label="Description"
                      value={head.desc}
                      onChange={(e) => handleUpdateHead(idx, "desc", e.target.value)}
                      rows={2}
                      placeholder="e.g. Land area requirements, title clearances..."
                    />

                    {/* Row 3: Image (full width) */}
                    <ImagePickerField
                      label="Head Photo / Visual"
                      value={head.image}
                      onChange={(url) => handleUpdateHead(idx, "image", url)}
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
