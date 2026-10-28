"use client";

import React, { useState, useRef } from "react";
import {
  CloudUpload,
  Link as LinkIcon,
  X,
  Loader2,
  Image as ImageIcon,
  Check,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface ImagePickerFieldProps {
  label?: string;
  value?: string | null;
  onChange?: (value: string) => void;
  helperText?: string;
  tooltip?: string;
  placeholder?: string;
  folder?: string;
}

export function ImagePickerField({
  label = "Upload Image",
  value = "",
  onChange,
  helperText,
  tooltip,
  placeholder = "https://... or upload from computer",
  folder = "lfcs-school",
}: ImagePickerFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
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
        onChange?.(json.url);
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

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 tracking-wide flex items-center gap-1.5">
          {label}
          {tooltip && (
            <div className="group relative flex items-center">
              <HelpCircle className="w-3.5 h-3.5 cursor-help text-gray-400 hover:text-gray-600 transition-colors" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[260px] px-3 py-1.5 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                {tooltip}
              </div>
            </div>
          )}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#6a2238] hover:underline font-semibold cursor-pointer"
        >
          {showUrlInput ? "Upload File" : "Enter Image URL"}
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#6a2238] text-gray-800"
            />
          </div>
          {value && (
            <button
              type="button"
              onClick={() => onChange?.("")}
              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-[#6a2238] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-gray-50/50 hover:bg-white group"
          >
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
            {uploading ? (
              <div className="flex items-center gap-2 text-sm text-[#6a2238]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Compressing & uploading WebP...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-[#6a2238] group-hover:scale-110 transition-all">
                  <CloudUpload className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-700">
                    Click to browse or drag and drop
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    PNG, JPG, WebP up to 15MB (Auto-compressed)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {value && (
        <div className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-100 rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden relative flex-shrink-0">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><text y='15'>🖼️</text></svg>";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-800 truncate">{value}</p>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
              <Check className="w-3 h-3" /> Image active
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChange?.("")}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {helperText && <span className="text-[11px] text-gray-500">{helperText}</span>}
    </div>
  );
}
