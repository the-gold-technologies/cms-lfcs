"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { Image as ImageIcon, ExternalLink, Sparkles, FolderKanban } from "lucide-react";

const CATEGORIES = [
  "Campus & Facilities",
  "Classrooms",
  "Science Labs",
  "Early Years",
  "Sports & Fitness",
  "Arts & Culture",
  "Events & Achievements",
];

export function GalleryCurateSection() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100">
      <SectionHeader
        title="2. Photo Gallery Curation & Album Manager"
        description="Manage the live campus photo stream across all 7 departments. Upload, categorize, add captions, and organize photos with auto-compression."
        badge="Interactive Album"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="p-5 bg-gradient-to-br from-teal-50/60 to-emerald-50/30 rounded-2xl border border-teal-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white border border-teal-200/60 flex items-center justify-center text-[#0E5A60] shadow-xs shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  Campus Photo Collection
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0E5A60] text-white">
                    7 Albums
                  </span>
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Curate photos, assign categories, and manage Cloudinary storage assets.
                </p>
              </div>
            </div>

            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E5A60] hover:bg-[#0A4347] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
            >
              <span>Open Photo Manager</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CATEGORIES.map((cat, idx) => (
              <Link
                key={cat}
                href={`/gallery`}
                className="p-3.5 bg-gray-50/70 hover:bg-white rounded-xl border border-gray-100 hover:border-teal-200 transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-400 font-mono">0{idx + 1}</span>
                  <FolderKanban className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#0E5A60] transition-colors" />
                </div>
                <p className="text-xs font-bold text-gray-800 group-hover:text-[#0E5A60] transition-colors leading-snug">
                  {cat}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

