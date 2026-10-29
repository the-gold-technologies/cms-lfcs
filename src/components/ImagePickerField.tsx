"use client";

import React, { useState, useRef } from "react";
import {
  CloudUpload,
  Link as LinkIcon,
  X,
  Loader2,
  Check,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

interface ImagePickerFieldProps {
  label?: string;
  value?: string | null;
  values?: string[]; // for multiple images mode
  multiple?: boolean;
  onChange?: (value: string) => void;
  onChangeMultiple?: (values: string[]) => void;
  helperText?: string;
  tooltip?: string;
  placeholder?: string;
  folder?: string;
}

export function ImagePickerField({
  label = "Upload Image",
  value = "",
  values = [],
  multiple = false,
  onChange,
  onChangeMultiple,
  helperText,
  tooltip,
  placeholder = "https://... or upload from computer",
  folder = "lfcs-school",
}: ImagePickerFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File size too large (maximum 15MB)");
      return;
    }

    setUploading(true);
    const toastId = toast.loading(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        if (multiple) {
          onChangeMultiple?.([...values, json.url]);
        } else {
          onChange?.(json.url);
        }
        const sizeMsg = json.sizeKb ? ` (${json.originalSizeKb} KB → ${json.sizeKb} KB WebP)` : "";
        toast.success(`Image uploaded as WebP!${sizeMsg}`, { id: toastId });
      } else {
        toast.error(json.error || "Failed to upload image", { id: toastId });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err?.message || "Network error uploading image", { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const hasImage = Boolean(value && value.trim().length > 0);

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Field Top Bar */}
      <div className="flex items-center justify-between w-full">
        <label className="text-xs font-bold text-slate-800 tracking-wide flex items-center gap-1.5">
          {label}
          {tooltip && (
            <div className="group relative flex items-center">
              <HelpCircle className="w-3.5 h-3.5 cursor-help text-slate-400 hover:text-slate-600 transition-colors" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[280px] px-3 py-1.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 normal-case font-normal text-center leading-relaxed">
                {tooltip}
              </div>
            </div>
          )}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#002B5C] hover:text-[#6a2238] font-semibold cursor-pointer transition-colors"
        >
          {showUrlInput ? "Upload File" : "Enter Image URL"}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />

      {/* URL Direct Input (if toggled) */}
      {showUrlInput && (
        <div className="flex gap-2 items-center w-full mb-1">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#002B5C] focus:ring-1 focus:ring-[#002B5C] transition-all"
            />
          </div>
          {hasImage && (
            <button
              type="button"
              onClick={() => {
                onChange?.("");
                toast.success("Image cleared");
              }}
              className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              title="Clear Image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Single Mode: EITHER Active Image Card OR Upload Dropzone */}
      {!multiple && (
        <>
          {hasImage ? (
            /* Active Image Card with REPLACE CTA and REMOVE */
            <div className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4 group transition-all">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={value || ""}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><text y='15'>🖼️</text></svg>";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Uploaded on Cloudinary</span>
                  </div>
                  <p
                    className="text-[11px] text-slate-500 font-mono truncate mt-0.5 max-w-[200px] sm:max-w-xs md:max-w-md"
                    title={value || ""}
                  >
                    {value}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Replace & Remove */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100/80 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#002B5C]" />
                      <span>Replacing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Replace</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange?.("");
                    toast.success("Image removed");
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Upload Dropzone (When No Image is Present) */
            !showUrlInput && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`w-full py-6 px-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group disabled:opacity-50 ${
                  isDragOver
                    ? "border-[#002B5C] bg-blue-50/60"
                    : "border-slate-200 hover:border-[#002B5C] bg-slate-50/70 hover:bg-slate-50"
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2 py-1">
                    <Loader2 className="w-6 h-6 animate-spin text-[#002B5C]" />
                    <p className="text-xs font-bold text-slate-700">
                      Compressing & uploading WebP...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[#002B5C] group-hover:border-[#002B5C] transition-all shadow-xs">
                      <CloudUpload className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-800">
                        Click to browse or drag and drop
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PNG, JPG, WebP up to 15MB (Auto-compressed)
                      </p>
                    </div>
                  </>
                )}
              </div>
            )
          )}
        </>
      )}

      {/* Multiple Mode: BOTH Upload Dropzone AND list of uploaded images display */}
      {multiple && (
        <div className="flex flex-col gap-3 w-full">
          {!showUrlInput && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`w-full py-6 px-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group disabled:opacity-50 ${
                isDragOver
                  ? "border-[#002B5C] bg-blue-50/60"
                  : "border-slate-200 hover:border-[#002B5C] bg-slate-50/70 hover:bg-slate-50"
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 py-1">
                  <Loader2 className="w-6 h-6 animate-spin text-[#002B5C]" />
                  <p className="text-xs font-bold text-slate-700">
                    Compressing & uploading WebP...
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[#002B5C] group-hover:border-[#002B5C] transition-all shadow-xs">
                    <CloudUpload className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-800">
                      Click to browse or drag and drop
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      PNG, JPG, WebP up to 15MB (Upload multiple images)
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {values && values.length > 0 && (
            <div className="flex flex-col gap-2 w-full">
              {values.map((imgUrl, idx) => (
                <div
                  key={`${imgUrl}-${idx}`}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt="Thumbnail"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Uploaded</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono truncate" title={imgUrl}>
                        {imgUrl}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = values.filter((_, i) => i !== idx);
                      onChangeMultiple?.(updated);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {helperText && <span className="text-[11px] text-slate-500">{helperText}</span>}
    </div>
  );
}
