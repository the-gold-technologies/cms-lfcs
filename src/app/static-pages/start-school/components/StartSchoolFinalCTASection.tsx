"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Handshake, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

export function StartSchoolFinalCTASection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [heading, setHeading] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    if (initialData) {
      setHeading(initialData.heading ?? "");
      setButtonText(initialData.buttonText ?? "");
      setContactEmail(initialData.contactEmail ?? "");
      setBgImage(initialData.bgImage ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "StartSchoolFinalCTASection",
        content: {
          heading,
          buttonText,
          contactEmail,
          bgImage,
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
        toast.success("Final CTA section saved successfully!");
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
        title="9. Franchise Partnership Final Proposal CTA"
        description="Bottom banner inviting investors and educators to submit an associate partnership proposal."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          {/* Submissions module notice */}
          <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0E5A60] text-white">
                <Handshake className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Franchise & Partner Inquiries Inbox</p>
                <p className="text-[11px] text-gray-500">
                  Investor and institutional enquiries submitted via the website modal are captured in Submissions -&gt; Start a School.
                </p>
              </div>
            </div>
            <Link
              href="/submissions/start-school"
              className="px-4 py-2 bg-white text-[#0E5A60] text-xs font-bold rounded-xl border border-teal-200 hover:bg-teal-50 transition-all flex items-center gap-1.5"
            >
              View Proposals <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <InputField
            label="Banner Heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="e.g. Build a School With a Shared Educational Purpose"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Modal Trigger Button Text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="e.g. Submit Your Enquiry"
            />
            <InputField
              label="Contact / Franchise Inquiry Email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="e.g. franchise@lfcsschools.com"
            />
          </div>

          <ImagePickerField
            label="Banner Visual Graphic"
            value={bgImage}
            onChange={(url) => setBgImage(url)}
            placeholder="e.g. Cloudinary image URL"
            folder="lfcs-school/start-school"
          />

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
