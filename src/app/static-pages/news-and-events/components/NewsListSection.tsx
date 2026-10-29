"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function NewsListSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [marqueeTag, setMarqueeTag] = useState("");
  const [marqueeCount, setMarqueeCount] = useState("");
  const [outletsList, setOutletsList] = useState("");

  useEffect(() => {
    if (initialData) {
      setMarqueeTag(initialData.marqueeTag ?? "");
      setMarqueeCount(initialData.marqueeCount ?? "");
      setOutletsList(
        Array.isArray(initialData.outlets)
          ? initialData.outlets.join(", ")
          : (initialData.outletsList ?? ""),
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const outletsArray = outletsList
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        section: "NewsListSection",
        content: {
          marqueeTag,
          marqueeCount,
          outlets: outletsArray,
          outletsList,
        },
      };

      const res = await fetch("/api/news-and-events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("News list configuration saved successfully!");
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
        title="2. Press Coverage Marquee & Stories Stream"
        description="Ticker banner featuring covered news outlets and direct link to the stories management module."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          {/* News Module Shortcut Banner */}
          <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#842b46] text-white">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Dynamic News Articles & Lead Story</p>
                <p className="text-[11px] text-gray-500">
                  Individual news articles, headlines, excerpts, press photos, and external article URLs are managed in the News & Media module.
                </p>
              </div>
            </div>
            <Link
              href="/news"
              className="px-4 py-2 bg-white text-[#842b46] text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-50 transition-all flex items-center gap-1.5"
            >
              Manage Stories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Marquee Eyebrow Tag"
              value={marqueeTag}
              onChange={(e) => setMarqueeTag(e.target.value)}
              placeholder="e.g. As Covered By"
            />
            <InputField
              label="Outlets Counter Label"
              value={marqueeCount}
              onChange={(e) => setMarqueeCount(e.target.value)}
              placeholder="e.g. 100+ media outlets"
            />
          </div>

          <TextAreaField
            label="Media Outlets (Comma Separated)"
            value={outletsList}
            onChange={(e) => setOutletsList(e.target.value)}
            rows={3}
            placeholder="e.g. Times of India, Dailyhunt, Loktej English, UP 18 News, Hindustan Metro, Dainik Jagran, Amar Ujala, Live Hindustan, Navbharat Times"
            helperText="Enter media outlets separated by commas. Each item will scroll smoothly in the press marquee ticker."
          />

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}

