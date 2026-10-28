"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function ContactFormSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");

  useEffect(() => {
    if (initialData) {
      setPhone1(initialData.phone1 ?? "+91 83688 38489");
      setPhone2(initialData.phone2 ?? "+91 99999 76959");
      setEmail(initialData.email ?? "franchise@lfcsschools.com");
      setAddress(
        initialData.address ?? "B-1/142, Sector-G, Aliganj, Lucknow - 226024, Uttar Pradesh",
      );
      setHours(initialData.hours ?? "Mon - Sat: 8:00 AM - 5:00 PM");
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "ContactFormSection",
        content: {
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
    } catch (err: any) {
      toast.error(err?.message || "Network error while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6">
      <SectionHeader
        title="2. Head Office Contact Details & Timings"
        description="Public phone lines, email address, Lucknow head office location, and operating hours."
        badge="Live Section"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Primary Phone Number"
              value={phone1}
              onChange={(e) => setPhone1(e.target.value)}
              placeholder="e.g. +91 83688 38489"
            />
            <InputField
              label="Secondary Phone Number"
              value={phone2}
              onChange={(e) => setPhone2(e.target.value)}
              placeholder="e.g. +91 99999 76959"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Official Contact Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. franchise@lfcsschools.com"
            />
            <InputField
              label="Office Operating Hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. Mon - Sat: 8:00 AM - 5:00 PM"
            />
          </div>

          <TextAreaField
            label="Head Office Physical Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            placeholder="e.g. B-1/142, Sector-G, Aliganj, Lucknow - 226024, Uttar Pradesh"
          />

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
