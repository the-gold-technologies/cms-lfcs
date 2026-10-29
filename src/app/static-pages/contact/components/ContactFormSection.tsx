"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function ContactFormSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [heading, setHeading] = useState("");
  const [scriptAccent, setScriptAccent] = useState("");
  const [description, setDescription] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");

  useEffect(() => {
    if (initialData) {
      setHeading(initialData.heading ?? "");
      setScriptAccent(initialData.scriptAccent ?? "");
      setDescription(initialData.description ?? "");
      setPhone1(initialData.phone1 ?? "");
      setPhone2(initialData.phone2 ?? "");
      setEmail(initialData.email ?? "");
      setAddress(initialData.address ?? "");
      setHours(initialData.hours ?? "");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const payload = {
        section: "ContactFormSection",
        content: {
          heading,
          scriptAccent,
          description,
          phone1,
          phone2,
          email,
          address,
          hours,
        },
      };

      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Contact Details saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save contact info");
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
        title="2. Central Office & Contact Form Details"
        description="Official communication channels, head office address, operating hours, and general contact form."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          {/* Submissions Module Shortcut Banner */}
          <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#842b46] text-white">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">General Enquiries Submissions</p>
                <p className="text-[11px] text-gray-500">
                  Messages submitted by website visitors through the contact form are stored in
                  Submissions &gt; General Enquiries.
                </p>
              </div>
            </div>
            <Link
              href="/submissions/contact"
              className="px-4 py-2 bg-white text-[#842b46] text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-50 transition-all flex items-center gap-1.5"
            >
              View Enquiries <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Contact Details Heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="e.g. Get in"
            />
            <InputField
              label="Script Accent"
              value={scriptAccent}
              onChange={(e) => setScriptAccent(e.target.value)}
              placeholder="e.g. Touch"
            />
          </div>

          <TextAreaField
            label="Section Subtitle"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. Reach our central office directly, or send us a message and the right team will respond."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Primary Contact Number"
              value={phone1}
              onChange={(e) => setPhone1(e.target.value)}
              placeholder="e.g. +91 83688 38489"
            />
            <InputField
              label="Secondary Contact Number"
              value={phone2}
              onChange={(e) => setPhone2(e.target.value)}
              placeholder="e.g. +91 99999 76959"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Central Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. franchise@lfcsschools.com"
            />
            <InputField
              label="Operating Office Hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. Mon - Sat: 8:00 AM - 5:00 PM"
            />
          </div>

          <TextAreaField
            label="Central Registered Office Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            placeholder="e.g. B-1/142, Sector-G, Aliganj, Lucknow - 226024, Uttar Pradesh"
          />

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
