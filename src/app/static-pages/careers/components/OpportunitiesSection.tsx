"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "@/components/SectionHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";

export function OpportunitiesSection({ initialData }: { initialData?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tagline, setTagline] = useState("");
  const [headline, setHeadline] = useState("");

  const [teachTitle, setTeachTitle] = useState("");
  const [teachDesc, setTeachDesc] = useState("");
  const [teachRoles, setTeachRoles] = useState("");

  const [adminTitle, setAdminTitle] = useState("");
  const [adminDesc, setAdminDesc] = useState("");
  const [adminRoles, setAdminRoles] = useState("");

  useEffect(() => {
    if (initialData) {
      setTagline(initialData.tagline ?? "CURRENT OPENINGS");
      setHeadline(initialData.headline ?? "Explore Opportunities by Domain");

      setTeachTitle(initialData.teachTitle ?? "Teaching Positions (Pre-Primary, PRT, TGT, PGT)");
      setTeachDesc(
        initialData.teachDesc ??
          "We invite passionate subject educators with strong command over CBSE pedagogy, innovative instructional habits, and empathetic classroom presence.",
      );
      setTeachRoles(
        initialData.teachRoles ??
          "PGT Physics/Chemistry/Maths/Biology, PGT Commerce/Economics, TGT English/Hindi, TGT Social Science, PRT All Subjects, Pre-Primary Educator, Physical Education Instructor, Fine Arts & Music Teacher",
      );

      setAdminTitle(initialData.adminTitle ?? "Administrative & Campus Support Roles");
      setAdminDesc(
        initialData.adminDesc ??
          "Operational excellence underpins every great school. We seek experienced professionals dedicated to seamless parent relations and campus logistics.",
      );
      setAdminRoles(
        initialData.adminRoles ??
          "Admissions Counselor, Academic Coordinator, Accountant / Fee In-charge, Front Office Executive, Science Lab Assistant, IT & Network Technician, Transport Supervisor",
      );
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        section: "OpportunitiesSection",
        content: {
          tagline,
          headline,
          teachTitle,
          teachDesc,
          teachRoles,
          adminTitle,
          adminDesc,
          adminRoles,
        },
      };

      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Opportunities section saved successfully!");
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
        title="4. Roles & Openings (Teaching vs Administration)"
        description="Configure listed roles across academic teaching domains and administrative school operations."
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
              placeholder="e.g. CURRENT OPENINGS"
            />
            <InputField
              label="Section Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Explore Opportunities by Domain"
            />
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-3">
              <InputField
                label="Teaching Domain Title"
                value={teachTitle}
                onChange={(e) => setTeachTitle(e.target.value)}
                placeholder="e.g. Teaching Positions (Pre-Primary, PRT, TGT, PGT)"
              />
              <TextAreaField
                label="Teaching Overview"
                value={teachDesc}
                onChange={(e) => setTeachDesc(e.target.value)}
                rows={2}
                placeholder="e.g. Description of teacher qualities..."
              />
              <TextAreaField
                label="Active Teaching Roles (Comma Separated)"
                value={teachRoles}
                onChange={(e) => setTeachRoles(e.target.value)}
                rows={2}
                placeholder="e.g. PGT Physics, TGT English, PRT Maths..."
              />
            </div>

            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-3">
              <InputField
                label="Administration Domain Title"
                value={adminTitle}
                onChange={(e) => setAdminTitle(e.target.value)}
                placeholder="e.g. Administrative & Campus Support Roles"
              />
              <TextAreaField
                label="Administration Overview"
                value={adminDesc}
                onChange={(e) => setAdminDesc(e.target.value)}
                rows={2}
                placeholder="e.g. Description of administrative expectations..."
              />
              <TextAreaField
                label="Active Administrative Roles (Comma Separated)"
                value={adminRoles}
                onChange={(e) => setAdminRoles(e.target.value)}
                rows={2}
                placeholder="e.g. Admissions Counselor, Accountant, Lab Assistant..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 w-full">
            <SaveButton onClick={handleSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
