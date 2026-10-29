"use client";

import React from "react";
import { ChevronDown, Trash2 } from "lucide-react";

interface CollapsibleCardProps {
  index: number;
  title: string;
  subtitle?: string;
  badge?: string;
  thumbnail?: string;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  deleteTitle?: string;
  children: React.ReactNode;
}

export function CollapsibleCard({
  index,
  title,
  subtitle,
  badge,
  thumbnail,
  isOpen,
  onToggle,
  onDelete,
  deleteTitle = "Delete Item",
  children,
}: CollapsibleCardProps) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isOpen
          ? "bg-gray-50/80 border-gray-200 shadow-xs"
          : "bg-white hover:bg-gray-50/70 border-gray-200/80 hover:border-gray-300"
      }`}
    >
      {/* Clickable Card Header */}
      <div
        onClick={onToggle}
        className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 cursor-pointer select-none group transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-colors ${
              isOpen
                ? "bg-[#842b46] text-white"
                : "bg-[#842b46]/10 text-[#842b46] group-hover:bg-[#842b46]/20"
            }`}
          >
            {index + 1}
          </span>

          {thumbnail && (
            <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200/80 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt="thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}

          <div className="min-w-0 flex-1 flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-gray-800 truncate group-hover:text-[#842b46] transition-colors">
              {title || `Item #${index + 1}`}
            </span>
            {badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 shrink-0">
                {badge}
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-gray-400 font-normal truncate hidden sm:inline">
                • {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            title={deleteTitle}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title={isOpen ? "Collapse" : "Expand"}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-[#842b46]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expandable Form Fields Body */}
      {isOpen && (
        <div className="p-4 sm:p-5 pt-3 border-t border-gray-200/70 space-y-3.5 bg-white/60">
          {children}
        </div>
      )}
    </div>
  );
}

