"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import toast from "react-hot-toast";

export default function SocialMediaPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/seo/global");
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setPhone(d.phone || "");
          setEmail(d.email || "");
          setAddress(d.address || "");
          setFacebookUrl(d.facebookUrl || "");
          setInstagramUrl(d.instagramUrl || "");
          setYoutubeUrl(d.youtubeUrl || "");
          setLinkedinUrl(d.linkedinUrl || "");
        }
      } catch {
        toast.error("Failed to load contact info");
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/seo/global", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          email,
          address,
          facebookUrl,
          instagramUrl,
          youtubeUrl,
          linkedinUrl,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Contact channels & social media updated!");
      } else {
        toast.error(json.error || "Save failed");
      }
    } catch {
      toast.error("Network error while saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-16">
      <PageHeader
        title="Social Media & Brand Channels"
        description="Manage central school telephone helplines, official emails, postal address, and social links."
      />

      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Central Helpline Phone *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter contact number with country code..."
            required
          />
          <InputField
            label="Central Inquiry Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter central email address..."
            required
          />
        </div>

        <TextAreaField
          label="Central Headquarters Address *"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter complete postal address of central administration..."
          rows={3}
          required
        />

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Official Social Media Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Facebook Page URL"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/your-page"
            />
            <InputField
              label="Instagram Profile URL"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/your-handle"
            />
            <InputField
              label="YouTube Channel URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/@your-channel"
            />
            <InputField
              label="LinkedIn Page URL"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/company/your-organization"
            />
          </div>
        </div>

        <div className="pt-2 w-full">
          <SaveButton loading={saving} label="Save Social & Contact Info" />
        </div>
      </form>
    </div>
  );
}
