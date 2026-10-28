import React from "react";
import { ChevronDown, Plus } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function SectionHeader({
  title,
  description,
  badge,
  isOpen = false,
  onToggle,
  action,
}: SectionHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-100 pb-4 select-none">
      <div className="flex flex-col gap-1.5 cursor-pointer flex-1 group" onClick={onToggle}>
        <h2 className="text-gray-900 text-lg font-bold group-hover:text-[#0B0F29] transition-colors flex items-center gap-2">
          {title}
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-[#0E5A60]">
              {badge}
            </span>
          )}
        </h2>
        {description && <p className="text-gray-500 text-sm">{description}</p>}
      </div>

      {!action && onToggle && (
        <ChevronDown
          onClick={onToggle}
          className={`text-gray-400 h-5 w-5 cursor-pointer transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#0E5A60]" : ""
          }`}
        />
      )}

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="bg-[#0B0F29] w-max text-white ml-auto px-6 py-2.5 rounded-full font-semibold tracking-wide hover:bg-black transition-all duration-300 border border-transparent hover:border-[#0E5A60] hover:shadow-[0_0_25px_rgba(14,90,96,0.3)] flex items-center justify-center gap-2 group whitespace-nowrap cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> {action.label}
        </button>
      )}
    </header>
  );
}
