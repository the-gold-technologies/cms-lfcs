"use client";

import React, { useState, useEffect } from "react";
import {
  Share2,
  Image as ImageIcon,
  FileText,
  Compass,
  Info,
  Loader2,
  Layers,
  Sparkles,
  Link2,
  Plus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { CollapsibleCard } from "@/components/CollapsibleCard";

interface FooterLink {
  label: string;
  url: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export default function SocialMediaFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Section 1: Logos & Branding
  const [headerLogo, setHeaderLogo] = useState("");
  const [footerLogo, setFooterLogo] = useState("");
  const [brandTitle, setBrandTitle] = useState("");
  const [brandSubtitle, setBrandSubtitle] = useState("");

  // Section 2: Footer Details & Contact Information
  const [footerDescription, setFooterDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");
  const [email, setEmail] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [copyrightText, setCopyrightText] = useState("");

  // Section 3: Centralized Social Media Links
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Section 4: Footer Link Columns
  const [footerColumns, setFooterColumns] = useState<FooterColumn[]>([]);
  const [openColIndices, setOpenColIndices] = useState<number[]>([0]);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/seo/global");
        const json = await res.json();
        if (json.success && json.data) {
          const cfg = json.data;
          const s = (cfg.socialLinks as Record<string, any>) || {};

          // Section 1: Logos & Branding
          setHeaderLogo(cfg.logo || "");
          setFooterLogo(s.footerLogo || "");
          setBrandTitle(s.brandTitle || "");
          setBrandSubtitle(s.brandSubtitle || "");

          // Section 2: Footer & Contact
          setFooterDescription(cfg.siteDescription || "");
          setAddress(cfg.address || "");
          setPhone(cfg.phone || "");
          setPhone2(s.phone2 || "");
          setEmail(cfg.email || "");
          setOperatingHours(s.operatingHours || "");
          setCopyrightText(s.copyrightText || "");

          // Section 3: Social Media
          setFacebookUrl(cfg.facebookUrl || "");
          setInstagramUrl(cfg.instagramUrl || "");
          setYoutubeUrl(cfg.youtubeUrl || "");
          setLinkedinUrl(cfg.linkedinUrl || "");
          setTwitter(s.twitter || "");
          setWhatsapp(s.whatsapp || "");

          // Section 4: Footer Link Columns
          setFooterColumns(
            Array.isArray(s.footerColumns)
              ? s.footerColumns.map((c: any) => ({
                  title: c.title ?? "",
                  links: Array.isArray(c.links)
                    ? c.links.map((l: any) => ({ label: l.label ?? "", url: l.url ?? "" }))
                    : [],
                }))
              : [],
          );
        }
      } catch (err) {
        console.error("Failed to load footer & social config:", err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const updateColumn = (colIdx: number, update: (col: FooterColumn) => FooterColumn) => {
    setFooterColumns((prev) => prev.map((c, i) => (i === colIdx ? update(c) : c)));
  };

  const handleAddColumn = () => {
    const newIdx = footerColumns.length;
    setFooterColumns((prev) => [...prev, { title: "", links: [] }]);
    setOpenColIndices((prev) => [...prev, newIdx]);
  };

  const handleRemoveColumn = (colIdx: number) => {
    setFooterColumns((prev) => prev.filter((_, i) => i !== colIdx));
    setOpenColIndices((prev) =>
      prev.filter((i) => i !== colIdx).map((i) => (i > colIdx ? i - 1 : i)),
    );
  };

  const toggleColumn = (idx: number) => {
    setOpenColIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const updateFooterLink = (
    colIdx: number,
    linkIdx: number,
    field: keyof FooterLink,
    val: string,
  ) => {
    updateColumn(colIdx, (c) => ({
      ...c,
      links: c.links.map((l, i) => (i === linkIdx ? { ...l, [field]: val } : l)),
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const payload = {
        logo: headerLogo,
        siteDescription: footerDescription,
        address,
        phone,
        email,
        facebookUrl,
        instagramUrl,
        youtubeUrl,
        linkedinUrl: linkedinUrl || "",
        socialLinks: {
          footerLogo,
          brandTitle,
          brandSubtitle,
          phone2,
          operatingHours,
          copyrightText,
          twitter,
          whatsapp,
          footerColumns,
        },
      };

      const res = await fetch("/api/seo/global", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        setSaved(true);
        toast.success("Social Media, Brand Logos & Footer settings saved successfully!");
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(json.error || "Failed to save settings");
      }
    } catch (err: any) {
      console.error("Error saving brand config:", err);
      toast.error(err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 pb-20 w-full max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#842b46] flex items-center justify-center font-bold shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Social Media &amp; Footer Branding
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 font-medium pl-13">
          Manage header and footer brand emblems, school titles, telephone helplines, location,
          operating schedule, and centralized social media links.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#842b46] animate-spin" />
          <p className="text-xs font-semibold text-gray-500">
            Loading brand &amp; footer settings...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-8 w-full">
          {/* Section 1: Logos & Branding */}
          <div className="w-full border border-gray-100 rounded-3xl bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center gap-3.5 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#842b46] flex items-center justify-center font-bold">
                <ImageIcon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                  1. Website Branding &amp; Logos
                </h3>
                <p className="text-xs text-gray-500">
                  Configure website header navigation logo, footer brand emblem, and brand title.
                </p>
              </div>
            </div>

            {/* Brand Title and Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Footer Brand Title"
                value={brandTitle}
                onChange={(e) => setBrandTitle(e.target.value)}
                placeholder="Little Flower"
                helperText="Primary brand heading displayed next to the footer emblem."
              />
              <InputField
                label="Footer Brand Subtitle / Tagline"
                value={brandSubtitle}
                onChange={(e) => setBrandSubtitle(e.target.value)}
                placeholder="Group of Schools"
                helperText="Uppercase subtitle displayed below the brand title in the footer."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Header / Navbar Logo */}
              <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#842b46]" />
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    Website / Header Logo
                  </span>
                </div>
                <ImagePickerField
                  label="Navbar Brand Logo"
                  value={headerLogo}
                  onChange={(url) => setHeaderLogo(url)}
                  folder="lfcs-school/brand"
                  placeholder="/logo-header.webp"
                  helperText="Displayed in the top navigation header across all pages."
                />
              </div>

              {/* Footer Logo */}
              <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#dfae19]" />
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    Footer Brand Logo
                  </span>
                </div>
                <ImagePickerField
                  label="Footer Crest / Emblem"
                  value={footerLogo}
                  onChange={(url) => setFooterLogo(url)}
                  folder="lfcs-school/brand"
                  placeholder="/logo1.webp"
                  helperText="Prominently displayed in the website footer brand column (70x70)."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Footer Details & Contact Information */}
          <div className="w-full border border-gray-100 rounded-3xl bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center gap-3.5 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#dfae19] flex items-center justify-center font-bold">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                  2. Footer Details &amp; Helplines
                </h3>
                <p className="text-xs text-gray-500">
                  Mission narrative, telephone helplines, official emails, campus address, and
                  operating schedule.
                </p>
              </div>
            </div>

            {/* Footer Narrative */}
            <div>
              <TextAreaField
                label="Footer Brand Narrative / Mission Statement"
                value={footerDescription}
                onChange={(e) => setFooterDescription(e.target.value)}
                rows={3}
                placeholder="A network of CBSE schools committed to academic excellence, character building and holistic development."
                helperText="Short narrative displayed directly beneath the footer logo in the left column."
              />
            </div>

            {/* Address, Phone, Phone2, Email Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <InputField
                  label="Footer Location / Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Lucknow, Uttar Pradesh"
                  helperText="Matches the location pin in the footer contact strip."
                />
              </div>

              <div className="space-y-1">
                <InputField
                  label="Official Inquiry / Franchise Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. franchise@lfcsschools.com"
                  helperText="Official email displayed in the footer contact bar."
                />
              </div>

              <div className="space-y-1">
                <InputField
                  label="Primary Helpline Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 83688 38489"
                  helperText="First phone number in the footer contact strip."
                />
              </div>

              <div className="space-y-1">
                <InputField
                  label="Secondary Helpline Phone"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  placeholder="e.g. +91 99999 76959"
                  helperText="Second phone number in the footer contact strip."
                />
              </div>

              <div className="space-y-1">
                <InputField
                  label="Operating / Office Hours"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  placeholder="e.g. Mon - Sat: 8:00 AM - 5:00 PM"
                  helperText="Office timings displayed next to the clock icon in the footer."
                />
              </div>

              <div className="space-y-1">
                <InputField
                  label="Footer Copyright Notice"
                  value={copyrightText}
                  onChange={(e) => setCopyrightText(e.target.value)}
                  placeholder="© 2026 Little Flower Group of Schools. All rights reserved."
                  helperText="Displayed in the bottom sub-bar of the website footer."
                />
              </div>
            </div>
          </div>

          {/* Section 3: Centralized Social Media Channels */}
          <div className="w-full border border-gray-100 rounded-3xl bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center gap-3.5 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Share2 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                  3. Centralized Social Media Profiles
                </h3>
                <p className="text-xs text-gray-500">
                  Single source of truth for all social channels displayed across the entire
                  website.
                </p>
              </div>
            </div>

            {/* Centralized Hub Info Banner */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/60 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#842b46] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-[#842b46]">Centralized Hub: </span>
                All social media icons across the website (Header, Footer, and Contact page) read
                directly from these links. Updating a profile here will keep all pages in sync.
              </p>
            </div>

            {/* Social Media Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Facebook */}
              <div className="space-y-1">
                <InputField
                  label="Facebook Page URL"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://www.facebook.com/people/LFCS-Schools/..."
                />
              </div>

              {/* Instagram */}
              <div className="space-y-1">
                <InputField
                  label="Instagram Profile URL"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://www.instagram.com/lfcs_schools/"
                />
              </div>

              {/* YouTube */}
              <div className="space-y-1">
                <InputField
                  label="YouTube Channel URL"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/@lfcsschools?si=..."
                />
              </div>

              {/* LinkedIn */}
              <div className="space-y-1">
                <InputField
                  label="LinkedIn Institution URL"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/school/lfcs"
                />
              </div>

              {/* Twitter / X */}
              <div className="space-y-1">
                <InputField
                  label="Twitter / X Profile URL"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://x.com/lfcs_schools"
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-1">
                <InputField
                  label="WhatsApp Helpline / Chat Link"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+91 94508 24500 or https://wa.me/..."
                />
              </div>
            </div>
          </div>

          {/* Section 4: Footer Link Columns */}
          <div className="w-full border border-gray-100 rounded-3xl bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0a192f] flex items-center justify-center font-bold shrink-0">
                  <Link2 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                      4. Footer Link Columns
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800">
                      {footerColumns.length} {footerColumns.length === 1 ? "Column" : "Columns"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Headed link lists shown in the website footer (e.g. Quick Links, Admissions).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                {footerColumns.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (openColIndices.length === footerColumns.length) {
                        setOpenColIndices([]);
                      } else {
                        setOpenColIndices(footerColumns.map((_, i) => i));
                      }
                    }}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {openColIndices.length === footerColumns.length ? "Collapse All" : "Expand All"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddColumn}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#842b46] hover:text-[#0a192f] bg-[#842b46]/10 hover:bg-[#842b46]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Column</span>
                </button>
              </div>
            </div>

            {footerColumns.length === 0 ? (
              <div
                onClick={handleAddColumn}
                className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 hover:border-[#842b46] hover:text-[#842b46] transition-colors cursor-pointer text-xs font-medium flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-300" />
                <span>No footer columns added yet. Click to add your first column.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {footerColumns.map((col, colIdx) => (
                  <CollapsibleCard
                    key={colIdx}
                    index={colIdx}
                    title={col.title || `Column ${colIdx + 1}`}
                    badge={`${col.links.length} ${col.links.length === 1 ? "Link" : "Links"}`}
                    isOpen={openColIndices.includes(colIdx)}
                    onToggle={() => toggleColumn(colIdx)}
                    onDelete={() => handleRemoveColumn(colIdx)}
                    deleteTitle="Remove Column"
                  >
                    <div className="space-y-4">
                      <InputField
                        label={`Column ${colIdx + 1} Heading`}
                        value={col.title}
                        onChange={(e) =>
                          updateColumn(colIdx, (c) => ({ ...c, title: e.target.value }))
                        }
                        placeholder="e.g. Quick Links, Useful Links, Admissions"
                      />

                      <div className="space-y-3 pt-1 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            Links ({col.links.length})
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              updateColumn(colIdx, (c) => ({
                                ...c,
                                links: [...c.links, { label: "", url: "" }],
                              }))
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#842b46] hover:text-[#0a192f] bg-[#842b46]/10 hover:bg-[#842b46]/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Link</span>
                          </button>
                        </div>

                        {col.links.length === 0 ? (
                          <div
                            onClick={() =>
                              updateColumn(colIdx, (c) => ({
                                ...c,
                                links: [{ label: "", url: "" }],
                              }))
                            }
                            className="p-4 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            + Click to add your first link to this column
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {col.links.map((link, linkIdx) => (
                              <div
                                key={linkIdx}
                                className="flex items-end gap-2.5 bg-gray-50/70 p-2.5 rounded-xl border border-gray-200/60"
                              >
                                <div className="flex-1">
                                  <InputField
                                    label="Link Label"
                                    value={link.label}
                                    onChange={(e) =>
                                      updateFooterLink(colIdx, linkIdx, "label", e.target.value)
                                    }
                                    placeholder="e.g. About Us"
                                  />
                                </div>
                                <div className="flex-1">
                                  <InputField
                                    label="Link URL"
                                    value={link.url}
                                    onChange={(e) =>
                                      updateFooterLink(colIdx, linkIdx, "url", e.target.value)
                                    }
                                    placeholder="e.g. /about"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateColumn(colIdx, (c) => ({
                                      ...c,
                                      links: c.links.filter((_, i) => i !== linkIdx),
                                    }))
                                  }
                                  className="mb-1 p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                                  title="Remove Link"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleCard>
                ))}
              </div>
            )}
          </div>

          {/* Full-Width Save Bar at Bottom */}
          <div className="pt-2">
            <SaveButton
              loading={saving}
              saved={saved}
              onClick={handleSave}
              label="Save All Social Media &amp; Brand Settings"
              className="w-full py-4 text-sm font-bold shadow-md hover:shadow-lg"
            />
          </div>
        </form>
      )}
    </section>
  );
}
