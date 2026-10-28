"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import toast from "react-hot-toast";

export default function GlobalSeoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [favicon, setFavicon] = useState("");
  const [logo, setLogo] = useState("");
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [gtmId, setGtmId] = useState("");
  const [searchConsoleId, setSearchConsoleId] = useState("");
  const [robotsTxt, setRobotsTxt] = useState("");

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/seo/global");
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setSiteTitle(d.siteTitle || "");
          setSiteDescription(d.siteDescription || "");
          setFavicon(d.favicon || "");
          setLogo(d.logo || "");
          setGoogleAnalyticsId(d.googleAnalyticsId || "");
          setGtmId(d.gtmId || "");
          setSearchConsoleId(d.searchConsoleId || "");
          setRobotsTxt(d.robotsTxt || "");
        }
      } catch {
        toast.error("Failed to load SEO configuration");
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
          siteTitle,
          siteDescription,
          favicon,
          logo,
          googleAnalyticsId,
          gtmId,
          searchConsoleId,
          robotsTxt,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Global SEO settings saved and revalidated!");
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
        title="Global SEO & Tracking"
        description="Configure default meta titles, site description, favicon, Google Analytics GA4, and Google Tag Manager."
      />

      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs space-y-6"
      >
        <InputField
          label="Default Website Title *"
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
          placeholder="Enter default site title..."
          required
        />

        <TextAreaField
          label="Default Meta Description *"
          value={siteDescription}
          onChange={(e) => setSiteDescription(e.target.value)}
          placeholder="Enter default meta description for search engines..."
          rows={3}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ImagePickerField
            label="Website Logo"
            value={logo}
            onChange={setLogo}
            folder="lfcs-school/brand"
          />
          <ImagePickerField
            label="Browser Favicon / App Icon"
            value={favicon}
            onChange={setFavicon}
            folder="lfcs-school/brand"
          />
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Analytics & Search Console</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Google Analytics GA4 ID"
              value={googleAnalyticsId}
              onChange={(e) => setGoogleAnalyticsId(e.target.value)}
              placeholder="e.g. G-XXXXXXXXXX"
            />
            <InputField
              label="Google Tag Manager (GTM) ID"
              value={gtmId}
              onChange={(e) => setGtmId(e.target.value)}
              placeholder="e.g. GTM-XXXXXXX"
            />
            <InputField
              label="Google Search Console Token"
              value={searchConsoleId}
              onChange={(e) => setSearchConsoleId(e.target.value)}
              placeholder="e.g. google-site-verification=..."
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <TextAreaField
            label="Robots.txt Directives"
            value={robotsTxt}
            onChange={(e) => setRobotsTxt(e.target.value)}
            placeholder="Enter robots.txt directives..."
            rows={4}
          />
        </div>

        <div className="pt-2 max-w-xs">
          <SaveButton loading={saving} label="Save SEO Settings" />
        </div>
      </form>
    </div>
  );
}
