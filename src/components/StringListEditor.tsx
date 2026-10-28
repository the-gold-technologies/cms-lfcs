"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface StringListEditorProps {
  label: string;
  items: string[];
  onChange: (newItems: string[]) => void;
  placeholder?: string;
  helperText?: string;
}

export function StringListEditor({
  label,
  items = [],
  onChange,
  placeholder = "Add item...",
  helperText,
}: StringListEditorProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!items.includes(trimmed)) {
      onChange([...items, trimmed]);
    }
    setInput("");
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs font-bold text-gray-700 tracking-wide">{label}</label>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#6a2238] focus:ring-1 focus:ring-[#6a2238] text-gray-800"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {helperText && <span className="text-[11px] text-gray-500">{helperText}</span>}

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/60 rounded-lg text-xs font-medium"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-amber-700 hover:text-red-600 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

